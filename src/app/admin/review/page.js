"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { useSession } from "@/lib/mockAuth";
import { getReviews, deleteReview } from "@/lib/mockStore";

const T = { p2: "#1f2e22", p3: "#141e16", border: "rgba(255,255,255,0.10)", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.35)", orange: "#ff682c", green: "#e1fc9d", greenTxt: "#0f1f0f" };

const ITEMS_PER_PAGE = 10;

export default function AdminReview() {
  const { status } = useSession();
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const load = useCallback(() => { setReviews(getReviews()); }, []);
  useEffect(() => { if (status !== "loading") load(); }, [status, load]);

  const total = reviews.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const paginated = reviews.slice().reverse().slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = () => {
    if (!toDelete) return;
    deleteReview(toDelete._id);
    load();
    setToDelete(null);
    setShowSuccess(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.p3 }}>
      <AppNav />
      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-polysans)", fontSize: "28px", fontWeight: 400, letterSpacing: "-0.5px", color: T.t1, margin: "0 0 6px" }}>Manage Review</h1>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t3, margin: 0 }}>All Review ({total})</p>
          </div>
        </div>

        {paginated.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontFamily: "var(--font-inter)", color: T.t3 }}>No reviews found</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {paginated.map((r) => (
              <div key={r._id} style={{ padding: "16px 0", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", fontWeight: 500, color: T.t1, margin: "0 0 2px" }}>{r.userName}</p>
                    <span style={{ fontSize: "12px", color: T.green }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: T.t3 }}>{new Date(r.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: T.t3, margin: "0 0 6px" }}>Course: {r.productName}</p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, margin: "0 0 14px", lineHeight: 1.5 }}>{r.comment}</p>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={() => setToDelete(r)} style={{ background: "none", border: "none", padding: 0, fontFamily: "var(--font-inter)", fontSize: "13px", color: "#f87171", cursor: "pointer" }}>
                    Delete Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
            <button onClick={() => setPage(1)} disabled={page === 1} style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, borderRadius: "6px", color: T.t2, cursor: "pointer", fontFamily: "var(--font-inter)", fontSize: "13px" }}>First</button>
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, borderRadius: "6px", color: T.t2, cursor: "pointer", fontFamily: "var(--font-inter)", fontSize: "13px" }}>Prev</button>
            <span style={{ padding: "6px 12px", fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t2 }}>{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages} style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, borderRadius: "6px", color: T.t2, cursor: "pointer", fontFamily: "var(--font-inter)", fontSize: "13px" }}>Next</button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, borderRadius: "6px", color: T.t2, cursor: "pointer", fontFamily: "var(--font-inter)", fontSize: "13px" }}>Last</button>
          </div>
        )}
      </main>

      {toDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: T.p2, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "32px", width: "400px", maxWidth: "90vw" }}>
            <h3 style={{ fontFamily: "var(--font-polysans)", fontSize: "18px", fontWeight: 400, color: T.t1, margin: "0 0 12px" }}>⚠️ Delete Review</h3>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "#f87171", margin: "0 0 16px" }}>This action cannot be undone.</p>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, margin: "0 0 24px" }}>&quot;{toDelete.comment}&quot;</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setToDelete(null)} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, borderRadius: "8px", padding: "8px 16px", fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDelete} style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.5)", borderRadius: "8px", padding: "8px 16px", fontFamily: "var(--font-inter)", fontSize: "14px", color: "#f87171", cursor: "pointer" }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: T.p2, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "32px", width: "360px", maxWidth: "90vw", textAlign: "center" }}>
            <p style={{ fontSize: "32px", margin: "0 0 12px" }}>✅</p>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: T.t2, margin: "0 0 20px" }}>Review berhasil dihapus!</p>
            <button onClick={() => setShowSuccess(false)} style={{ background: T.green, color: T.greenTxt, border: "none", borderRadius: "8px", padding: "8px 24px", fontFamily: "var(--font-polysans)", fontSize: "14px", cursor: "pointer", fontWeight: 600 }}>Oke</button>
          </div>
        </div>
      )}
    </div>
  );
}
