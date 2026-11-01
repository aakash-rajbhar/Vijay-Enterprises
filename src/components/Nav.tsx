"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GridLines } from "@/components/GridLines";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { links } from "@/lib/links";
import { site } from "@/lib/site";

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
        className={`fixed top-0 right-0 left-0 z-80 transition-transform duration-500 will-change-transform ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="nav-drop">
          <nav
            className={`border-b backdrop-blur-xl transition-colors duration-500 ${
              light ? "text-ink border-ink/10 bg-white/92" : "bg-ink/88 border-white/12 text-white"
            }`}
          >
            <div className="border-line mx-auto grid h-14 w-full max-w-[1360px] grid-cols-[1fr_auto] items-stretch border-x md:h-16 md:grid-cols-[auto_1fr_auto]">
              <Link
                href="/"
                className="border-line flex items-center gap-2.5 border-r px-4 md:px-5"
                aria-label="Vijay Enterprises home"
              >
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="bg-spark absolute inset-0" aria-hidden="true" />
                  <span
                    className={`absolute -inset-[3px] border ${light ? "border-ink/25" : "border-white/35"}`}
                    aria-hidden="true"
                  />
                </span>
                <span className="font-display text-[13px] tracking-[-0.01em] md:text-sm">
                  Vijay Enterprises
                </span>
              </Link>
              <div className="hidden items-stretch transition-colors duration-500 md:flex">
                {links.map((l) => {
                  const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      data-active={active}
                      aria-current={active ? "page" : undefined}
                      className={`border-line flex h-full items-center border-r px-4 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-200 ${
                        active
                          ? light
                            ? "bg-ink text-white!"
                            : "text-ink! bg-white"
                          : light
                            ? "text-ink/65 hover:bg-ink/5 hover:text-ink"
                            : "text-white/65 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {l.label}
                    </Link>
                  );
                })}
              </div>
              <div className="flex items-stretch">
                <Link
                  ref={quoteRef}
                  href="/contact"
                  data-cursor-enquire
                  onMouseMove={onQuoteMove}
                  onMouseLeave={onQuoteLeave}
                  className={`group border-line hidden h-full items-center gap-2.5 border-l px-4 font-mono text-[11px] font-medium tracking-[0.14em] uppercase transition-colors duration-200 will-change-transform md:inline-flex ${
                    light
                      ? "bg-ink hover:bg-spark hover:text-ink! text-white!"
                      : "bg-spark text-ink! hover:text-ink! hover:bg-white"
                  }`}
                >
                  Request a quote
                  <span className="flex h-5 w-5 items-center justify-center border border-current/30 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </span>
                </Link>
                <button
                  ref={triggerRef}
                  onClick={() => setOpen(true)}
                  className={`group border-line flex h-full w-14 items-center justify-center border-l transition-colors duration-300 md:hidden ${
                    light ? "text-ink hover:bg-ink/5" : "text-white hover:bg-white/5"
                  }`}
                  aria-expanded={open}
                  aria-controls="mobile-menu"
                  aria-label="Open menu"
                >
                  <span className="flex flex-col items-center justify-center gap-1.5">
                    <span
                      className={`block h-px w-5 shrink-0 transition-all duration-300 ${light ? "bg-ink" : "bg-white"}`}
                    />
                    <span
                      className={`block h-px w-5 shrink-0 transition-all duration-300 ${light ? "bg-ink" : "bg-white"}`}
                    />
                  </span>
                </button>
              </div>
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
            clipPath: entered ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          }}
        >
          <GridLines theme="dark" variant="frame" showCrosshairs={false} />
          <div className="relative z-[2] flex h-full flex-col">
            <div className="border-line border-b">
              <div className="border-line mx-auto flex h-14 w-full max-w-[1360px] items-stretch justify-between border-x">
                <Link
                  href="/"
                  onClick={() => closeMenu()}
                  className="flex items-center gap-2.5 px-4 text-sm md:px-5"
                >
                  <span className="relative flex h-2 w-2 items-center justify-center">
                    <span className="bg-spark absolute inset-0" aria-hidden="true" />
                    <span
                      className="absolute -inset-[3px] border border-white/35"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="font-display text-[13px] tracking-[-0.01em] md:text-sm">
                    Vijay Enterprises
                  </span>
                </Link>
                <button
                  ref={closeRef}
                  onClick={() => closeMenu(true)}
                  className="group border-line flex h-full w-14 items-center justify-center border-l transition-colors duration-300 hover:bg-white/5"
                  aria-label="Close menu"
                >
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span
                      className={`absolute block h-px w-5 bg-white transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                        entered ? "rotate-45" : "rotate-0"
                      }`}
                    />
                    <span
                      className={`absolute block h-px w-5 bg-white transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                        entered ? "-rotate-45" : "rotate-0"
                      }`}
                    />
                  </span>
                </button>
              </div>
            </div>
            <div className="border-line mx-auto flex w-full max-w-[1360px] flex-1 flex-col justify-center border-x">
              <nav className="flex flex-col">
                {menuLinks.map((l, i) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => closeMenu()}
                    className="group border-line flex items-baseline gap-5 border-b px-4 py-2 transition-colors hover:bg-white/5 md:gap-7 md:px-6"
                  >
                    <span className="text-steel-500 w-7 shrink-0 font-mono text-xs">
                      {i.toString().padStart(2, "0")}
                    </span>
                    <span className="block overflow-hidden pb-[0.06em]">
                      <span
                        className={`menu-link font-display block text-[clamp(2.5rem,11vw,8rem)] leading-[0.95] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          entered ? "translate-y-0" : "translate-y-full"
                        }`}
                        style={{
                          transitionDelay: entered ? `${120 + i * 65}ms` : "0ms",
                        }}
                      >
                        {l.label}
                      </span>
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="border-line mx-auto flex w-full max-w-[1360px] items-center justify-between border-x border-t px-4 py-5 md:px-6">
              <a href={`mailto:${site.email}`} className="text-steel-300 text-sm hover:text-white">
                {site.email}
              </a>
              <span className="text-steel-500 font-mono text-[11px] tracking-[0.14em] uppercase">
                Delhi NCR
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
