"use client";
import { useState, useEffect, useRef } from "react";
import AppNav from "@/components/AppNav";
import { getPurchaseHistory } from "@/lib/mockStore";

const T = { p2: "#1f2e22", p3: "#141e16", border: "rgba(255,255,255,0.10)", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.35)", green: "#e1fc9d", greenTxt: "#0f1f0f" };

export default function AdminHistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const debounce = useRef(null);

  const fetchData = (currentPage, q, reset = false) => {
    setLoading(true);
    const result = getPurchaseHistory(currentPage, 20, q);
    const formatted = result.userProducts.map((item, idx) => {
      const prefix = item.product.name.split(" ")[0].toUpperCase();
      const counter = result.pagination.total - (currentPage - 1) * 20 - idx;
      return {
        orderId: `ORD${String(counter).padStart(4, "0")}`,
        transactionId: `${prefix}-${String(counter).padStart(4, "0")}`,
        email: item.user.email,
        product: item.product.name,
        date: new Date(item.createdAt).toLocaleString("id-ID"),
      };
    });
    setItems((prev) => (reset ? formatted : [...prev, ...formatted]));
    setTotal(result.pagination.total);
    setHasMore(result.pagination.hasNext);
    if (!reset) setPage(currentPage + 1);
    setLoading(false);
  };

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => { setItems([]); setPage(1); fetchData(1, search, true); }, 400);
    return () => { if (debounce.current) clearTimeout(debounce.current); };
  }, [search]);

  return (
    <div style={{ minHeight: "100vh", background: T.p3 }}>
      <AppNav />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-polysans)", fontSize: "28px", fontWeight: 400, letterSpacing: "-0.5px", color: T.t1, margin: "0 0 6px" }}>Purchase History</h1>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t3, margin: 0 }}>Manage all course purchase transactions</p>
          </div>
          <input
            type="text"
            placeholder="Cari Email / Produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: "8px", padding: "10px 14px", fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t1, outline: "none", width: "280px", boxSizing: "border-box" }}
          />
        </div>

        <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3, marginBottom: "16px" }}>Total: {total} transaksi</p>

        {loading && items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ fontFamily: "var(--font-inter)", color: T.t3 }}>Loading data...</p>
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontFamily: "var(--font-inter)", color: T.t3 }}>No purchase data found</p>
          </div>
        ) : (
          <>
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "0", borderBottom: `1px solid ${T.border}`, padding: "12px 20px" }}>
                {["Order ID", "Email", "Course", "Date", "Status"].map((h) => (
                  <span key={h} style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, color: T.t3, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {items.map((item, i) => (
                <div key={item.orderId} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "0", padding: "14px 20px", borderBottom: i < items.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t2 }}>{item.orderId}</span>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t2 }}>{item.email}</span>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t2 }}>{item.product}</span>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3 }}>{item.date}</span>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "#86efac" }}>Success</span>
                </div>
              ))}
            </div>
            {hasMore && (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button onClick={() => fetchData(page, search)} disabled={loading}
                  style={{ background: T.green, color: T.greenTxt, border: "none", borderRadius: "8px", padding: "10px 24px", fontFamily: "var(--font-polysans)", fontSize: "14px", cursor: "pointer", fontWeight: 600 }}>
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
