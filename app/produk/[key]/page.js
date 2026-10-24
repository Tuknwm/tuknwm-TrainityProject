"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { useSession } from "@/lib/mockAuth";
import { getProductByName, getReviewsByProductName, isProductOwned, addReview } from "@/lib/mockStore";

const T = { p1: "#293c2d", p2: "#1f2e22", p3: "#141e16", border: "rgba(255,255,255,0.10)", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.35)", orange: "#ff682c", green: "#e1fc9d", greenTxt: "#0f1f0f" };

function ReviewForm({ productKey, onSuccess }) {
  const { data: session, status } = useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!session?.user) { setError("Please log in first"); return; }
    if (rating === 0) { setError("Please select a star rating"); return; }
    if (!comment.trim()) { setError("Please write a comment first"); return; }
    setSubmitting(true);
    const product = getProductByName(decodeURIComponent(productKey));
    if (!product) { setError("Course not found"); setSubmitting(false); return; }
    addReview({ userId: session.user.id, userName: session.user.username, productId: product._id, productName: product.name, rating, comment });
    setRating(0); setComment(""); setSubmitting(false); setSubmitted(true);
    onSuccess?.();
  };

  return (
    <div style={{ padding: "24px 0" }}>
      <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "18px", fontWeight: 400, color: T.t1, margin: "0 0 20px" }}>Leave a Review</h2>
      {!session?.user ? (
        <div>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, marginBottom: "12px" }}>Please log in to leave a review</p>
          <Link href="/auth/login" style={{ display: "inline-block", background: T.green, color: T.greenTxt, borderRadius: "6px", padding: "8px 16px", fontFamily: "var(--font-polysans)", fontSize: "13px", textDecoration: "none", fontWeight: 600 }}>Log In</Link>
        </div>
      ) : submitted ? (
        <div>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "#86efac" }}>Thank you! Your review has been submitted.</p>
          <button onClick={() => setSubmitted(false)} style={{ background: "none", border: "none", color: T.green, cursor: "pointer", fontFamily: "var(--font-inter)", fontSize: "13px", padding: 0 }}>Write another review</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3, display: "block", marginBottom: "8px" }}>Rating</label>
            <div style={{ display: "flex", gap: "4px" }}>
              {[1,2,3,4,5].map((s) => (
                <button key={s} type="button" onClick={() => setRating(s)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "24px", color: s <= rating ? T.green : T.border, padding: "0 2px" }}>★</button>
              ))}
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3, alignSelf: "center", marginLeft: "8px" }}>{rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "Select rating"}</span>
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3 }}>Comment</label>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: T.t3 }}>{comment.length}/128</span>
            </div>
            <textarea value={comment} onChange={(e) => { if (e.target.value.length <= 128) setComment(e.target.value); }} placeholder="Write a short comment..." rows={3} maxLength={128}
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: "8px", padding: "11px 14px", fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t1, outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical" }} />
          </div>
          {error && <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "#f87171", margin: 0 }}>{error}</p>}
          <button type="submit" disabled={submitting || rating === 0 || !comment.trim()}
            style={{ alignSelf: "flex-start", background: T.green, color: T.greenTxt, border: "none", borderRadius: "8px", padding: "10px 24px", fontFamily: "var(--font-polysans)", fontSize: "14px", cursor: "pointer", fontWeight: 600, opacity: (rating === 0 || !comment.trim()) ? 0.5 : 1 }}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function DetailProdukPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const productKey = params.key;
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [owned, setOwned] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(() => {
    const r = getReviewsByProductName(decodeURIComponent(productKey));
    setReviews([...r].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, [productKey]);

  useEffect(() => {
    if (status === "loading") return;
    const prod = getProductByName(decodeURIComponent(productKey));
    setProduct(prod ?? null);
    if (prod && session?.user?.id) setOwned(isProductOwned(session.user.id, prod._id));
    loadReviews();
    setLoading(false);
  }, [productKey, status, session, loadReviews]);

  if (loading || status === "loading") return (
    <div style={{ minHeight: "100vh", background: T.p3 }}><AppNav /><main style={{ maxWidth: "800px", margin: "60px auto", padding: "0 24px", textAlign: "center" }}><p style={{ fontFamily: "var(--font-inter)", color: T.t3 }}>Loading course details...</p></main></div>
  );

  if (!product) return (
    <div style={{ minHeight: "100vh", background: T.p3 }}><AppNav /><main style={{ maxWidth: "800px", margin: "60px auto", padding: "0 24px", textAlign: "center" }}><p style={{ fontFamily: "var(--font-inter)", color: T.t2 }}>Course not found.</p></main></div>
  );

  const actionButton = !session?.user ? (
    <Link href="/auth/login" style={{ display: "inline-block", background: "rgba(255,255,255,0.08)", color: T.t2, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "12px 24px", fontFamily: "var(--font-polysans)", fontSize: "15px", textDecoration: "none" }}>Log In to Enroll</Link>
  ) : owned ? (
    <Link href={`/user/belajar/${product.name}`} style={{ display: "inline-block", background: T.green, color: T.greenTxt, borderRadius: "8px", padding: "12px 24px", fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 600, textDecoration: "none" }}>Start Learning</Link>
  ) : (
    <Link href={`/user/pembelian/checkout/${productKey}`} style={{ display: "inline-block", background: T.green, color: T.greenTxt, borderRadius: "8px", padding: "12px 24px", fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 600, textDecoration: "none" }}>Enroll Now</Link>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.p3 }}>
      <AppNav />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "40px" }}>
          <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: "12px", overflow: "hidden", background: T.p2 }}>
            <img src={`https://i.ytimg.com/vi/${product.kodePelajaranPertama}/hq720.jpg`} alt={product.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "16px" }}>
            <h1 style={{ fontFamily: "var(--font-polysans)", fontSize: "28px", fontWeight: 400, letterSpacing: "-0.5px", color: T.t1, margin: 0 }}>{product.name}</h1>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: T.t2, margin: 0, lineHeight: 1.6 }}>{product.desc}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontFamily: "var(--font-polysans)", fontSize: "20px", color: T.green, fontWeight: 600 }}>Free</span>
              {actionButton}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <ReviewForm productKey={productKey} onSuccess={loadReviews} />
          <div style={{ padding: "24px 0" }}>
            <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "18px", fontWeight: 400, color: T.t1, margin: "0 0 20px" }}>User Reviews</h2>
            {reviews.length === 0 ? (
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t3 }}>No reviews yet for this course</p>
            ) : reviews.map((r) => (
              <div key={r._id} style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: T.p1, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--font-polysans)", fontSize: "14px", color: T.t1 }}>{r.userName.charAt(0)}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", fontWeight: 500, color: T.t1, margin: 0 }}>{r.userName}</p>
                    <span style={{ fontSize: "12px", color: T.green }}>{"★".repeat(r.rating)}</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: T.t3, marginLeft: "auto" }}>
                    {new Date(r.createdAt).toLocaleDateString("en-US")}
                  </span>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, margin: 0, lineHeight: 1.5 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
