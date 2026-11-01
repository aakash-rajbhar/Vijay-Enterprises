"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";

import { machines } from "@/lib/machines";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function MachineStack() {
  const list = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !list.current) return;
    const cards = Array.from(list.current.querySelectorAll<HTMLElement>("[data-stack-card]"));
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        if (i === 0) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top 72%",
          onEnter: () =>
            gsap.to(cards[i - 1], {
              scale: 0.96,
              opacity: 0.7,
              transformOrigin: "top center",
              duration: 0.35,
              ease: "power2.out",
            }),
          onLeaveBack: () =>
            gsap.to(cards[i - 1], {
              scale: 1,
              opacity: 1,
              duration: 0.35,
              ease: "power2.out",
            }),
        });
      });
    }, list);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={list} className="mt-10 space-y-5">
      {machines.map((m, i) => (
        <article
          key={m.name}
          data-stack-card
          className={`border-line bg-graphite border p-5 md:p-8 ${reduced ? "" : "md:sticky"}`}
          style={{ top: `${80 + i * 18}px`, zIndex: i + 1 }}
        >
          <div className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
            <div
              data-image-reveal
              className="bg-steel-900 relative aspect-[16/10] overflow-hidden border border-white/10"
            >
              <Image
                src={m.image}
                alt={`${m.name} - sheet metal fabrication machine`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-full w-full object-cover contrast-110"
              />
            </div>
            <div>
              <div
                className={`flex h-8 w-8 items-center justify-center border ${i === 0 ? "border-spark bg-spark text-ink" : "text-steel-300 border-white/15 bg-white/5"}`}
              >
                <span className="font-mono text-[10px]">0{i + 1}</span>
              </div>
              <p className="text-steel-500 mt-4 font-mono text-[10px] tracking-[0.14em] uppercase">
                {m.role}
              </p>
              <h3 className="font-display mt-2 text-[clamp(1.75rem,3.5vw,3rem)] leading-none tracking-[-0.02em]">
                {m.name}
              </h3>
              <p className="text-steel-300 mt-3 max-w-[38ch]">{m.desc}</p>
              <p className="text-steel-500 mt-5 font-mono text-[10px] tracking-[0.14em] uppercase">
                Shop floor
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
