"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import { useSession } from "@/lib/mockAuth";
import { getAdminDashboard } from "@/lib/mockStore";

const T = { p1: "#293c2d", p2: "#1f2e22", p3: "#141e16", border: "rgba(255,255,255,0.10)", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.40)", orange: "#ff682c", green: "#e1fc9d", greenTxt: "#0f1f0f" };

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") { router.push("/"); return; }
    setData(getAdminDashboard());
  }, [status, router]);

  if (status === "loading" || !data) return (
    <div style={{ minHeight: "100vh", background: T.p3, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "var(--font-inter)", color: T.t3 }}>Loading dashboard...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080b08", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 18% 92%, rgba(41,60,45,0.90) 0%, rgba(20,38,22,0.55) 35%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <AppNav />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ padding: "8px 0 32px" }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 300, color: T.t3, margin: "0 0 4px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Admin panel</p>
          <h1 style={{ fontFamily: "var(--font-polysans)", fontSize: "36px", fontWeight: 700, letterSpacing: "-1px", color: T.t1, margin: "0 0 8px" }}>
            {session?.user?.name ?? "Admin"}
          </h1>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", fontWeight: 300, color: T.t2, margin: 0 }}>Manage your platform — products, reviews, and purchase history.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 600, letterSpacing: "-0.3px", color: T.t1, margin: "0 0 16px" }}>Recent Activity</h2>
            {(!data?.latestUserActivity || data.latestUserActivity.length === 0) ? (
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 300, color: T.t3 }}>No activity yet.</p>
            ) : data.latestUserActivity.map((a, i) => (
              <div key={i}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 8px", margin: "0 -8px", borderRadius: "8px", background: "transparent", transition: "background 0.15s", borderBottom: i < data.latestUserActivity.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: T.green, color: T.greenTxt, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px", flexShrink: 0 }}>
                    {a.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-polysans)", fontSize: "13px", fontWeight: 600, color: T.t1, margin: "0 0 2px" }}>{a.userName}</p>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 300, color: T.t3, margin: 0 }}>{a.productName}</p>
                  </div>
                </div>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 300, color: T.t3 }}>{new Date(a.purchasedAt).toLocaleDateString("en-US")}</span>
              </div>
            ))}
          </div>

          <div style={{ borderLeft: `1px solid ${T.border}`, paddingLeft: "32px" }}>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px", paddingBottom: "16px", borderBottom: `1px solid ${T.border}` }}>
              <div onClick={() => router.push("/admin/review")}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                style={{ cursor: "pointer", flex: 1, borderRadius: "8px", padding: "8px", margin: "-8px", background: "transparent", transition: "background 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3h10M2 7h7M2 11h5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  <span style={{ fontFamily: "var(--font-polysans)", fontSize: "13px", fontWeight: 600, color: T.t1 }}>Reviews</span>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 300, color: T.t3, margin: 0 }}>Manage user reviews</p>
              </div>

              <div style={{ width: "1px", background: T.border, alignSelf: "stretch" }} />

              <div onClick={() => router.push("/admin/produk")}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                style={{ cursor: "pointer", flex: 1, borderRadius: "8px", padding: "8px", margin: "-8px", background: "transparent", transition: "background 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9" rx="1.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/><path d="M5 3V2a2 2 0 014 0v1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  <span style={{ fontFamily: "var(--font-polysans)", fontSize: "13px", fontWeight: 600, color: T.t1 }}>Products</span>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 300, color: T.t3, margin: 0 }}>Add or edit courses</p>
              </div>

              <div style={{ width: "1px", background: T.border, alignSelf: "stretch" }} />

              <div onClick={() => router.push("/admin/pembelian")}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                style={{ cursor: "pointer", flex: 1, borderRadius: "8px", padding: "8px", margin: "-8px", background: "transparent", transition: "background 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="10" rx="1.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/><path d="M1 5h12" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/></svg>
                  <span style={{ fontFamily: "var(--font-polysans)", fontSize: "13px", fontWeight: 600, color: T.t1 }}>Purchases</span>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 300, color: T.t3, margin: 0 }}>View purchase history</p>
              </div>
            </div>

            <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 600, letterSpacing: "-0.3px", color: T.t1, margin: "0 0 16px" }}>Latest Reviews</h2>
            {(!data?.latestReviews || data.latestReviews.length === 0) ? (
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 300, color: T.t3 }}>No reviews yet.</p>
            ) : data.latestReviews.map((r, i) => (
              <div key={i}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                style={{ padding: "8px", margin: "0 -8px 4px", borderRadius: "8px", background: "transparent", transition: "background 0.15s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <p style={{ fontFamily: "var(--font-polysans)", fontSize: "13px", fontWeight: 600, color: T.t1, margin: 0 }}>{r.userName}</p>
                  <span style={{ fontSize: "11px", color: T.green }}>{"★".repeat(r.rating)}</span>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", fontWeight: 300, color: T.t2, margin: "0 0 2px", lineHeight: 1.4 }}>{r.comment}</p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 300, color: T.t3, margin: 0 }}>{r.productName}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
