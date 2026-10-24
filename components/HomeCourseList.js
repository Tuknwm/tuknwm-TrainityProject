"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/mockStore";

const T = { p1: "#293c2d", border: "rgba(255,255,255,0.10)", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.35)", orange: "#e1fc9d", card: "rgba(255,255,255,0.05)" };

export default function HomeCourseList() {
  const [products, setProducts] = useState([]);
  useEffect(() => { setProducts(getProducts()); }, []);

  if (!products.length) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: "24px" }}>
      {products.map((p) => {
        const thumb = p.kodePelajaranPertama
          ? `https://i.ytimg.com/vi/${p.kodePelajaranPertama}/hqdefault.jpg`
          : null;
        return (
          <Link key={p._id} href={`/produk/${encodeURIComponent(p.name)}`} style={{ textDecoration: "none", display: "block" }}>
            <div style={{ height: "180px", background: T.card, overflow: "hidden", borderRadius: "8px", marginBottom: "16px" }}>
              {thumb && <img src={thumb} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
            </div>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: T.t3, display: "block", marginBottom: "8px" }}>Free</span>
            <h3 style={{ fontFamily: "var(--font-polysans)", fontSize: "17px", fontWeight: 400, letterSpacing: "-0.02em", color: T.t1, margin: "0 0 6px" }}>{p.name}</h3>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", lineHeight: 1.65, color: T.t2, margin: "0 0 12px" }}>{p.shortDesc}</p>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 500, color: T.orange, display: "flex", alignItems: "center", gap: "4px" }}>
              Start course
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
