"use client";

import { useEffect, useRef, useState } from "react";
export default function HomeScrollMotion({ children }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready || !ref.current) return;
    const items = ref.current.querySelectorAll("section, footer");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: 0.12 });
    items.forEach((item) => { item.classList.add("scroll-reveal"); observer.observe(item); });
    return () => observer.disconnect();
  }, [ready]);
  return <div ref={ref} className={ready ? "home-motion-ready" : "home-motion-waiting"}><style>{`
    .home-motion-waiting{opacity:0}
    .home-motion-ready{opacity:1}

    @keyframes hmFadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
    @keyframes hmFadeIn{from{opacity:0}to{opacity:1}}

    @keyframes hmNavDrop{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
    .home-motion-ready header{animation:hmNavDrop .7s .0s cubic-bezier(.22,1,.36,1) both}

    .home-motion-ready #hero > div:nth-child(2) > div:nth-child(1) > div:nth-child(1){animation:hmFadeUp .8s .05s cubic-bezier(.22,1,.36,1) both}
    .home-motion-ready #hero > div:nth-child(2) > p{animation:hmFadeUp .8s .18s cubic-bezier(.22,1,.36,1) both}
    .home-motion-ready #hero > div:nth-child(2) > div:nth-child(3){animation:hmFadeUp .8s .30s cubic-bezier(.22,1,.36,1) both}
    .home-motion-ready #hero > div:nth-child(2) > div:nth-child(4){animation:hmFadeUp .8s .42s cubic-bezier(.22,1,.36,1) both}
    .home-motion-ready #hero > div:nth-child(3){animation:hmFadeUp 1s .2s cubic-bezier(.22,1,.36,1) both}

    .home-motion-ready .scroll-reveal{opacity:0;transform:translateY(32px);transition:opacity .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1)}
    .home-motion-ready .scroll-reveal.is-visible{opacity:1;transform:translateY(0)}

    @media(prefers-reduced-motion:reduce){
      .home-motion-ready #hero *,.home-motion-ready .scroll-reveal{animation:none;opacity:1;transform:none;transition:none}
    }
  `}</style>{children}</div>;
}
