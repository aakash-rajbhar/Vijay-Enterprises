"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { links } from "@/lib/links";
import { site } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const menuLinks = [{ href: "/", label: "Home" }, ...links];

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const quoteRef = useRef<HTMLAnchorElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(reduced ? false : y > 120 && y > lastY);
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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = useCallback(() => {
    setEntered(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), reduced ? 0 : 480);
  }, [reduced]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => setEntered(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeMenu]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const onQuoteMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduced || !quoteRef.current) return;
    const rect = quoteRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    quoteRef.current.style.transform = `translate(${Math.max(-10, Math.min(10, x * 0.22))}px, ${Math.max(-10, Math.min(10, y * 0.22))}px)`;
  };

  const onQuoteLeave = () => {
    if (quoteRef.current) quoteRef.current.style.transform = "translate(0px, 0px)";
  };

  const light = theme === "light";

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-4 z-[80] px-3 transition-transform duration-500 md:px-4 ${hidden && !open ? "-translate-y-[140%]" : "translate-y-0"}`}
      >
        <div className="nav-drop">
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
                className={`nav-underline text-sm transition-colors ${light ? "text-ink/70 hover:text-ink" : "text-white/80 hover:text-white"}`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link
              ref={quoteRef}
              href="/contact"
              data-cursor-enquire
              onMouseMove={onQuoteMove}
              onMouseLeave={onQuoteLeave}
              className={`group hidden items-center gap-2 rounded-pill px-4 py-2 text-sm transition-[transform,background-color,color] duration-300 ease-out will-change-transform md:inline-flex ${
                light ? "bg-ink text-white hover:bg-graphite" : "bg-white text-ink hover:bg-white/90"
              }`}
            >
              Request a quote
              <span className={`flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${light ? "bg-white/15" : "bg-ink/10"}`}>
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
            </Link>
            <button
              onClick={() => setOpen(true)}
              className={`rounded-pill border px-4 py-2 text-sm md:hidden ${light ? "border-ink/20" : "border-white/30"}`}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              Menu
            </button>
          </div>
        </nav>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[150] bg-ink transition-[clip-path] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{
            clipPath: entered ? "circle(150% at calc(100% - 44px) 44px)" : "circle(0% at calc(100% - 44px) 44px)",
          }}
        >
          <div className="flex h-full flex-col">
            <div className="mx-auto flex w-full max-w-[1360px] items-center justify-between px-4 py-6 md:px-8">
              <Link href="/" onClick={closeMenu} className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 bg-spark" aria-hidden="true" />
                <span className="font-display">Vijay Enterprises</span>
              </Link>
              <button onClick={closeMenu} className="rounded-pill border border-white/30 px-4 py-2 text-sm">
                Close
              </button>
            </div>
            <div className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col justify-center px-4 md:px-8">
              <nav className="flex flex-col gap-3">
                {menuLinks.map((l, i) => (
                  <Link key={l.href} href={l.href} onClick={closeMenu} className="group flex items-baseline gap-5 md:gap-7">
                    <span className="w-7 shrink-0 font-mono text-sm text-steel-500">{i.toString().padStart(2, "0")}</span>
                    <span className="block overflow-hidden pb-[0.06em]">
                      <span
                        className={`menu-link block font-display text-[clamp(2.5rem,11vw,8rem)] leading-[0.95] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          entered ? "translate-y-0" : "translate-y-full"
                        }`}
                        style={{ transitionDelay: entered ? `${120 + i * 65}ms` : "0ms" }}
                      >
                        {l.label}
                      </span>
                    </span>
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
