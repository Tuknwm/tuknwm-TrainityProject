"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import { useSession } from "@/lib/mockAuth";
import { getProductByName, getOwnedByUser, getProgress } from "@/lib/mockStore";

const T = { p2: "#1f2e22", p3: "#141e16", border: "rgba(255,255,255,0.10)", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.35)", orange: "#ff682c", green: "#e1fc9d", greenTxt: "#0f1f0f" };

export default function SertifikatPage() {
  const params = useParams();
  const courseKey = decodeURIComponent(params.key);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cert, setCert] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) { router.push("/auth/login"); return; }

    const product = getProductByName(courseKey);
    if (!product) { setError("Kursus tidak ditemukan."); setLoading(false); return; }

    const progress = getProgress(session.user.id, product._id);
    if (progress < 100) { setError("Anda belum menyelesaikan kursus ini. Selesaikan semua video terlebih dahulu."); setLoading(false); return; }

    const ups = getOwnedByUser(session.user.id);
    const up = ups.find((u) => u.productId === product._id);
    setCert({
      userName: session.user.username,
      courseName: product.name,
      completedAt: up?.createdAt ?? new Date().toISOString(),
      certificateId: `TRN-${product._id.slice(-4).toUpperCase()}-${session.user.id.slice(-4).toUpperCase()}`,
    });
    setLoading(false);
  }, [status, session, courseKey, router]);

  const tanggal = cert?.completedAt ? new Date(cert.completedAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : "-";

  if (loading) return (
    <div style={{ minHeight: "100vh", background: T.p3, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "var(--font-inter)", color: T.t3 }}>Loading certificate...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.p3 }}>
      <AppNav />
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
        {error ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ background: T.p2, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "48px" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</div>
              <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "22px", fontWeight: 400, color: T.t1, margin: "0 0 12px" }}>Certificate Not Available</h2>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: T.t2, marginBottom: "24px" }}>{error}</p>
              <button onClick={() => router.push("/user/belajar")} style={{ background: T.green, color: T.greenTxt, border: "none", borderRadius: "8px", padding: "10px 24px", fontFamily: "var(--font-polysans)", fontSize: "14px", cursor: "pointer", fontWeight: 600 }}>
                Back to My Learning
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ background: "linear-gradient(135deg, #111827 0%, #1f2e22 50%, #111827 100%)", border: "2px solid rgba(225,252,157,0.3)", borderRadius: "16px", padding: "48px", textAlign: "center", marginBottom: "24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "16px", right: "24px", fontFamily: "var(--font-inter)", fontSize: "11px", color: T.t3, letterSpacing: "0.1em" }}>
                ID: {cert.certificateId}
              </div>
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(225,252,157,0.1)", border: "1px solid rgba(225,252,157,0.3)", borderRadius: "20px", padding: "6px 16px", fontFamily: "var(--font-inter)", fontSize: "12px", color: T.green, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "24px" }}>
                  ✅ CERTIFICATE OF COMPLETION
                </div>
              </div>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t3, margin: "0 0 8px" }}>This certificate is awarded to</p>
              <h1 style={{ fontFamily: "var(--font-polysans)", fontSize: "clamp(28px,5vw,42px)", fontWeight: 400, letterSpacing: "-0.03em", color: T.t1, margin: "0 0 4px" }}>{cert.userName}</h1>
              <div style={{ width: "120px", height: "2px", background: T.green, margin: "8px auto 24px" }} />
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: T.t2, margin: "0 0 8px" }}>has successfully completed the course</p>
              <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "clamp(18px,3vw,24px)", fontWeight: 400, color: T.green, margin: "0 0 24px", letterSpacing: "-0.02em" }}>{cert.courseName}</h2>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3 }}>Completed: <span style={{ color: T.t2 }}>{tanggal}</span></p>
              <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: `1px solid ${T.border}` }}>
                <p style={{ fontFamily: "var(--font-polysans)", fontSize: "15px", color: T.t1, margin: "0 0 4px" }}>Fabio</p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: T.t3, margin: 0 }}>Lead Instructor — Trainity</p>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button onClick={() => window.print()} style={{ background: T.green, color: T.greenTxt, border: "none", borderRadius: "8px", padding: "12px 28px", fontFamily: "var(--font-polysans)", fontSize: "15px", cursor: "pointer", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "8px" }}>
                🖨️ Print / Save PDF
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
