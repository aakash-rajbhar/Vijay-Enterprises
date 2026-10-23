"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function MaskedLines({
  lines,
  className = "",
  delay = 0,
  scroll = true,
}: {
  lines: string[];
  className?: string;
  delay?: number;
  scroll?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const els = ref.current.querySelectorAll("[data-line]");
    const tween = gsap.fromTo(
      els,
      { yPercent: 112 },
      {
        yPercent: 0,
        duration: 1.05,
        stagger: 0.08,
        ease: "power3.out",
        delay,
        scrollTrigger: scroll ? { trigger: ref.current, start: "top 88%", once: true } : undefined,
      }
    );
    return () => {
      tween.kill();
    };
  }, [reduced, delay, scroll]);

  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <span data-line className="block will-change-transform">
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}
