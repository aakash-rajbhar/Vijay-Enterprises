"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { links } from "@/lib/links";
import { site } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 120 && y > lastY);
      lastY = y;

      const probe = 48;
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-theme]"));
      const active = sections.find((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= probe && r.bottom > probe;
      });
      setTheme(active?.dataset.navTheme === "light" ? "light" : "dark");
    };
    onScroll();
    if (reduced) return;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const light = theme === "light";

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-4 z-[80] px-3 transition-transform duration-500 md:px-4 ${hidden && !open ? "-translate-y-[140%]" : "translate-y-0"}`}
      >
        <nav
          className={`mx-auto flex max-w-[1360px] items-center justify-between rounded-pill border px-4 py-2 backdrop-blur-xl transition-colors duration-500 md:px-6 ${
            light ? "border-black/10 bg-white/70 text-ink" : "border-white/15 bg-white/10 text-white"
          }`}
        >
          <Link href="/" className="flex items-center gap-2 text-sm" aria-label="Vijay Enterprises home">
            <span className="h-2 w-2 bg-spark" aria-hidden="true" />
            <span className="font-display">Vijay Enterprises</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm transition-colors ${light ? "text-ink/70 hover:text-ink" : "text-white/80 hover:text-white"}`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className={`hidden items-center gap-2 rounded-pill px-4 py-2 text-sm transition-colors md:inline-flex ${
                light ? "bg-ink text-white hover:bg-graphite" : "bg-white text-ink hover:bg-white/90"
              }`}
            >
              Request a quote
              <span className={`flex h-6 w-6 items-center justify-center rounded-full ${light ? "bg-white/15" : "bg-ink/10"}`}>
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
            </Link>
            <button
              onClick={() => setOpen(true)}
              className={`rounded-pill border px-4 py-2 text-sm md:hidden ${light ? "border-ink/20" : "border-white/30"}`}
            >
              Menu
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-[150] bg-ink">
          <div className="flex h-full flex-col">
            <div className="mx-auto flex w-full max-w-[1360px] items-center justify-between px-4 py-6 md:px-8">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 bg-spark" aria-hidden="true" />
                <span className="font-display">Vijay Enterprises</span>
              </Link>
              <button onClick={() => setOpen(false)} className="rounded-pill border border-white/30 px-4 py-2 text-sm">
                Close
              </button>
            </div>
            <div className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col justify-center px-4 md:px-8">
              <nav className="flex flex-col gap-4">
                <Link href="/" onClick={() => setOpen(false)} className="group flex items-baseline gap-6">
                  <span className="font-mono text-sm text-steel-500">00</span>
                  <span className="font-display text-[clamp(2.5rem,11vw,8rem)] leading-[0.95] transition-transform group-hover:translate-x-2">Home</span>
                </Link>
                {links.map((l, i) => (
                  <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="group flex items-baseline gap-6">
                    <span className="font-mono text-sm text-steel-500">{(i + 1).toString().padStart(2, "0")}</span>
                    <span className="font-display text-[clamp(2.5rem,11vw,8rem)] leading-[0.95] transition-transform group-hover:translate-x-2">{l.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mx-auto flex w-full max-w-[1360px] items-center justify-between px-4 py-6 md:px-8">
              <a href={`mailto:${site.email}`} className="text-sm text-steel-300">
                {site.email}
              </a>
              <span className="text-sm text-steel-500">Delhi NCR</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
