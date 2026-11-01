"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { type ProductCategory, productCategories } from "@/lib/products";
import { site } from "@/lib/site";
import { createPortal } from "react-dom";

import { ProductCard } from "@/components/ProductCard";

export function ProductGrid({ limit }: { limit?: number } = {}) {
  const [active, setActive] = useState<ProductCategory | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const items = typeof limit === "number" ? productCategories.slice(0, limit) : productCategories;

  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const focusTimer = setTimeout(() => closeRef.current?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(null);
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [active]);

  return (
    <>
      {/* ── 3-Column Engineering Grid with Strict Containment ── */}
      <div className="border-line bg-line grid w-full gap-px border sm:grid-cols-2 lg:grid-cols-3">
        {items.map((cat, i) => (
          <ProductCard
            key={cat.slug}
            product={cat}
            index={i}
            onSelect={(selected) => setActive(selected)}
          />
        ))}
      </div>

      {/* ── Technical Inspection Modal (Portaled to document.body) ── */}
      {active &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            data-nav-theme="dark"
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-panel-title"
          >
            {/* Backdrop */}
            <button
              type="button"
              className="modal-backdrop-animate bg-ink/85 absolute inset-0 backdrop-blur-md"
              onClick={() => setActive(null)}
              aria-label="Close specifications panel"
            />

            {/* Modal Container */}
            <div
              ref={dialogRef}
              data-lenis-prevent
              className="modal-dialog-animate border-line-strong bg-graphite relative [isolation:isolate] w-full max-w-3xl overflow-hidden border"
            >
              <div className="max-h-[92vh] overflow-y-auto overscroll-contain p-6 sm:p-8 md:p-10">
                {/* Header */}
                <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-5">
                  <div>
                    <div className="text-spark flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase">
                      <span>{active.code}</span>
                      <span className="text-white/20">/</span>
                      <span className="text-steel-500">{active.categoryTag}</span>
                    </div>
                    <h2
                      id="product-panel-title"
                      className="font-display mt-2 text-[clamp(2rem,4vw,3.25rem)] leading-none font-medium tracking-tight text-white"
                    >
                      {active.name}
                    </h2>
                  </div>
                  <button
                    ref={closeRef}
                    onClick={() => setActive(null)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/20 text-white transition-colors hover:border-white/50 hover:bg-white/10"
                    aria-label="Close dialog"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path
                        d="M2 2L10 10M10 2L2 10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Modal Body: Media + Technical Specs */}
                <div className="mt-6 grid gap-6 sm:grid-cols-12 sm:items-start">
                  {/* Image Preview */}
                  <div className="sm:col-span-5">
                    <div className="group bg-steel-900 relative [isolation:isolate] aspect-[4/3] w-full overflow-hidden border border-white/10 [-webkit-mask-image:-webkit-radial-gradient(white,black)]">
                      <Image
                        src={active.image}
                        alt={`${active.name} - Vijay Enterprises`}
                        fill
                        sizes="(max-width: 640px) 100vw, 320px"
                        className="object-cover contrast-110 grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                      />
                      <div className="from-graphite/70 absolute inset-0 bg-gradient-to-t to-transparent" />
                    </div>

                    <div className="bg-steel-950/60 mt-4 border border-white/10 p-3">
                      <p className="text-steel-500 font-mono text-[10px] tracking-wider uppercase">
                        Workshop Routing
                      </p>
                      <p className="text-steel-300 mt-1 text-xs">
                        All operations completed under one roof.
                      </p>
                    </div>
                  </div>

                  {/* Technical Specifications Details */}
                  <div className="flex flex-col justify-between sm:col-span-7">
                    <div>
                      <p className="text-steel-300 text-sm leading-relaxed sm:text-base">
                        {active.desc} Parts are quoted and manufactured to order based on drawing
                        files (DXF, DWG, PDF, STEP) or physical samples.
                      </p>

                      {/* Highlights Grid */}
                      <div className="bg-steel-900/40 mt-5 grid grid-cols-1 gap-3 border border-white/10 p-4">
                        <div>
                          <p className="text-steel-500 font-mono text-[10px] tracking-wider uppercase">
                            Specification & Tolerances
                          </p>
                          <p className="mt-1 font-mono text-xs text-white">{active.spec}</p>
                        </div>
                        <div>
                          <p className="text-steel-500 font-mono text-[10px] tracking-wider uppercase">
                            Production Machine
                          </p>
                          <p className="text-steel-300 mt-1 text-xs">{active.capacityHighlight}</p>
                        </div>
                      </div>

                      {/* Processes Chips */}
                      <div className="mt-5">
                        <p className="text-steel-500 font-mono text-[10px] tracking-wider uppercase">
                          Manufacturing Processes
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {active.processes.map((proc) => (
                            <span
                              key={proc}
                              className="bg-steel-900 text-steel-300 border border-white/15 px-3 py-1 font-mono text-[10px] tracking-[0.1em] uppercase"
                            >
                              {proc}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Materials */}
                      <div className="mt-4">
                        <p className="text-steel-500 font-mono text-[10px] tracking-wider uppercase">
                          Standard Materials
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {active.materials.map((mat) => (
                            <span
                              key={mat}
                              className="text-steel-300 border border-white/10 bg-white/5 px-2.5 py-1 text-xs"
                            >
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-5">
                      <Link
                        href={`/contact?product=${active.slug}`}
                        data-cursor-enquire
                        className="group bg-spark hover:text-ink! inline-flex h-[46px] items-center gap-3 px-6 font-mono text-[11px] font-medium tracking-[0.14em] text-white! uppercase transition-all duration-200 hover:bg-white"
                      >
                        <span>Request quote for this part</span>
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          aria-hidden="true"
                          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        >
                          <path
                            d="M1 9L9 1M9 1H1M9 1V9"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>

                      <a
                        href={`mailto:${site.email}?subject=Enquiry:%20${encodeURIComponent(active.name)}`}
                        className="text-steel-500 font-mono text-xs underline underline-offset-4 hover:text-white"
                      >
                        Email drawings to {site.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
