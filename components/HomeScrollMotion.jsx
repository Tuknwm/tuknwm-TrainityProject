"use client";

import { useEffect, useRef, useState } from "react";

export default function HomeScrollMotion({ children }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const start = () => setReady(true);
    if (sessionStorage.getItem("hasVisited")) start();
    window.addEventListener("loading-complete", start);
    return () => window.removeEventListener("loading-complete", start);
  }, []);
  useEffect(() => {
    if (!ready || !ref.current) return;
    const items = ref.current.querySelectorAll("section, footer");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: 0.12 });
    items.forEach((item) => { item.classList.add("scroll-reveal"); observer.observe(item); });
    return () => observer.disconnect();
  }, [ready]);
  return <div ref={ref} className={ready ? "home-motion-ready" : "home-motion-waiting"}><style>{`.home-motion-waiting{opacity:0}.home-motion-ready{opacity:1}.home-motion-ready .scroll-reveal{opacity:0;transform:translateY(28px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}.home-motion-ready .scroll-reveal.is-visible{opacity:1;transform:translateY(0)}@media(prefers-reduced-motion:reduce){.home-motion-ready .scroll-reveal{opacity:1;transform:none;transition:none}}`}</style>{children}</div>;
}
