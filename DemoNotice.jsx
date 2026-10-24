"use client";

import { useEffect, useState } from "react";

export default function DemoNotice() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("demo-notice", show);
    return () => window.removeEventListener("demo-notice", show);
  }, []);

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "grid", placeItems: "center", padding: 24, background: "rgba(0,0,0,0.62)", animation: `${closing ? "demoFadeOut" : "demoFadeIn"} 220ms ease both` }}>
      <div role="dialog" aria-modal="true" aria-labelledby="demo-notice-title" style={{ width: "min(100%, 440px)", padding: 32, border: "1px solid rgba(255,255,255,0.14)", borderRadius: 16, background: "#111", color: "#fff", fontFamily: "Montserrat, sans-serif", boxShadow: "0 24px 80px rgba(0,0,0,0.45)", animation: `${closing ? "demoCardOut" : "demoCardIn"} 260ms cubic-bezier(.22,1,.36,1) both` }}>
        <p style={{ margin: "0 0 12px", color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Demo Notice</p>
        <h2 id="demo-notice-title" style={{ margin: "0 0 14px", fontSize: 26 }}>Welcome to the new redesign.</h2>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.68)", fontSize: 14, lineHeight: 1.7 }}>This website is a dummy demo created to showcase a new redesign concept. It is not a real service, and the information shown here is for demonstration purposes only.</p>
        <div style={{ position: "relative", height: 180, marginTop: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, background: "#080b08" }}>
          <img src="/Old.png" alt="Old design" style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%", objectFit: "cover", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
          <img src="/New.png" alt="New redesign" style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%", objectFit: "cover", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
          <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}><line x1="0" y1="0" x2="100" y2="100" stroke="rgba(255,255,255,0.9)" strokeWidth="0.7" vectorEffect="non-scaling-stroke" /></svg>
          <span style={{ position: "absolute", left: 14, bottom: 10, color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", textShadow: "0 1px 6px #000" }}>New</span>
          <span style={{ position: "absolute", right: 14, top: 10, color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", textShadow: "0 1px 6px #000" }}>Old</span>
        </div>
        <button type="button" onClick={() => { setClosing(true); window.setTimeout(() => setOpen(false), 220); }} style={{ marginTop: 24, padding: "10px 18px", border: 0, borderRadius: 8, background: "#e1fc9d", color: "#0f1f0f", fontWeight: 700, cursor: "pointer" }}>Got it</button>
      </div>
      <style>{`@keyframes demoFadeIn{from{opacity:0}to{opacity:1}}@keyframes demoFadeOut{from{opacity:1}to{opacity:0}}@keyframes demoCardIn{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes demoCardOut{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(10px) scale(.98)}}`}</style>
    </div>
  );
}
