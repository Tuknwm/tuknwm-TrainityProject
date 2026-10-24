"use client";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  return (
    <div key={pathname} style={{ animation: "pageEnter 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
      {children}
    </div>
  );
}
