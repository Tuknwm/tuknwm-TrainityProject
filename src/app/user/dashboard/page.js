"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { useSession } from "@/lib/mockAuth";
import { getOwnedByUser, getProducts, getProgress } from "@/lib/mockStore";

const T = { p1: "#293c2d", p2: "#1f2e22", p3: "#141e16", border: "rgba(255,255,255,0.10)", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.40)", orange: "#ff682c", green: "#e1fc9d", greenTxt: "#0f1f0f" };

function thumbUrl(kod) {
  return kod ? `https://i.ytimg.com/vi/${kod}/hqdefault.jpg` : null;
}

export default function UserDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [inProgress, setInProgress] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    if (!session?.user) return;
    const userId = session.user.id;
    const owned = getOwnedByUser(userId);
    const allProducts = getProducts();
    const ownedIds = new Set(owned.map((up) => up.productId));

    setInProgress(owned.map((up) => {
      const prod = allProducts.find((p) => p._id === up.productId);
      const progress = getProgress(userId, up.productId);
      return { id: up.productId, name: prod?.name ?? "", shortDesc: prod?.shortDesc ?? "", thumb: thumbUrl(prod?.video?.[0]?.kodePelajaran), progress };
    }));
    setRecommended(allProducts.filter((p) => !ownedIds.has(p._id)).map((p) => ({
      id: p._id, name: p.name, shortDesc: p.shortDesc, thumb: thumbUrl(p.video?.[0]?.kodePelajaran),
    })));
    setLoading(false);
  }, [session]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") { router.push("/"); return; }
    loadData();
  }, [status, loadData, router]);

  if (status === "loading" || loading) {
    return (
      <div style={{ minHeight: "100vh", background: T.p3, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-inter)", color: T.t3 }}>Loading dashboard...</p>
      </div>
    );
  }

  const user = session?.user;

  return (
    <div style={{ minHeight: "100vh", background: "#080b08", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 18% 92%, rgba(41,60,45,0.90) 0%, rgba(20,38,22,0.55) 35%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <AppNav />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ padding: "8px 0 32px" }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 300, color: T.t3, margin: "0 0 4px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Welcome back</p>
          <h1 style={{ fontFamily: "var(--font-polysans)", fontSize: "36px", fontWeight: 700, letterSpacing: "-1px", color: T.t1, margin: "0 0 8px" }}>
            {user?.name ?? "User"}
          </h1>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", fontWeight: 300, color: T.t2, margin: 0 }}>Keep up your progress and achieve your learning goals.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 600, letterSpacing: "-0.3px", color: T.t1, margin: "0 0 16px" }}>In Progress</h2>
            {inProgress.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 300, color: T.t3, marginBottom: "12px" }}>You haven't enrolled in any courses yet.</p>
                <button onClick={() => router.push("/produk")} style={{ background: T.green, color: T.greenTxt, border: "none", borderRadius: "8px", padding: "8px 16px", fontFamily: "var(--font-polysans)", fontSize: "13px", cursor: "pointer" }}>Browse Courses</button>
              </div>
            ) : inProgress.map((c) => (
              <div key={c.id} onClick={() => router.push(`/user/belajar/${c.name}`)}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center", cursor: "pointer", borderRadius: "8px", padding: "8px", margin: "0 -8px 16px", background: "transparent", transition: "background 0.15s" }}>
                {c.thumb && <div style={{ width: "140px", height: "95px", flexShrink: 0, borderRadius: "8px", overflow: "hidden" }}>
                  <img src={c.thumb} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-polysans)", fontSize: "13px", fontWeight: 600, color: T.t1, margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</p>
                  <div style={{ height: "3px", background: T.border, borderRadius: "2px", marginBottom: "4px" }}>
                    <div style={{ height: "100%", width: `${c.progress}%`, background: T.green, borderRadius: "2px" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 300, color: T.t3, margin: 0 }}>{c.progress}% complete</p>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500, color: T.green }}>Continue</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderLeft: `1px solid ${T.border}`, paddingLeft: "32px" }}>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px", paddingBottom: "16px", borderBottom: `1px solid ${T.border}` }}>
              <div onClick={() => router.push("/user/profile")}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                style={{ cursor: "pointer", flex: 1, borderRadius: "8px", padding: "8px", margin: "-8px", background: "transparent", transition: "background 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/><path d="M2 13c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  <span style={{ fontFamily: "var(--font-polysans)", fontSize: "13px", fontWeight: 600, color: T.t1 }}>My Profile</span>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 300, color: T.t3, margin: 0 }}>Manage your personal info</p>
              </div>

              <div style={{ width: "1px", background: T.border, alignSelf: "stretch" }} />

              <div onClick={() => router.push("/user/belajar")}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                style={{ cursor: "pointer", flex: 1, borderRadius: "8px", padding: "8px", margin: "-8px", background: "transparent", transition: "background 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H2zM8 8h4v4H8z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                  <span style={{ fontFamily: "var(--font-polysans)", fontSize: "13px", fontWeight: 600, color: T.t1 }}>My Learning</span>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 300, color: T.t3, margin: 0 }}>Access your enrolled courses</p>
              </div>

              <div style={{ width: "1px", background: T.border, alignSelf: "stretch" }} />

              <div onClick={() => router.push("/produk")}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                style={{ cursor: "pointer", flex: 1, borderRadius: "8px", padding: "8px", margin: "-8px", background: "transparent", transition: "background 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9" rx="1.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/><path d="M5 3V2a2 2 0 014 0v1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  <span style={{ fontFamily: "var(--font-polysans)", fontSize: "13px", fontWeight: 600, color: T.t1 }}>Courses</span>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 300, color: T.t3, margin: 0 }}>Browse all available courses</p>
              </div>
            </div>
            <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 600, letterSpacing: "-0.3px", color: T.t1, margin: "0 0 16px" }}>Recommended for You</h2>
            {recommended.length === 0 ? (
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 300, color: T.t3 }}>You already own all available courses!</p>
            ) : recommended.map((c) => (
              <div key={c.id} onClick={() => router.push(`/produk/${c.name}`)}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                style={{ display: "flex", gap: "12px", marginBottom: "12px", padding: "8px", margin: "0 -8px 12px", borderRadius: "8px", background: "transparent", cursor: "pointer", transition: "background 0.15s" }}>
                {c.thumb && <div style={{ width: "56px", height: "42px", flexShrink: 0, borderRadius: "4px", overflow: "hidden" }}>
                  <img src={c.thumb} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>}
                <div>
                  <p style={{ fontFamily: "var(--font-polysans)", fontSize: "13px", fontWeight: 600, color: T.t1, margin: "0 0 4px" }}>{c.name}</p>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 300, color: T.t3, margin: 0 }}>{c.shortDesc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
