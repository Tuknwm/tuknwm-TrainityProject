"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { useSession } from "@/lib/mockAuth";

const T = { p2: "#1f2e22", p3: "#141e16", border: "rgba(255,255,255,0.10)", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.35)", green: "#e1fc9d", greenTxt: "#0f1f0f" };

const checkStyle = `
  @keyframes drawCheck { from { stroke-dashoffset: 30; } to { stroke-dashoffset: 0; } }
  @keyframes popCircle { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .check-circle { animation: popCircle 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
  .check-path { stroke-dasharray: 30; stroke-dashoffset: 30; animation: drawCheck 0.4s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
`;

export default function SuccessPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [countdown, setCountdown] = useState(15);
  const productKey = params.key;
  const [orderId, setOrderId] = useState("");
  useEffect(() => { setOrderId(`TRN-${Date.now()}`); }, []);

  useEffect(() => {
    if (countdown === 0) { router.push("/user/dashboard"); return; }
    const t = setInterval(() => setCountdown((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [countdown, router]);

  return (
    <div style={{ minHeight: "100vh", background: T.p3 }}>
      <AppNav />
      <main style={{ maxWidth: "560px", margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ padding: "48px 0" }}>
          <style>{checkStyle}</style>
          <div className="check-circle" style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(225,252,157,0.10)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path className="check-path" d="M5 13l4 4L19 7" stroke="#e1fc9d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "26px", fontWeight: 400, letterSpacing: "-0.5px", color: T.t1, margin: "0 0 8px" }}>Purchase Successful!</h2>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: T.t2, marginBottom: "32px" }}>Thank you for completing your purchase.</p>

          <div style={{ padding: "16px 0", textAlign: "left", marginBottom: "24px", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
            <h3 style={{ fontFamily: "var(--font-polysans)", fontSize: "16px", fontWeight: 400, color: T.t1, margin: "0 0 16px" }}>Purchase Details</h3>
            {[["Name", session?.user?.name], ["Email", session?.user?.email], ["Order ID", orderId], ["Product", decodeURIComponent(productKey)], ["Payment", "Voucher"], ["Total", "Free"]].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t3 }}>{label}</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: label === "Total" ? T.green : T.t2, fontWeight: label === "Total" ? 600 : 400 }}>{value}</span>
              </div>
            ))}
          </div>

          <Link href="/user/dashboard" style={{ display: "inline-block", background: T.green, color: T.greenTxt, borderRadius: "8px", padding: "12px 28px", fontFamily: "var(--font-polysans)", fontSize: "15px", textDecoration: "none", fontWeight: 600, marginBottom: "16px" }}>
            Back to Dashboard
          </Link>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3, margin: 0 }}>Redirecting in {countdown} seconds...</p>
        </div>
      </main>
    </div>
  );
}
