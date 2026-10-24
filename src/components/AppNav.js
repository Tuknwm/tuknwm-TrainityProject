"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, useMockAuth } from "@/lib/mockAuth";

const T = {
  p3: "#0e1610",
  border: "rgba(255,255,255,0.10)",
  t1: "#ffffff",
  t2: "rgba(255,255,255,0.65)",
  t3: "rgba(255,255,255,0.35)",
  green: "#e1fc9d",
  greenTxt: "#0f1f0f",
  orange: "#ff682c",
};

export default function AppNav() {
  const { data: session } = useSession();
  const { logout } = useMockAuth();
  const router = useRouter();
  const user = session?.user;

  const handleLogout = () => { router.push("/"); logout(); };

  const navLinks = user?.role === "admin"
    ? [["Dashboard", "/admin/dashboard"], ["Products", "/admin/produk"], ["Purchases", "/admin/pembelian"], ["Reviews", "/admin/review"]]
    : [["Dashboard", "/user/dashboard"], ["Courses", "/produk"], ["My Learning", "/user/belajar"], ["Guide", "/panduan"]];

  return (
    <header style={{ background: T.p3, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
          <Image src="/Logo/TrainityFullWhite.svg" alt="Trainity" width={110} height={28} priority />
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {navLinks.map(([label, href]) => (
            <Link key={label} href={href}
              style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, textDecoration: "none", padding: "6px 12px", borderRadius: "6px", transition: "color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.fontWeight = "700"; e.currentTarget.style.color = T.t1; }}
              onMouseLeave={e => { e.currentTarget.style.fontWeight = "400"; e.currentTarget.style.color = T.t2; }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user && (
            <>
              <button
                onClick={handleLogout}
                style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "#f87171", background: "none", border: "none", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#ffffff"}
                onMouseLeave={e => e.currentTarget.style.color = "#f87171"}
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
