"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();

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

  const closeMenu = useCallback(
    (restoreFocus = false) => {
      setEntered(false);
      if (closeTimer.current) clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(
        () => {
          setOpen(false);
          if (restoreFocus) triggerRef.current?.focus();
        },
        reduced ? 0 : 480
      );
    },
    [reduced]
  );

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => setEntered(true));
    const focusTimer = setTimeout(() => closeRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu(true);
        return;
      }
      if (e.key !== "Tab" || !menuRef.current) return;
      const focusables = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
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
      cancelAnimationFrame(id);
      clearTimeout(focusTimer);
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
        className={`fixed top-4 right-0 left-0 z-[80] px-3 transition-transform duration-500 md:px-4 ${hidden && !open ? "-translate-y-[140%]" : "translate-y-0"}`}
      >
        <div className="nav-drop">
          <nav
            className={`rounded-pill mx-auto flex max-w-[1360px] items-center justify-between border px-4 py-2 backdrop-blur-xl transition-all duration-500 md:px-6 ${
              light
                ? "text-ink border-black/10 bg-white/80 shadow-[0_10px_60px_-20px_rgba(10,10,11,0.6)]"
                : "border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-white/10 text-white shadow-[0_10px_60px_-30px_rgba(255,74,28,0.4)]"
            }`}
          >
            <Link
              href="/"
              className="flex items-center gap-2.5 text-sm"
              aria-label="Vijay Enterprises home"
            >
              <span className="relative h-2 w-2">
                <span className="bg-spark absolute inset-0" aria-hidden="true" />
                <span
                  className="bg-spark/30 absolute -inset-1 rounded-full blur-[2px]"
                  aria-hidden="true"
                />
              </span>
              <span className="font-display tracking-[-0.02em]">Vijay Enterprises</span>
            </Link>
            <div
              className={`hidden items-center gap-0.5 rounded-pill p-1 transition-colors duration-500 md:flex ${
                light ? "bg-black/[0.04]" : "bg-white/[0.08]"
              }`}
            >
              {links.map((l) => {
                const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    data-active={active}
                    aria-current={active ? "page" : undefined}
                    className={`nav-underline rounded-pill px-3.5 py-1.5 text-[13px] tracking-[-0.01em] transition-colors duration-300 ${
                      light
                        ? active
                          ? "text-ink"
                          : "text-ink/70 hover:text-ink"
                        : active
                          ? "text-white"
                          : "text-white/80 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <Link
                ref={quoteRef}
                href="/contact"
                data-cursor-enquire
                onMouseMove={onQuoteMove}
                onMouseLeave={onQuoteLeave}
                className={`group hidden items-center gap-2.5 rounded-pill px-5 py-2 text-sm font-medium transition-all duration-300 ease-out will-change-transform md:inline-flex ${
                  light
                    ? "bg-spark text-ink hover:bg-spark-deep hover:text-white shadow-[0_10px_40px_-18px_rgba(255,74,28,0.9)] hover:shadow-[0_12px_50px_-16px_rgba(255,74,28,0.95)]"
                    : "bg-white text-ink hover:bg-spark hover:text-ink shadow-[0_12px_50px_-18px_rgba(255,255,255,0.7)] hover:shadow-[0_14px_60px_-14px_rgba(255,74,28,0.8)]"
                }`}
              >
                Request a quote
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-45 ${
                    light ? "bg-black/10 group-hover:bg-white/20" : "bg-ink/10"
                  }`}
                >
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </span>
              </Link>
              <button
                ref={triggerRef}
                onClick={() => setOpen(true)}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 md:hidden ${
                  light
                    ? "border-ink/15 hover:border-ink/40"
                    : "border-white/30 hover:border-white/60"
                }`}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label="Open menu"
              >
                <span className="flex flex-col items-center justify-center gap-1">
                  <span
                    className={`block h-[1.5px] w-4 transition-all duration-300 ${
                      light ? "bg-ink" : "bg-white"
                    }`}
                  />
                  <span
                    className={`block h-[1.5px] w-4 transition-all duration-300 ${
                      light ? "bg-ink" : "bg-white"
                    }`}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {open && (
        <div
          ref={menuRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="bg-ink fixed inset-0 z-[150] transition-[clip-path] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{
            clipPath: entered
              ? "circle(150% at calc(100% - 44px) 44px)"
              : "circle(0% at calc(100% - 44px) 44px)",
          }}
        >
          <div className="flex h-full flex-col">
            <div className="mt-4 px-3 md:px-4">
              <div className="mx-auto flex h-14 w-full max-w-[1360px] items-center justify-between px-4 md:px-6">
                <Link
                  href="/"
                  onClick={() => closeMenu()}
                  className="flex items-center gap-2.5 text-sm"
                >
                  <span className="relative h-2 w-2">
                    <span className="bg-spark absolute inset-0" aria-hidden="true" />
                    <span
                      className="bg-spark/30 absolute -inset-1 rounded-full blur-[2px]"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="font-display tracking-[-0.02em]">Vijay Enterprises</span>
                </Link>
                <button
                  ref={closeRef}
                  onClick={() => closeMenu(true)}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition-colors duration-300 hover:border-white/60"
                  aria-label="Close menu"
                >
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span
                      className={`absolute block h-[1.5px] w-4 bg-white transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                        entered ? "rotate-45" : "rotate-0"
                      }`}
                    />
                    <span
                      className={`absolute block h-[1.5px] w-4 bg-white transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                        entered ? "-rotate-45" : "rotate-0"
                      }`}
                    />
                  </span>
                </button>
              </div>
            </div>
            <div className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col justify-center px-4 md:px-8">
              <nav className="flex flex-col gap-3">
                {menuLinks.map((l, i) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => closeMenu()}
                    className="group flex items-baseline gap-5 md:gap-7"
                  >
                    <span className="text-steel-500 w-7 shrink-0 font-mono text-sm">
                      {i.toString().padStart(2, "0")}
                    </span>
                    <span className="block overflow-hidden pb-[0.06em]">
                      <span
                        className={`menu-link font-display block text-[clamp(2.5rem,11vw,8rem)] leading-[0.95] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
              <a href={`mailto:${site.email}`} className="text-steel-300 text-sm">
                {site.email}
              </a>
              <span className="text-steel-500 text-sm">Delhi NCR</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
