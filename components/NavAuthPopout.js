"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, mockRegister, useMockAuth, useSession } from "@/lib/mockAuth";
import Link from "next/link";

const T = {
  p3:     "#0e1610",
  border: "rgba(255,255,255,0.10)",
  t1:     "#ffffff",
  t2:     "rgba(255,255,255,0.55)",
  t3:     "rgba(255,255,255,0.30)",
  green:  "#e1fc9d",
  greenTxt: "#0f1f0f",
};

function Field({ label, type, placeholder, value, onChange, disabled }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500, color: T.t3, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${T.border}`,
          borderRadius: "8px",
          padding: "11px 14px",
          fontFamily: "var(--font-inter)",
          fontSize: "14px",
          color: T.t1,
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function Modal({ open, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (open) {
      setRendered(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setRendered(false), 260);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!rendered || typeof document === "undefined") return null;

  return createPortal(
    <>
      <style>{`@keyframes glowPulse{0%,100%{box-shadow:0 32px 80px rgba(0,0,0,.70),0 0 80px rgba(255,255,255,.20)}50%{box-shadow:0 32px 80px rgba(0,0,0,.70),0 0 120px rgba(255,255,255,.35)}}`}</style>
      <div
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: visible ? "rgba(0,0,0,0.60)" : "rgba(0,0,0,0)",
          backdropFilter: visible ? "blur(8px)" : "blur(0px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.25s ease, backdrop-filter 0.25s ease",
        }}
      >
        <div style={{
          position: "relative", width: "380px",
          background: "radial-gradient(ellipse at 18% 108%, rgba(41,60,45,0.95) 0%, rgba(20,38,22,0.70) 40%, transparent 70%), #080b08",
          borderRadius: "8px", padding: "32px",
          animation: visible ? "glowPulse 3s ease-in-out infinite" : "none",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
          transition: "opacity 0.25s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          maxHeight: "90vh", overflowY: "auto",
        }}>
          <button
            onClick={onClose}
            style={{ position: "absolute", top: "14px", right: "14px", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.45)" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}

function SignInModal({ open, onClose, onSwitchRegister }) {
  const router = useRouter();
  const { update } = useMockAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password });
    if (res.error) { setError(res.error); setLoading(false); return; }
    const raw = localStorage.getItem("trainity_session");
    if (raw) {
      const session = JSON.parse(raw);
      update(session.user);
      onClose();
      router.push(session.user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
    }
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <style>{`
        @keyframes termCursor{0%,100%{opacity:1}50%{opacity:0}}
        .term-input{background:none;border:none;outline:none;color:#ffffff;font-family:'Courier New',monospace;font-size:13px;padding:0;margin:0;min-width:2px;width:auto;max-width:180px;}
        .term-input::placeholder{color:rgba(255,255,255,0.25);}
        .term-line:focus-within .term-cursor{animation:termCursor 1s step-end infinite;}
      `}</style>

      <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"16px" }}>
        <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#ff5f57" }} />
        <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#febc2e" }} />
        <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#28c840" }} />
        <span style={{ fontFamily:"'Courier New',monospace", fontSize:"11px", color:"rgba(255,255,255,0.25)", marginLeft:"8px" }}>trainity — auth</span>
      </div>

      <div style={{ background:"rgba(0,0,0,0.45)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", padding:"20px 18px", fontFamily:"'Courier New',monospace", fontSize:"13px", lineHeight:"1.9" }}>

        <div style={{ color:"rgba(255,255,255,0.25)", marginBottom:"8px" }}>
          {`// sign in to continue your journey`}
        </div>

        <div style={{ color:"rgba(255,255,255,0.20)", marginBottom:"14px", fontSize:"11px" }}>
          {`/* demo: admin@trainity.com / password123 */`}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="term-line" style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:0, marginBottom:"6px", cursor:"text" }} onClick={(e) => e.currentTarget.querySelector("input")?.focus()}>
            <span style={{ color:"rgba(255,255,255,0.40)" }}>&lt;</span>
            <span style={{ color:"#7dd3a8" }}>input</span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}> </span>
            <span style={{ color:"#e1fc9d" }}>type</span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}>=</span>
            <span style={{ color:"#fca97a" }}>&quot;email&quot;</span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}> </span>
            <span style={{ color:"#e1fc9d" }}>placeholder</span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}>=</span>
            <span style={{ color:"#fca97a" }}>&quot;your email...&quot;</span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}>&gt;</span>
            <input
              className="term-input"
              type="email"
              placeholder="your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size={email.length || 12}
              required
            />
            <span className="term-cursor" style={{ display:"inline-block", width:"7px", height:"13px", background:"#e1fc9d", verticalAlign:"middle", marginLeft:"1px" }} />
            <span style={{ color:"rgba(255,255,255,0.40)" }}>&lt;/</span>
            <span style={{ color:"#7dd3a8" }}>input</span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}>&gt;</span>
          </div>

          <div className="term-line" style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:0, marginBottom:"16px", cursor:"text" }} onClick={(e) => e.currentTarget.querySelector("input")?.focus()}>
            <span style={{ color:"rgba(255,255,255,0.40)" }}>&lt;</span>
            <span style={{ color:"#7dd3a8" }}>input</span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}> </span>
            <span style={{ color:"#e1fc9d" }}>type</span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}>=</span>
            <span style={{ color:"#fca97a" }}>&quot;password&quot;</span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}> </span>
            <span style={{ color:"#e1fc9d" }}>placeholder</span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}>=</span>
            <span style={{ color:"#fca97a" }}>&quot;your password...&quot;</span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}>&gt;</span>
            <input
              className="term-input"
              type="password"
              placeholder="your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size={password.length || 14}
              required
            />
            <span className="term-cursor" style={{ display:"inline-block", width:"7px", height:"13px", background:"#e1fc9d", verticalAlign:"middle", marginLeft:"1px" }} />
            <span style={{ color:"rgba(255,255,255,0.40)" }}>&lt;/</span>
            <span style={{ color:"#7dd3a8" }}>input</span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}>&gt;</span>
          </div>

          {error && (
            <div style={{ color:"#f87171", fontSize:"12px", marginBottom:"12px" }}>
              {`// error: ${error}`}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ background:"none", border:"none", padding:0, cursor: loading ? "not-allowed" : "pointer", display:"flex", alignItems:"center", gap:0 }}
          >
            <span style={{ color:"rgba(255,255,255,0.40)" }}>&lt;</span>
            <span style={{ color:"#7dd3a8" }}>button</span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}> </span>
            <span style={{ color:"#e1fc9d" }}>type</span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}>=</span>
            <span style={{ color:"#fca97a" }}>&quot;submit&quot;</span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}>&gt;</span>
            <span style={{ color: loading ? "rgba(255,255,255,0.35)" : "#e1fc9d", fontWeight:700, padding:"0 2px" }}>
              {loading ? "signing in..." : "Sign In ↵"}
            </span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}>&lt;/</span>
            <span style={{ color:"#7dd3a8" }}>button</span>
            <span style={{ color:"rgba(255,255,255,0.40)" }}>&gt;</span>
          </button>
        </form>
      </div>

      <p style={{ textAlign:"center", fontFamily:"var(--font-inter)", fontSize:"13px", color:"rgba(255,255,255,0.40)", margin:"20px 0 0" }}>
        No account?{" "}
        <button onClick={() => { onClose(); setTimeout(onSwitchRegister, 60); }} style={{ background:"none", border:"none", cursor:"pointer", color:T.green, fontSize:"13px", padding:0, fontFamily:"var(--font-inter)" }}>
          Create one
        </button>
      </p>
    </Modal>
  );
}

