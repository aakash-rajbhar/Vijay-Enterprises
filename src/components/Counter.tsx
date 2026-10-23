"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Counter({ value, suffix = "", className = "" }: { value: number; suffix?: string; className?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start: number | null = null;
          const dur = 1400;
          const step = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / dur, 1);
            setN(Math.floor(p * value));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {reduced ? value : n}
      {suffix}
    </span>
  );
}
