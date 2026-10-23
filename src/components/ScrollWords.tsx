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
    const tween = gsap.fromTo(
      words,
      { color: "#B6B8BD" },
      {
        color: "#0A0A0B",
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
