"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function SplitReveal({ children, as: Tag = "h2", className = "" }: { children: string; as?: React.ElementType; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const el = ref.current;
    const words = el.querySelectorAll("[data-word]");
    gsap.fromTo(
      words,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.9,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      }
    );
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [reduced]);

  return (
    <Tag ref={ref} className={className}>
      {children.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span data-word className="inline-block">
            {word}&nbsp;
          </span>
        </span>
      ))}
    </Tag>
  );
}
