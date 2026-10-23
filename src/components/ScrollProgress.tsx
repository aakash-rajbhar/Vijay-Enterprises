"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function ScrollProgress() {
  const [width, setWidth] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setWidth(scrolled);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 h-[2px] bg-spark z-[90]"
      style={{ width: `${width}%` }}
    />
  );
}
