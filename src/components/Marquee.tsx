"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    let pos = 0;
    let vel = 0.4;
    let lastY = window.scrollY;
    let dir = 1;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      dir = delta < 0 ? -1 : 1;
      vel = Math.min(1.4, 0.3 + Math.abs(delta) / 30);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    const loop = () => {
      pos -= vel * dir;
      if (pos < -1800) pos = 0;
      if (pos > 0) pos = -1800;
      if (ref.current) ref.current.style.transform = `translate3d(${pos}px,0,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  const items =
    "Laser cutting · Shearing · Bending · Welding · Fabrication · Machine parts · Delhi NCR · ";

  return (
    <div className="border-line bg-ink relative overflow-hidden border-y py-4">
      <div
        ref={ref}
        className="text-steel-500 flex font-mono text-[11px] tracking-[0.18em] whitespace-nowrap uppercase"
        aria-hidden="true"
      >
        <span>{items.repeat(12)}</span>
      </div>
      <span className="sr-only">
        Laser cutting, shearing, bending, welding, fabrication, machine parts, Delhi NCR
      </span>
    </div>
  );
}
