"use client";

import Link from "next/link";

export function MobileQuoteFab() {
  return (
    <div className="fixed bottom-4 right-4 z-[70] md:hidden">
      <Link
        href="/contact"
        data-cursor-enquire
        className="group inline-flex items-center gap-2 rounded-pill border border-white/20 bg-ink/80 px-4 py-2 text-sm text-white shadow-[0_10px_40px_-20px_rgba(255,74,28,0.9)] backdrop-blur-xl transition-[transform,background-color] duration-300 hover:translate-y-[-2px]"
      >
        Request a quote
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-spark transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </span>
      </Link>
    </div>
  );
}
