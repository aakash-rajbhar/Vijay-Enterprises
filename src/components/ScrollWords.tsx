"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function ScrollWords({ children, faded, className = "" }: { children: string; faded?: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const el = ref.current;
    const words = el.querySelectorAll("[data-w]");
    const root = getComputedStyle(el);
    const startColor = root.getPropertyValue("--color-steel-300").trim();
    const endColor = root.getPropertyValue("--color-ink").trim();
    const tween = gsap.fromTo(
      words,
      { color: startColor },
      {
        color: endColor,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 55%", scrub: true },
      }
    );
    return () => {
      tween.kill();
    };
  }, [reduced]);

  return (
    <p ref={ref} className={className}>
      {children.split(" ").map((w, i) => (
        <span key={i} data-w className="inline-block">
          {w}&nbsp;
        </span>
      ))}
      {faded && <span className="text-steel-500">{faded}</span>}
    </p>
  );
}
