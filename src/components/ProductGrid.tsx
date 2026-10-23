"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { productCategories } from "@/lib/products";

const images: Record<string, string> = {
  "machine-parts": "/images/placeholder/placeholder-machine-parts.jpg",
  "covers-and-panels": "/images/placeholder/placeholder-covers-panels.jpg",
  hoppers: "/images/placeholder/placeholder-hoppers.jpg",
  ladders: "/images/placeholder/placeholder-ladders.jpg",
  tables: "/images/placeholder/placeholder-tables.jpg",
  gates: "/images/placeholder/placeholder-gates.jpg",
  "jali-designs": "/images/placeholder/placeholder-jali.jpg",
  "metal-frames": "/images/placeholder/placeholder-frames.jpg",
};

const processChips: Record<string, string[]> = {
  "machine-parts": ["Laser cutting", "Bending", "Welding"],
  "covers-and-panels": ["Shearing", "Bending", "Welding"],
  hoppers: ["Shearing", "Bending", "Welding"],
  ladders: ["Shearing", "Welding"],
  tables: ["Shearing", "Welding"],
  gates: ["Shearing", "Welding"],
  "jali-designs": ["Laser cutting"],
  "metal-frames": ["Laser cutting", "Welding"],
};

export function ProductGrid() {
  const [active, setActive] = useState<(typeof productCategories)[number] | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {productCategories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActive(cat)}
            className="group text-left"
            aria-haspopup="dialog"
            data-cursor-row
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] border border-black/5 bg-steel-900">
              <Image
                src={images[cat.slug]}
                alt={`Placeholder process image for ${cat.name}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover grayscale contrast-110 transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-ink/20 text-white backdrop-blur-sm transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">Products</p>
                <p className="mt-1 font-display text-2xl text-white">{cat.name}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-[160] flex items-end justify-center p-4 md:items-center" role="dialog" aria-modal="true" aria-label={active.name}>
          <button className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={() => setActive(null)} aria-label="Close panel" />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[var(--radius-card)] bg-graphite p-6 md:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel-500">Products / {active.slug}</p>
                <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-none">{active.name}</h2>
              </div>
              <button onClick={() => setActive(null)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30" aria-label="Close">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            </div>
            <p className="mt-5 max-w-[52ch] text-steel-300">{active.desc} Every part is made to order from a drawing, material, and quantity.</p>
            <div className="mt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel-500">Made with</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {processChips[active.slug].map((chip) => (
                  <span key={chip} className="rounded-pill border border-white/15 px-3 py-1 text-xs text-steel-300">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href={`/contact?product=${active.slug}`}
              className="mt-8 inline-flex items-center gap-3 rounded-pill bg-spark px-5 py-3 text-sm text-white transition-colors hover:bg-spark-deep"
            >
              Enquire about this
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