function RegisterModal({ open, onClose, onSwitchSignin }) {
  const router = useRouter();
  const { update } = useMockAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      mockRegister(username, email, password, confirm);
      const res = await signIn("credentials", { email, password });
      if (!res.error) {
        const raw = localStorage.getItem("trainity_session");
        if (raw) {
          const session = JSON.parse(raw);
          update(session.user);
          onClose();
          router.push("/user/dashboard");
          return;
        }
      }
      onClose();
      onSwitchSignin();
    } catch (err) {
      setError(err.message || "An error occurred.");
    }
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
        <Image src="/Logo/TrainityFullWhite.svg" alt="Trainity" width={110} height={28} />
      </div>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h2 style={{ fontFamily: "var(--font-polysans)", fontWeight: 400, fontSize: "22px", letterSpacing: "-0.5px", color: T.t1, margin: "0 0 6px" }}>Start for free</h2>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t2, margin: 0 }}>Join 1,000+ learners building real skills today.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <Field label="Username" type="text" placeholder="Your name" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Field label="Email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Password" type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Field label="Konfirmasi Password" type="password" placeholder="Ulangi password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        {error && <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "#f87171", margin: 0 }}>{error}</p>}
        <button
          type="submit" disabled={loading}
          style={{ marginTop: "8px", width: "100%", background: T.green, color: T.greenTxt, border: "none", borderRadius: "9px", padding: "12px 0", fontFamily: "var(--font-polysans)", fontSize: "15px", cursor: loading ? "not-allowed" : "pointer", fontWeight: 600 }}
        >
          {loading ? "Mendaftar..." : "Create Account"}
        </button>
      </form>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "16px 0" }}>
        <div style={{ flex: 1, height: "1px", background: T.border }} />
        <span style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: T.t3 }}>OR</span>
        <div style={{ flex: 1, height: "1px", background: T.border }} />
      </div>
      <p style={{ textAlign: "center", fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t2, margin: 0 }}>
        Already have an account?{" "}
        <button onClick={() => { onClose(); setTimeout(onSwitchSignin, 60); }} style={{ background: "none", border: "none", cursor: "pointer", color: T.green, fontSize: "13px", padding: 0, fontFamily: "var(--font-inter)" }}>
          Sign In
        </button>
      </p>
    </Modal>
  );
}

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);
  const btnRef = useState(null);
  const dropRef = useState(null);
  const ref = btnRef[0];
  const setRef = btnRef[1];
  const dropEl = dropRef[0];
  const setDropEl = dropRef[1];

  const toggle = () => {
    if (!open && ref) setRect(ref.getBoundingClientRect());
    setOpen((p) => !p);
  };

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!ref?.contains(e.target) && !dropEl?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open, ref, dropEl]);

  const dropdown = open && rect && typeof document !== "undefined" ? createPortal(
    <div ref={setDropEl} style={{ position: "fixed", top: rect.bottom + 8, right: window.innerWidth - rect.right, background: "#0e1610", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "8px", minWidth: "160px", padding: "8px", zIndex: 9999 }}>
      <Link href={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} onClick={() => setOpen(false)} style={{ display: "block", padding: "8px 12px", color: T.t2, fontFamily: "var(--font-inter)", fontSize: "14px", textDecoration: "none", borderRadius: "6px" }}>
        Dashboard
      </Link>
      {user.role !== "admin" && (
        <Link href="/user/profile" onClick={() => setOpen(false)} style={{ display: "block", padding: "8px 12px", color: T.t2, fontFamily: "var(--font-inter)", fontSize: "14px", textDecoration: "none", borderRadius: "6px" }}>
          Profile
        </Link>
      )}
      <button
        onClick={() => { onLogout(); setOpen(false); }}
        style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", color: "#f87171", fontFamily: "var(--font-inter)", fontSize: "14px", background: "none", border: "none", cursor: "pointer", borderRadius: "6px" }}
      >
        Sign Out
      </button>
    </div>,
    document.body
  ) : null;

  return (
    <div ref={setRef}>
      <button
        onClick={toggle}
        style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", color: T.t1, fontFamily: "var(--font-inter)", fontSize: "14px" }}
      >
        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: T.green, color: T.greenTxt, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px" }}>
          {user.username?.[0]?.toUpperCase() ?? "U"}
        </div>
        {user.username}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {dropdown}
    </div>
  );
}

export default function NavAuthPopout({ btn, color }) {
  const [signinOpen, setSigninOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const { data: session, status } = useSession();
  const { logout } = useMockAuth();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
    logout();
  };

  if (status === "authenticated" && session?.user) {
    if (btn === "register") return <UserMenu user={session.user} onLogout={handleLogout} />;
    return null;
  }

  return (
    <>
      {btn === "signin" ? (
        <button
          onClick={() => router.push("/auth/login")}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-inter)", fontSize: "14px", fontWeight: 500, color: color, padding: "6px 10px" }}
        >
          Sign In
        </button>
      ) : (
        <button
          onClick={() => router.push("/auth/register")}
          style={{ display: "inline-flex", alignItems: "center", background: T.green, color: T.greenTxt, borderRadius: "8px", padding: "8px 18px", fontFamily: "var(--font-polysans)", fontSize: "14px", fontWeight: 600, letterSpacing: "-0.02em", border: "none", cursor: "pointer" }}
        >
          Register
        </button>
      )}

      <SignInModal open={signinOpen} onClose={() => setSigninOpen(false)} onSwitchRegister={() => setRegisterOpen(true)} />
      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} onSwitchSignin={() => setSigninOpen(true)} />
    </>
  );
}
