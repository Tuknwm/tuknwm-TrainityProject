"use client";
import { useState } from "react";
import AppNav from "@/components/AppNav";

const T = { p1: "#293c2d", p2: "#1f2e22", p3: "#141e16", border: "rgba(255,255,255,0.10)", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.35)", orange: "#ff682c", green: "#e1fc9d", greenTxt: "#0f1f0f", brass: "#c4a45a" };

const FAQ_DATA = [
  { q: "Are Trainity courses really free?", a: "Yes! All courses on Trainity are 100% free. We provide a 100% discount voucher valid until December 31, 2030 for all users." },
  { q: "Will I receive a certificate after completing a course?", a: "Yes, after completing 100% of the course material, you will receive a digital completion certificate that can be downloaded as a PDF and shared on your professional profile." },
  { q: "How long does my course access last?", a: "Once you enroll in a course, you get lifetime access. You can learn at your own pace with no time limits." },
  { q: "Do I need prior coding experience?", a: "No experience required! Our courses are designed for beginners through advanced learners. Content is structured systematically from the ground up, so anyone can get started." },
  { q: "How do I track my learning progress?", a: "You can view your learning progress on the Dashboard page. There you'll find information about your active courses and courses you've completed." },
  { q: "How do I contact the support team?", a: "Reach us via email at support@trainity.com or info@trainity.com." },
  { q: "Will course materials be updated?", a: "Yes, we continuously update course materials to stay relevant with the latest technology developments. All updates are automatically accessible to enrolled users." },
  { q: "Can I access courses from my smartphone?", a: "Absolutely! The Trainity website is responsive and accessible from all devices including smartphones, tablets, and desktops." },
  { q: "What if I forgot my password?", a: "Click Forgot Password on the login page, however this feature requires an email server and is not available in demo mode (no backend)." },
  { q: "Is there a certificate after completing a course?", a: "Yes, every completed course generates a digital certificate. You can access it from the My Learning page after completing 100% of the videos." },
];

export default function PanduanPage() {
  const [active, setActive] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = FAQ_DATA.filter((item) =>
    item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: T.p3 }}>
      <AppNav />
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: T.green }}>Support</span>
          <h1 style={{ fontFamily: "var(--font-polysans)", fontSize: "clamp(28px,4vw,40px)", fontWeight: 400, letterSpacing: "-0.8px", color: T.t1, margin: "12px 0 0" }}>Frequently Asked Questions</h1>
        </div>

        <div style={{ marginBottom: "32px", display: "flex", justifyContent: "center" }}>
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: "8px", padding: "12px 16px", fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t1, outline: "none", width: "100%", maxWidth: "480px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", background: T.p2, border: `1px solid ${T.border}`, borderRadius: "12px" }}>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: T.t3 }}>No questions found. Try a different keyword.</p>
            </div>
          ) : filtered.map((item, i) => (
            <div key={i} style={{ borderTop: `1px solid ${T.border}` }}>
              <button
                onClick={() => setActive(active === i ? null : i)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "18px 0", cursor: "pointer", background: "none", border: "none", textAlign: "left", gap: "16px" }}
              >
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "15px", fontWeight: 500, color: T.t1 }}>{item.q}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: T.t3, transform: active === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {active === i && (
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", lineHeight: 1.7, color: T.t2, padding: "0 0 20px", margin: 0 }}>
                  {item.a}
                </p>
              )}
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${T.border}` }} />
        </div>

      </main>
    </div>
  );
}
