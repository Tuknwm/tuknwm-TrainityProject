"use client";
import { useEffect, useRef, useState } from "react";

const T = {
  p1:     "#293c2d",
  p3:     "#141e16",
  border: "rgba(255,255,255,0.10)",
  t1:     "#ffffff",
  t3:     "rgba(255,255,255,0.40)",
  orange: "#ff682c",
};

const LINES = [
  { tokens: [{ c: "#7dd3fc", t: "const" }, { c: T.t1, t: " " }, { c: "#93c5fd", t: "trainity" }, { c: T.t1, t: " = {" }] },
  { tokens: [{ c: T.t3, t: "  // structured learning path" }] },
  { tokens: [{ c: "#86efac", t: "  courses" }, { c: T.t1, t: ": [" }] },
  { tokens: [{ c: "#fde68a", t: '    "HTML & CSS Fundamentals"' }, { c: T.t1, t: "," }] },
  { tokens: [{ c: "#fde68a", t: '    "JavaScript Modern"' }, { c: T.t1, t: "," }] },
  { tokens: [{ c: "#fde68a", t: '    "React from Scratch"' }, { c: T.t1, t: "," }] },
  { tokens: [{ c: T.t1, t: "  ]," }] },
  { tokens: [{ c: "#86efac", t: "  instructors" }, { c: T.t1, t: ": " }, { c: "#fdba74", t: "1000" }, { c: T.t1, t: "+" }] },
  { tokens: [{ c: T.t1, t: "};" }] },
  { tokens: [] },
  { tokens: [{ c: "#7dd3fc", t: "async function" }, { c: T.t1, t: " " }, { c: "#c4b5fd", t: "startLearning" }, { c: T.t1, t: "() {" }] },
  { tokens: [{ c: "#7dd3fc", t: "  const" }, { c: T.t1, t: " " }, { c: "#93c5fd", t: "you" }, { c: T.t1, t: " = " }, { c: "#7dd3fc", t: "await" }, { c: T.t1, t: " " }, { c: "#c4b5fd", t: "enroll" }, { c: T.t1, t: "();" }] },
  { tokens: [{ c: "#86efac", t: "  you.skills" }, { c: T.t1, t: "." }, { c: "#c4b5fd", t: "grow" }, { c: T.t1, t: "();" }] },
  { tokens: [{ c: "#86efac", t: "  you.career" }, { c: T.t1, t: "." }, { c: "#c4b5fd", t: "launch" }, { c: T.t1, t: "();" }] },
  { tokens: [{ c: T.t1, t: "}" }] },
];

function flattenLine(tokens) {
  return tokens.map((tk) => tk.t).join("");
}

export default function CodeAnimation() {
  const [visibleChars, setVisibleChars] = useState(0);
  const totalChars = LINES.reduce((s, l) => s + flattenLine(l.tokens).length, 0);
  const rafRef = useRef(null);
  const lastRef = useRef(null);

  useEffect(() => {
    let current = 0;
    const speed = 28;

    function tick(ts) {
      if (lastRef.current == null) lastRef.current = ts;
      const elapsed = (ts - lastRef.current) / 1000;
      lastRef.current = ts;
      current = Math.min(current + elapsed * speed, totalChars);
      setVisibleChars(Math.floor(current));
      if (current < totalChars) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          current = 0;
          lastRef.current = null;
          setVisibleChars(0);
          rafRef.current = requestAnimationFrame(tick);
        }, 2800);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [totalChars]);

  let remaining = visibleChars;
  const renderedLines = LINES.map((line, li) => {
    const lineText = flattenLine(line.tokens);
    const lineLen = lineText.length;
    const show = Math.min(remaining, lineLen);
    remaining = Math.max(0, remaining - lineLen);

    let charCount = 0;
    const spans = line.tokens.map((tk, ti) => {
      const start = charCount;
      charCount += tk.t.length;
      const visible = Math.max(0, Math.min(tk.t.length, show - start));
      return (
        <span key={ti} style={{ color: tk.c }}>
          {tk.t.slice(0, visible)}
        </span>
      );
    });

    const isCursorLine = show < lineLen || (remaining === 0 && show === lineLen && li === LINES.findIndex((_, i) => {
      let r = visibleChars;
      for (let j = 0; j <= i; j++) r -= LINES[j].tokens.map((t) => t.t).join("").length;
      return r <= 0;
    }));

    return (
      <div key={li} style={{ display: "flex", minHeight: "1.6em" }}>
        <span style={{ color: T.t3, fontSize: "11px", minWidth: "28px", userSelect: "none", paddingTop: "1px" }}>
          {li + 1}
        </span>
        <span>
          {spans}
          {isCursorLine && remaining === 0 && show === Math.min(visibleChars - LINES.slice(0, li).reduce((s, l) => s + flattenLine(l.tokens).length, 0), lineLen) && (
            <span style={{ display: "inline-block", width: "2px", height: "1.1em", background: T.orange, verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />
          )}
        </span>
      </div>
    );
  });

  return (
    <div style={{ position: "relative" }}>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

      <div style={{ borderRadius: "10px", overflow: "hidden", border: `1px solid ${T.border}`, background: T.p3, fontFamily: "'Plus Jakarta Sans', monospace", fontSize: "13px", lineHeight: 1.6 }}>

        <div style={{ background: "rgba(255,255,255,0.04)", borderBottom: `1px solid ${T.border}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {["#ff5f57","#ffbd2e","#28c840"].map((c) => (
              <span key={c} style={{ width: "11px", height: "11px", borderRadius: "50%", background: c, display: "inline-block" }} />
            ))}
          </div>
          <span style={{ color: T.t3, fontSize: "12px", flex: 1, textAlign: "center" }}>trainity.js</span>
        </div>

        <div style={{ padding: "20px 20px 24px", overflowX: "auto" }}>
          {renderedLines}
        </div>
      </div>

    </div>
  );
}
