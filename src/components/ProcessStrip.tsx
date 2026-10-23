"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  { number: "01", label: "Cut", image: "/images/placeholder/placeholder-cut.jpg" },
  { number: "02", label: "Shear", image: "/images/placeholder/placeholder-shear.jpg" },
  { number: "03", label: "Bend", image: "/images/placeholder/placeholder-bend.jpg" },
  { number: "04", label: "Weld", image: "/images/placeholder/placeholder-weld.jpg" },
  { number: "05", label: "Fabricate", image: "/images/placeholder/placeholder-fabricate.jpg" },
];

function Card({ stage }: { stage: (typeof stages)[number] }) {
  return (
    <Link href="/services" className="group block w-[clamp(260px,30vw,420px)] shrink-0" data-cursor-row>
      <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] border border-black/5 bg-steel-900">
        <Image
          src={stage.image}
          alt={`Placeholder image representing ${stage.label.toLowerCase()}`}
          fill
          sizes="(max-width: 1024px) 72vw, 30vw"
          className="image-drift object-cover grayscale contrast-110" data-cursor="view"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 font-mono text-xs text-white/70">{stage.number}</span>
        <span className="absolute bottom-4 left-4 rounded-pill bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-md">{stage.label}</span>
      </div>
    </Link>
  );
}

export function ProcessStrip() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const numerals = useRef<Array<HTMLSpanElement | null>>([]);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !wrap.current || !track.current) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    if (!mq.matches) return;

    const ctx = gsap.context(() => {
      const distance = () => (track.current ? track.current.scrollWidth - wrap.current!.clientWidth : 0);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${Math.max(distance() + 320, 600)}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(track.current, { x: () => -distance(), ease: "none", duration: 1 }, 0);
      tl.to(progress.current, { scaleX: 1, ease: "none", duration: 1 }, 0);

      numerals.current.forEach((el, i) => {
        if (!el || i === 0) return;
        const at = i / stages.length;
        if (numerals.current[i - 1]) {
          tl.to(numerals.current[i - 1], { y: -24, opacity: 0, duration: 0.08 }, at);
        }
        tl.fromTo(el, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.08 }, at);
      });
    }, wrap);

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stages.map((stage) => (
          <Card key={stage.number} stage={stage} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0 lg:hidden">
        {stages.map((stage) => (
          <div key={stage.number} className="w-[72vw] max-w-[340px] snap-start sm:w-[42vw]">
            <Card stage={stage} />
          </div>
        ))}
      </div>
      <div className="mt-8 hidden lg:block">
        <div className="mb-4 flex items-end justify-between">
          <div className="relative h-8 w-20 overflow-hidden">
            {stages.map((stage, i) => (
              <span
                key={stage.number}
                ref={(el) => {
                  numerals.current[i] = el;
                }}
                className="absolute left-0 top-0 font-mono text-2xl leading-none text-spark"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {stage.number}
              </span>
            ))}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel-500">Scroll to advance</span>
        </div>
        <div ref={wrap} className="relative flex h-[72vh] min-h-[560px] items-center overflow-hidden">
          <div ref={track} className="flex w-max gap-5 will-change-transform">
            {stages.map((stage) => (
              <Card key={stage.number} stage={stage} />
            ))}
          </div>
        </div>
        <div className="mt-2 h-px w-full bg-steel-200">
          <div ref={progress} className="h-px origin-left scale-x-0 bg-spark" />
        </div>
      </div>
    </>
  );
}
