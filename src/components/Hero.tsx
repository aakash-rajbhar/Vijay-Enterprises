"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MaskedLines } from "@/components/MaskedLines";
import { Grain } from "@/components/Grain";
import { MagneticButton } from "@/components/MagneticButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const frame = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const mql = window.matchMedia(
      "(max-width: 1023px) and (orientation: portrait)",
    );
    const onChange = () => {
      el.load();
      if (!reduced) void el.play().catch(() => {});
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [reduced]);

  useEffect(() => {
    if (reduced || !frame.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img.current,
        { scale: 1.15 },
        { scale: 1, duration: 1.8, ease: "power3.out" },
      );
      gsap.to(img.current, {
        y: 60,
        ease: "none",
        scrollTrigger: {
          trigger: frame.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(headline.current, {
        y: -48,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: frame.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, frame);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section data-nav-theme="dark" className="p-0 md:p-4">
      <div
        ref={frame}
        className="relative flex h-[100svh] flex-col overflow-hidden border-0 border-white/10 md:h-[calc(100svh-32px)] md:rounded-[40px] md:border"
      >
        <div ref={img} className="absolute inset-0 will-change-transform">
          <video
            ref={video}
            className="h-full w-full object-cover object-center grayscale contrast-110"
            poster="/images/placeholder/placeholder-hero.jpg"
            autoPlay={!reduced}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source
              media="(max-width: 1023px) and (orientation: portrait)"
              src="/background-mobile.webm"
              type="video/webm"
            />
            <source src="/background.webm" type="video/webm" />
          </video>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(10,10,11,0.55)_70%,rgba(10,10,11,0.9)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
        <Grain />
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <span className="absolute left-[22%] top-0 h-full w-px bg-white/10" />
          <span className="absolute right-[18%] top-0 h-full w-px bg-white/10" />
          <span className="absolute left-0 top-[42%] h-px w-full bg-white/10" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-between p-5 md:p-8">
          <div className="flex items-start justify-between gap-6 pt-20 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 md:pt-4">
            <span>Sheet metal fabrication</span>
            <span>Delhi NCR only</span>
          </div>

          <div className="mt-16 flex flex-col gap-8 md:mt-0 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-white/60">
              <span className="relative flex h-10 w-5 items-start justify-center overflow-hidden">
                <span className="scroll-line block h-full w-px bg-white/30" />
              </span>
              <span>Scroll</span>
            </div>

            <div className="md:max-w-[62%] md:text-right">
              <h1
                ref={headline}
                className="font-display text-[clamp(3.25rem,9vw,9rem)] leading-[0.9] tracking-[-0.04em] text-white"
              >
                <MaskedLines
                  lines={["Precision metal work,", "cut to your drawing."]}
                  delay={0.15}
                  scroll={false}
                />
              </h1>
              <p className="mt-5 text-base text-steel-300 md:ml-auto md:max-w-[46ch]">
                Laser cutting, shearing, bending, welding and fabrication under
                one roof.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3 md:justify-end">
                <MagneticButton href="/contact">Request a quote</MagneticButton>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-3 rounded-pill border border-white/30 px-5 py-3 text-sm text-white transition-colors hover:border-white/60"
                >
                  See services
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 9L9 1M9 1H1M9 1V9"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
