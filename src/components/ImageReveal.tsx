"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function ImageReveal() {
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-image-reveal]"));
      els.forEach((el) => {
        const img = el.querySelector("img");
        gsap.fromTo(
          el,
          { clipPath: "inset(10% 10% 10% 10% round 24px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 24px)",
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.2 },
            {
              scale: 1,
              duration: 1.35,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 90%" },
              onComplete: () => gsap.set(img, { clearProps: "transform" }),
            }
          );
        }
      });
    });
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced, pathname]);

  return null;
}
