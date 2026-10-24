"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import { useSession } from "@/lib/mockAuth";
import { getOwnedByUser, getProducts, getProgress } from "@/lib/mockStore";

const T = { p1: "#293c2d", p2: "#1f2e22", p3: "#141e16", border: "rgba(255,255,255,0.10)", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.35)", orange: "#ff682c", green: "#e1fc9d", greenTxt: "#0f1f0f" };

export default function OwnedProductPage() {
  const { data: session, status } = useSession();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") { router.push("/auth/login"); return; }
    const userId = session.user.id;
    const owned = getOwnedByUser(userId);
    const products = getProducts();
    setCourses(owned.map((up) => {
      const prod = products.find((p) => p._id === up.productId);
      return {
        productId: up.productId,
        name: prod?.name ?? "",
        shortDesc: prod?.shortDesc ?? "",
        kodePertama: prod?.video?.[0]?.kodePelajaran ?? null,
        progress: getProgress(userId, up.productId),
      };
    }));
    setLoading(false);
  }, [status, session, router]);

  if (loading) {
    return <div style={{ minHeight: "100vh", background: T.p3, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: T.t3, fontFamily: "var(--font-inter)" }}>Loading courses...</p></div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: T.p3 }}>
      <AppNav />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "var(--font-polysans)", fontSize: "28px", fontWeight: 400, letterSpacing: "-0.5px", color: T.t1, margin: "0 0 8px" }}>My Courses</h1>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: T.t2, margin: "0 0 32px" }}>Continue your learning journey.</p>

        {courses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", background: T.p2, border: `1px solid ${T.border}`, borderRadius: "12px" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "16px", color: T.t3, marginBottom: "16px" }}>You don't own any courses yet.</p>
            <Link href="/produk" style={{ display: "inline-block", background: T.green, color: T.greenTxt, borderRadius: "8px", padding: "10px 24px", fontFamily: "var(--font-polysans)", fontSize: "14px", textDecoration: "none", fontWeight: 600 }}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {courses.map((c) => (
              <div key={c.name} style={{ background: T.p2, border: `1px solid ${T.border}`, borderRadius: "12px", overflow: "hidden" }}>
                {c.kodePertama && (
                  <div style={{ position: "relative", paddingTop: "56.25%", background: T.p1 }}>
                    <img src={`https://i.ytimg.com/vi/${c.kodePertama}/hqdefault.jpg`} alt={c.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ padding: "20px" }}>
                  <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "16px", fontWeight: 400, color: T.t1, margin: "0 0 8px" }}>{c.name}</h2>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3, margin: "0 0 12px" }}>
                    {c.progress === 100 ? "✅ Completed!" : c.progress > 0 ? "⏳ In Progress" : "💡 Not Started"}
                  </p>
                  <div style={{ height: "4px", background: T.border, borderRadius: "2px", marginBottom: "6px" }}>
                    <div style={{ height: "100%", width: `${c.progress}%`, background: T.green, borderRadius: "2px" }} />
                  </div>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: T.t3, margin: "0 0 16px" }}>{c.progress}% complete</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link href={`/user/belajar/${c.name}`} style={{ flex: 1, textAlign: "center", background: T.green, color: T.greenTxt, borderRadius: "6px", padding: "8px 12px", fontFamily: "var(--font-polysans)", fontSize: "13px", textDecoration: "none", fontWeight: 600 }}>
                      {c.progress === 100 ? "View Details" : c.progress > 0 ? "Continue" : "Start Learning"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
