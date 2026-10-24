"use client";

import Link from "next/link";
import { links } from "@/lib/links";
import { site } from "@/lib/site";
import { Grain } from "@/components/Grain";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink">
      <Grain />
      <div className="relative z-10 mx-auto max-w-[1360px] px-4 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-spark" aria-hidden="true" />
              <span className="font-display text-lg">Vijay Enterprises</span>
            </div>
            <p className="mt-4 max-w-[40ch] text-steel-300">
              Sheet metal fabrication under one roof in Tughlakabad, New Delhi.
              Delhi NCR only.
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="text-sm text-steel-500">Pages</p>
            <nav className="mt-3 flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-steel-300 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="md:col-span-3">
            <p className="text-sm text-steel-500">Contact</p>
            <div className="mt-3 flex flex-col gap-2 text-steel-300">
              <span>{site.address}</span>
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-steel-900 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-steel-500">
            © Vijay Enterprises. All rights reserved.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30"
            aria-label="Back to top"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 10V2M6 2L2 6M6 2L10 6"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-hidden">
          <div
            aria-hidden="true"
            className="mt-10 bg-[linear-gradient(180deg,#303030_0%,transparent_100%)] bg-clip-text text-center font-display text-[clamp(90px,21vw,300px)] font-bold leading-[0.8] tracking-[-0.06em] text-transparent select-none whitespace-nowrap"
          >
            Vijay Enterprises
          </div>
        </div>
      </div>
    </footer>
  );
}
