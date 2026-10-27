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
      ScrollTrigger.batch("[data-image-reveal]", {
        start: "top 92%",
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            {
              opacity: 0,
              y: 24,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.95,
              stagger: 0.08,
              ease: "power2.out",
              clearProps: "transform,opacity",
            }
          );

          batch.forEach((el) => {
            const img = el.querySelector("img");
            if (img) {
              gsap.fromTo(
                img,
                { scale: 1.06 },
                {
                  scale: 1,
                  duration: 1.25,
                  ease: "power2.out",
                  clearProps: "transform",
                }
              );
            }
          });
        },
      });
    });
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced, pathname]);

  return null;
}
