"use client";

import Link from "next/link";

export function MobileQuoteFab() {
  return (
    <div className="fixed bottom-4 right-4 z-[70] md:hidden">
      <Link
        href="/contact"
        data-cursor-enquire
        className="group inline-flex h-12 items-center gap-3 border border-line bg-ink/90 pl-4 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-xl transition-colors duration-300"
      >
        Request a quote
        <span className="flex h-full w-11 items-center justify-center bg-spark text-ink transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </span>
      </Link>
    </div>
  );
}
