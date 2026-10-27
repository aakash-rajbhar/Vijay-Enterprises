"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { productCategories, type ProductCategory } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { site } from "@/lib/site";

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
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      {active && typeof document !== "undefined" && createPortal(
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
            className="modal-backdrop-animate absolute inset-0 bg-ink/85 backdrop-blur-md"
            onClick={() => setActive(null)}
            aria-label="Close specifications panel"
          />

          {/* Modal Container */}
          <div
            ref={dialogRef}
            className="modal-dialog-animate relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[var(--radius-card)] border border-white/15 bg-graphite p-6 sm:p-8 md:p-10 shadow-2xl [isolation:isolate]"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-spark">
                  <span>{active.code}</span>
                  <span className="text-white/20">/</span>
                  <span className="text-steel-500">{active.categoryTag}</span>
                </div>
                <h2
                  id="product-panel-title"
                  className="mt-2 font-display text-[clamp(2rem,4vw,3.25rem)] font-medium leading-none tracking-tight text-white"
                >
                  {active.name}
                </h2>
              </div>
              <button
                ref={closeRef}
                onClick={() => setActive(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/50 hover:bg-white/10"
                aria-label="Close dialog"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
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
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-steel-900 [isolation:isolate] [-webkit-mask-image:-webkit-radial-gradient(white,black)]">
                  <Image
                    src={active.image}
                    alt={`${active.name} - Vijay Enterprises`}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover grayscale contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite/70 to-transparent" />
                </div>

                <div className="mt-4 rounded-xl border border-white/5 bg-steel-950/60 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-steel-500">
                    Workshop Routing
                  </p>
                  <p className="mt-1 text-xs text-steel-300">
                    All operations completed under one roof at Tughlakabad Village, New Delhi.
                  </p>
                </div>
              </div>

              {/* Technical Specifications Details */}
              <div className="sm:col-span-7 flex flex-col justify-between">
                <div>
                  <p className="text-sm leading-relaxed text-steel-300 sm:text-base">
                    {active.desc} Parts are quoted and manufactured to order based on drawing files (DXF, DWG, PDF, STEP) or physical samples.
                  </p>

                  {/* Highlights Grid */}
                  <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-white/10 bg-steel-900/40 p-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-steel-500">
                        Specification & Tolerances
                      </p>
                      <p className="mt-1 font-mono text-xs text-white">
                        {active.spec}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-steel-500">
                        Production Machine
                      </p>
                      <p className="mt-1 text-xs text-steel-300">
                        {active.capacityHighlight}
                      </p>
                    </div>
                  </div>

                  {/* Processes Chips */}
                  <div className="mt-5">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-steel-500">
                      Manufacturing Processes
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {active.processes.map((proc) => (
                        <span
                          key={proc}
                          className="rounded-full border border-white/15 bg-steel-900 px-3 py-1 font-mono text-xs text-steel-300"
                        >
                          {proc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Materials */}
                  <div className="mt-4">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-steel-500">
                      Standard Materials
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {active.materials.map((mat) => (
                        <span
                          key={mat}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-steel-300"
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
                    className="inline-flex items-center gap-3 rounded-pill bg-spark px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-spark-deep"
                  >
                    Request quote for this part
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
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>

                  <a
                    href={`mailto:${site.email}?subject=Enquiry:%20${encodeURIComponent(active.name)}`}
                    className="font-mono text-xs text-steel-500 underline underline-offset-4 hover:text-white"
                  >
                    Email drawings to {site.email}
                  </a>
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
