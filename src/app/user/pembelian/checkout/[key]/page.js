"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import { useSession } from "@/lib/mockAuth";
import { getProductByName, buyProduct, isProductOwned } from "@/lib/mockStore";

const T = { p2: "#1f2e22", p3: "#141e16", border: "rgba(255,255,255,0.10)", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.35)", green: "#e1fc9d", greenTxt: "#0f1f0f" };

export default function CheckoutPage() {
  const params = useParams();
  const productKey = decodeURIComponent(params.key);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const VOUCHERS = [
    { code: "FREE100", label: "FREE100 — 100% off", desc: "Valid until Dec 31, 2030" },
    { code: "TRAINITY50", label: "TRAINITY50 — 50% off", desc: "New member discount" },
    { code: "LAUNCH2024", label: "LAUNCH2024 — 80% off", desc: "Launch promo" },
  ];
  const [voucher, setVoucher] = useState(VOUCHERS[0].code);
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [payMethod, setPayMethod] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/auth/login"); return; }
    if (status === "loading") return;
    const prod = getProductByName(productKey);
    if (!prod) { setError("Course not found."); return; }
    if (isProductOwned(session.user.id, prod._id)) {
      router.push(`/user/belajar/${prod.name}`);
      return;
    }
    setProduct(prod);
  }, [productKey, status, session, router]);

  const handleCheckout = () => {
    if (!product || !session?.user) return;
    setLoading(true);
    try {
      buyProduct(session.user.id, product._id);
      router.push(`/user/pembelian/success/${encodeURIComponent(product.name)}`);
    } catch (err) {
      setError(err.message || "An error occurred.");
      setLoading(false);
    }
  };

  if (status === "loading" || !product) return (
    <div style={{ minHeight: "100vh", background: T.p3 }}><AppNav />
      <main style={{ maxWidth: "600px", margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        {error ? <p style={{ fontFamily: "var(--font-inter)", color: "#f87171" }}>{error}</p> : <p style={{ fontFamily: "var(--font-inter)", color: T.t3 }}>Loading...</p>}
      </main>
    </div>
  );

  const thumb = product.kodePelajaranPertama
    ? `https://i.ytimg.com/vi/${product.kodePelajaranPertama}/hqdefault.jpg`
    : null;

  return (
    <div style={{ minHeight: "100vh", background: T.p3 }}>
      <AppNav />
      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "var(--font-polysans)", fontSize: "26px", fontWeight: 400, letterSpacing: "-0.5px", color: T.t1, margin: "0 0 32px" }}>Checkout</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}>

          <div>
            <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 600, color: T.t1, margin: "0 0 16px" }}>Payment Method</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
              {[["shopee","ShopeePay","/Payment/ShopeePay.svg"],["qris","QRIS","/Payment/QRIS.svg"],["gopay","GoPay","/Payment/GoPay.svg"],["ovo","OVO","/Payment/OVO.svg"],["dana","DANA","/Payment/DANA.svg"]].map(([id, label, img]) => (
                <div key={id}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "8px", border: `1px solid ${T.border}`, opacity: 0.35, cursor: "not-allowed" }}>
                  <div style={{ width: "80px", height: "48px", flexShrink: 0, background: "#ffffff", borderRadius: "6px", overflow: "hidden", padding: "6px" }}>
                    <img src={img} alt={label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t3 }}>{label}</span>
                  <span style={{ marginLeft: "auto", fontFamily: "var(--font-inter)", fontSize: "11px", color: T.t3 }}>Coming soon</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 600, color: T.t1, margin: "0 0 12px" }}>Voucher Code</h2>
              <div style={{ position: "relative", marginBottom: "8px" }}>
                <div onClick={() => setVoucherOpen(o => !o)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: `1px solid ${T.green}`, borderRadius: voucherOpen ? "8px 8px 0 0" : "8px", background: "rgba(255,255,255,0.04)", cursor: "pointer" }}>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t1 }}>{VOUCHERS.find(v => v.code === voucher)?.label}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: voucherOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                    <path d="M2 4l4 4 4-4" stroke="#e1fc9d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, border: `1px solid ${T.green}`, borderTop: "none", borderRadius: "0 0 8px 8px", background: "#1a2b1d", zIndex: 10, overflow: "hidden", maxHeight: voucherOpen ? "300px" : "0", opacity: voucherOpen ? 1 : 0, transition: "max-height 0.25s cubic-bezier(0.22,1,0.36,1), opacity 0.2s ease", pointerEvents: voucherOpen ? "auto" : "none" }}>
                  {VOUCHERS.map(v => (
                    <div key={v.code} onClick={() => { setVoucher(v.code); setVoucherOpen(false); }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      style={{ padding: "10px 14px", cursor: "pointer", background: "transparent", borderTop: `1px solid ${T.border}` }}>
                      <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: v.code === voucher ? T.green : T.t1, margin: "0 0 2px", fontWeight: v.code === voucher ? 600 : 400 }}>{v.label}</p>
                      <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: T.t3, margin: 0 }}>{v.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: T.t3, margin: 0 }}>
                {VOUCHERS.find(v => v.code === voucher)?.desc}
              </p>
            </div>
          </div>

          <div style={{ borderLeft: `1px solid ${T.border}`, paddingLeft: "48px" }}>
            <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 600, color: T.t1, margin: "0 0 20px" }}>Order Summary</h2>

            {thumb && (
              <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: "10px", overflow: "hidden", marginBottom: "20px" }}>
                <img src={thumb} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            )}

            <p style={{ fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 600, color: T.t1, margin: "0 0 4px" }}>{product.name}</p>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3, margin: "0 0 20px", lineHeight: 1.5 }}>{product.shortDesc}</p>

            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3 }}>Price</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t2 }}>Free</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3 }}>Tax (0%)</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t2 }}>Rp 0</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3 }}>Discount</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.green }}>— 100%</span>
              </div>
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "12px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 600, color: T.t1 }}>Total</span>
                <span style={{ fontFamily: "var(--font-polysans)", fontSize: "18px", fontWeight: 700, color: T.green }}>Rp 0</span>
              </div>
            </div>

            {error && <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "#f87171", margin: "16px 0 0" }}>{error}</p>}

            <button onClick={handleCheckout} disabled={loading}
              style={{ width: "100%", marginTop: "20px", background: T.green, color: T.greenTxt, border: "none", borderRadius: "8px", padding: "14px", fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Processing..." : "Confirm & Get Access"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px 0" }}>
              <div style={{ flex: 1, height: "1px", background: T.border }} />
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: T.t3 }}>Or</span>
              <div style={{ flex: 1, height: "1px", background: T.border }} />
            </div>

            <button onClick={() => router.back()}
              style={{ width: "100%", background: "none", border: "none", padding: "10px", fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t3, cursor: "pointer", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = T.t1}
              onMouseLeave={e => e.currentTarget.style.color = T.t3}>
              Cancel
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
