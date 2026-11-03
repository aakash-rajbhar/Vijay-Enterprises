"use client";

import Link from "next/link";

import { Grain } from "@/components/Grain";
import { GridLines } from "@/components/GridLines";

import { links } from "@/lib/links";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer data-nav-theme="dark" className="border-line bg-ink relative overflow-hidden border-t">
      <Grain />
      <GridLines theme="dark" variant="frame" />
      <div className="relative z-10 mx-auto max-w-[1360px] px-4 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:border-line md:col-span-6 md:border-r md:pr-8">
            <div className="flex items-center gap-2">
              <span className="bg-spark h-2 w-2" aria-hidden="true" />
              <span className="font-display text-lg">Vijay Enterprises</span>
            </div>
            <p className="text-steel-300 mt-4 max-w-[40ch]">
              Sheet metal fabrication under one roof. Delhi NCR only.
            </p>
          </div>
          <div className="md:border-line md:col-span-3 md:border-r md:pl-8">
            <p className="text-steel-500 font-mono text-[10px] tracking-[0.14em] uppercase">
              Pages
            </p>
            <nav className="mt-3 flex flex-col gap-2">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="text-steel-300 hover:text-white">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="md:col-span-3 md:pl-8">
            <p className="text-steel-500 font-mono text-[10px] tracking-[0.14em] uppercase">
              Contact
            </p>
            <div className="text-steel-300 mt-3 flex flex-col gap-2">
              <span>{site.address}</span>
              {site.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="hover:text-white"
                >
                  {phone}
                </a>
              ))}
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </div>
          </div>
        </div>
        <div className="border-line mt-12 flex flex-col gap-4 border-t pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-steel-500 font-mono text-[11px] tracking-[0.12em] uppercase">
            © Vijay Enterprises. All rights reserved.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex h-10 w-10 items-center justify-center border border-white/30 transition-colors hover:border-white hover:bg-white/5"
            aria-label="Back to top"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 10V2M6 2L2 6M6 2L10 6" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
        <div className="overflow-hidden">
          <div
            aria-hidden="true"
            className="font-display mt-10 bg-[linear-gradient(180deg,#303030_0%,transparent_100%)] bg-clip-text text-center text-[clamp(90px,21vw,300px)] leading-[0.8] font-bold tracking-[-0.06em] whitespace-nowrap text-transparent select-none"
          >
            Vijay Enterprises
          </div>
        </div>
      </div>
    </footer>
  );
}
