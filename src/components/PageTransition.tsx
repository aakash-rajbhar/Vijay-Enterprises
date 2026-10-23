"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const reduced = usePrefersReducedMotion();
  const first = useRef(true);

  useEffect(() => {
    if (reduced) return;
    if (first.current) {
      first.current = false;
      return;
    }
    const timers = [
      setTimeout(() => {
        setPhase("out");
        setShow(true);
      }, 10),
      setTimeout(() => setPhase("in"), 380),
      setTimeout(() => setShow(false), 720),
    ];
    return () => timers.forEach(clearTimeout);
  }, [pathname, reduced]);

  if (reduced) return <>{children}</>;

  return (
    <>
      {show && (
        <div className="fixed inset-0 z-[190] pointer-events-none">
          <div className={`absolute inset-0 bg-ink transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${phase === "out" ? "translate-y-0" : "translate-y-full"}`} />
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${phase === "out" ? "opacity-100" : "opacity-0"}`}>
            <span className="font-display text-4xl">Vijay Enterprises</span>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
