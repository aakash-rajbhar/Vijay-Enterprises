"use client";

import { useState } from "react";

type Item = { number: string; title: string; description: string; spec: string; detail: string };

export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-white/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.number} className="border-b border-white/10">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="group flex w-full items-center gap-4 py-6 text-left md:gap-8 md:py-8"
              aria-expanded={isOpen}
              aria-controls={`accordion-detail-${i}`}
              id={`accordion-trigger-${i}`}
            >
              <span className="w-8 font-mono text-xs text-spark">{item.number}</span>
              <span className="flex-1 font-display text-[clamp(1.5rem,3vw,2.75rem)] leading-none transition-transform duration-300 group-hover:translate-x-2">
                {item.title}
              </span>
              <span className="hidden max-w-[32ch] text-right text-sm text-steel-300 md:block">{item.description}</span>
              <span className="hidden font-mono text-xs text-steel-500 lg:block">{item.spec}</span>
              <span className={`ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 transition-transform ${isOpen ? "rotate-45" : ""}`}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
            </button>
            <div
              id={`accordion-detail-${i}`}
              role="region"
              aria-labelledby={`accordion-trigger-${i}`}
              aria-hidden={!isOpen}
              className={`grid transition-all duration-500 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
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
    </div>
  );
}
