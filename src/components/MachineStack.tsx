"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { machines } from "@/lib/machines";
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
          onEnter: () => gsap.to(cards[i - 1], { scale: 0.96, opacity: 0.7, transformOrigin: "top center", duration: 0.35, ease: "power2.out" }),
          onLeaveBack: () => gsap.to(cards[i - 1], { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" }),
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
          className={`rounded-[var(--radius-card)] border border-white/10 bg-graphite p-5 md:p-8 ${reduced ? "" : "md:sticky"}`}
          style={{ top: `${96 + i * 18}px`, zIndex: i + 1 }}
        >
          <div className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
            <div data-image-reveal className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-steel-900">
              <Image
                src={m.image}
                alt={`${m.name} - sheet metal fabrication machine`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-full w-full object-cover grayscale contrast-110"
              />
            </div>
            <div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${i === 0 ? "bg-spark text-ink" : "bg-white/5 text-steel-300"}`}>
                <span className="font-mono text-[10px]">0{i + 1}</span>
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-steel-500">{m.role}</p>
              <h3 className="mt-2 font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-none tracking-[-0.02em]">{m.name}</h3>
              <p className="mt-3 max-w-[38ch] text-steel-300">{m.desc}</p>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-steel-500">Shop floor</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
