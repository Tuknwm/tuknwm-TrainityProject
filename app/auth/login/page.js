"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn, useMockAuth } from "@/lib/mockAuth";
import NavAuthPopout from "@/components/NavAuthPopout";
import KineticGrid from "@/components/KineticGrid";

const T = { p1: "#020303", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.40)", green: "#e1fc9d", greenTxt: "#0f1f0f" };

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update } = useMockAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password });
    if (res.error) { setError(res.error); setLoading(false); return; }
    const raw = localStorage.getItem("trainity_session");
    if (raw) {
      const session = JSON.parse(raw);
      update(session.user);
      router.push(session.user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.p1, display: "flex", flexDirection: "column", position: "relative" }}>
      <style>{`
        @keyframes termCursor{0%,100%{opacity:1}50%{opacity:0}}
        .term-input{background:none;border:none;outline:none;color:#ffffff;font-family:'Courier New',monospace;font-size:13px;padding:0;margin:0;min-width:2px;width:auto;max-width:220px;}
        .term-input::placeholder{color:rgba(255,255,255,0.25);}
        .term-line:focus-within .term-cursor{animation:termCursor 1s step-end infinite;}
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <KineticGrid
          background="#020303"
          dotColor="rgba(225,252,157,0.45)"
          lineColor="rgba(225,252,157,0.18)"
          trailColor="#e1fc9d"
          spacing={40}
          radius={220}
          strength={4}
          trail={false}
        />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 10%, rgba(41,60,45,0.25) 0%, transparent 50%)", pointerEvents: "none" }} />
      </div>

      <header style={{ position: "fixed", top: "16px", left: 0, right: 0, zIndex: 100, pointerEvents: "none" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", paddingLeft: "max(24px, env(safe-area-inset-left,0px))", paddingRight: "max(24px, env(safe-area-inset-right,0px))" }}>
          <div className="glass-nav" style={{ pointerEvents: "auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 10px 10px 20px" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
              <Image src="/Logo/TrainityFullWhite.svg" alt="Trainity" width={130} height={32} priority />
            </Link>
            <nav />
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <NavAuthPopout btn="signin" color={T.t2} />
              <NavAuthPopout btn="register" />
            </div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: "500px" }}>

          <div style={{ background: "rgba(8,11,8,0.80)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "12px", overflow: "hidden", backdropFilter: "blur(16px)" }}>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28c840" }} />
                <span style={{ fontFamily: "'Courier New',monospace", fontSize: "11px", color: "rgba(255,255,255,0.25)", marginLeft: "8px" }}>trainity — auth</span>
              </div>
              <button
                type="submit"
                form="login-form"
                disabled={loading}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: T.green, color: T.greenTxt, border: "none", borderRadius: "6px", padding: "5px 14px", fontFamily: "var(--font-polysans)", fontSize: "12px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
              >
                <svg width="9" height="10" viewBox="0 0 9 10" fill="none"><path d="M1 1l7 4-7 4V1z" fill="currentColor"/></svg>
                {loading ? "Running..." : "Run"}
              </button>
            </div>

            <div style={{ padding: "24px", fontFamily: "'Courier New',monospace", fontSize: "13px", lineHeight: "1.9" }}>
              <div style={{ color: "rgba(255,255,255,0.25)", marginBottom: "18px" }}>
                {`// sign in to continue your journey`}
              </div>

              <form id="login-form" onSubmit={handleLogin}>
                <div className="term-line" style={{ marginBottom: "8px", cursor: "text" }} onClick={(e) => e.currentTarget.querySelector("input")?.focus()}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.40)" }}>&lt;</span>
                    <span style={{ color: "#7dd3a8" }}>input</span>
                    <span style={{ color: "rgba(255,255,255,0.40)" }}> </span>
                    <span style={{ color: "#e1fc9d" }}>type</span>
                    <span style={{ color: "rgba(255,255,255,0.40)" }}>=</span>
                    <span style={{ color: "#fca97a" }}>&quot;email&quot;</span>
                    <span style={{ color: "rgba(255,255,255,0.40)" }}> </span>
                    <span style={{ color: "#e1fc9d" }}>placeholder</span>
                    <span style={{ color: "rgba(255,255,255,0.40)" }}>=</span>
                    <span style={{ color: "#fca97a" }}>&quot;your email...&quot;</span>
                    <span style={{ color: "rgba(255,255,255,0.40)" }}>&gt;</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", paddingLeft: "16px" }}>
                    <input className="term-input" type="email" placeholder="your email..." value={email} onChange={(e) => setEmail(e.target.value)} size={email.length || 12} required style={{ background: "none", border: "none", outline: "none", color: "#ffffff", fontFamily: "monospace", fontSize: "13px", padding: 0 }} />
                    <span style={{ color: "rgba(255,255,255,0.40)" }}>&lt;/</span>
                    <span style={{ color: "#7dd3a8" }}>input</span>
                    <span style={{ color: "rgba(255,255,255,0.40)" }}>&gt;</span>
                  </div>
                </div>

                <div className="term-line" style={{ marginBottom: "20px", cursor: "text" }} onClick={(e) => e.currentTarget.querySelector("input")?.focus()}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.40)" }}>&lt;</span>
                    <span style={{ color: "#7dd3a8" }}>input</span>
                    <span style={{ color: "rgba(255,255,255,0.40)" }}> </span>
                    <span style={{ color: "#e1fc9d" }}>type</span>
                    <span style={{ color: "rgba(255,255,255,0.40)" }}>=</span>
                    <span style={{ color: "#fca97a" }}>&quot;password&quot;</span>
                    <span style={{ color: "rgba(255,255,255,0.40)" }}> </span>
                    <span style={{ color: "#e1fc9d" }}>placeholder</span>
                    <span style={{ color: "rgba(255,255,255,0.40)" }}>=</span>
                    <span style={{ color: "#fca97a" }}>&quot;your password...&quot;</span>
                    <span style={{ color: "rgba(255,255,255,0.40)" }}>&gt;</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", paddingLeft: "16px" }}>
                    <input className="term-input" type="password" placeholder="your password..." value={password} onChange={(e) => setPassword(e.target.value)} size={password.length || 14} required style={{ background: "none", border: "none", outline: "none", color: "#ffffff", fontFamily: "monospace", fontSize: "13px", padding: 0 }} />
                    <span style={{ color: "rgba(255,255,255,0.40)" }}>&lt;/</span>
                    <span style={{ color: "#7dd3a8" }}>input</span>
                    <span style={{ color: "rgba(255,255,255,0.40)" }}>&gt;</span>
                  </div>
                </div>

                {error && (
                  <div style={{ color: "#f87171", fontSize: "12px", marginBottom: "14px" }}>
                    {`// error: ${error}`}
                  </div>
                )}

                <div style={{ paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.20)", fontSize: "11px", lineHeight: "1.8" }}>
                  {`/* demo: admin@trainity.com / password123 */`}<br />
                  {`/* user:  demo@trainity.com / password123 */`}
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
