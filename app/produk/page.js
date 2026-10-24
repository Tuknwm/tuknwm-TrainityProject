"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { getProducts } from "@/lib/mockStore";
import { useSession } from "@/lib/mockAuth";

const T = { p1: "#293c2d", p2: "#1f2e22", p3: "#141e16", border: "rgba(255,255,255,0.10)", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.35)", orange: "#ff682c", green: "#e1fc9d", greenTxt: "#0f1f0f" };

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ProdukPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { status } = useSession();

  useEffect(() => {
    setProducts(getProducts(debouncedSearch || undefined));
  }, [debouncedSearch]);

  return (
    <div style={{ minHeight: "100vh", background: T.p3 }}>
      <AppNav />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontFamily: "var(--font-polysans)", fontSize: "clamp(28px,4vw,40px)", fontWeight: 400, letterSpacing: "-0.8px", color: T.t1, margin: "0 0 10px" }}>Browse Our Courses</h1>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "16px", color: T.t2, margin: 0 }}>Find the courses you need to level up your skills.</p>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: "8px", padding: "12px 16px", fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t1, outline: "none", width: "100%", maxWidth: "400px", boxSizing: "border-box" }}
          />
        </div>

        {products.length === 0 ? (
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: T.t3 }}>
            {search ? `No results for "${search}".` : "No courses available yet."}
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {products.map((product) => (
              <div key={product._id} style={{ background: T.p2, border: `1px solid ${T.border}`, borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ position: "relative", paddingTop: "56.25%", background: T.p1 }}>
                  <img src={`https://i.ytimg.com/vi/${product.kodePelajaranPertama}/hq720.jpg`} alt={product.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontFamily: "var(--font-polysans)", fontSize: "17px", fontWeight: 400, color: T.t1, margin: "0 0 8px" }}>{product.name}</h3>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, margin: "0 0 16px", lineHeight: 1.5 }}>{product.shortDesc}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.green, fontWeight: 600 }}>Free</span>
                    <Link href={`/produk/${product.name}`} style={{ background: T.green, color: T.greenTxt, borderRadius: "6px", padding: "8px 16px", fontFamily: "var(--font-polysans)", fontSize: "13px", textDecoration: "none", fontWeight: 600 }}>
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
