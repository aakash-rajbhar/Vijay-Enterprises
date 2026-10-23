"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Item = {
  number: string;
  title: string;
  description: string;
  spec: string;
  detail: string;
  image: string;
};

export function ServiceAccordion({ items }: { items: readonly Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    let raf = 0;
    let x = 0;
    let y = 0;
    const loop = () => {
      x += (target.current.x - x) * 0.16;
      y += (target.current.y - y) * 0.16;
      if (preview.current) {
        preview.current.style.transform = `translate3d(${x + 24}px, ${y - 110}px, 0) rotate(-3deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !wrap.current) return;
    const rect = wrap.current.getBoundingClientRect();
    target.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <div ref={wrap} className="relative border-t border-white/10" onMouseMove={onMove}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const dim = hovered !== null && hovered !== i;
        return (
          <div
            key={item.number}
            className={`border-b border-white/10 transition-opacity duration-300 ${dim ? "opacity-40" : "opacity-100"}`}
            onMouseEnter={() => { if (!reduced) setHovered(i); }}
            onMouseLeave={() => setHovered(null)}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="group flex w-full items-center gap-4 py-6 text-left md:gap-8 md:py-8"
              aria-expanded={isOpen}
              aria-controls={`service-detail-${i}`}
              id={`service-trigger-${i}`}
            >
              <span className="w-8 shrink-0 font-mono text-xs text-spark">{item.number}</span>
              <span className="flex-1 font-display text-[clamp(1.5rem,3vw,2.75rem)] leading-none transition-transform duration-300 group-hover:translate-x-2">
                {item.title}
              </span>
              <span className="hidden max-w-[32ch] text-right text-sm text-steel-300 md:block">{item.description}</span>
              <span className="hidden font-mono text-xs text-steel-500 lg:block">{item.spec}</span>
              <span className={`ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
            </button>
            <div
              id={`service-detail-${i}`}
              role="region"
              aria-labelledby={`service-trigger-${i}`}
              aria-hidden={!isOpen}
              className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <div className="pb-6 pl-12 md:pl-16 md:pb-8">
                  <p className="max-w-[62ch] text-steel-300">{item.detail}</p>
                  <p className="mt-3 font-mono text-xs text-steel-500 md:hidden">{item.spec}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div
        ref={preview}
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 z-30 hidden h-[220px] w-[170px] overflow-hidden rounded-[22px] border border-white/20 transition-opacity duration-200 lg:block ${hovered !== null ? "opacity-100" : "opacity-0"}`}
      >
        {hovered !== null && (
          <Image src={items[hovered].image} alt="" fill sizes="170px" className="object-cover grayscale contrast-110" />
        )}
      </div>
    </div>
  );
}
