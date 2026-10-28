"use client";
import { usePathname } from "next/navigation";
import { useRef } from "react";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const prevPath = useRef(null);
  const isNav = prevPath.current !== null && prevPath.current !== pathname;
  prevPath.current = pathname;
  return (
    <div key={pathname} style={isNav ? { animation: "pageEnter 0.4s cubic-bezier(0.22,1,0.36,1) both" } : undefined}>
      {children}
    </div>
  );
}
