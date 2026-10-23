"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const textSelector = "p, h1, h2, h3, h4, h5, h6, li, label, input, textarea, select, option";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;

    let x = 0,
      y = 0,
      rx = 0,
      ry = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
    };
    window.addEventListener("mousemove", move);

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      setVisible(!target?.closest(textSelector));
    };
    window.addEventListener("mouseover", over);

    let raf = 0;
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const add = () => setHover("view");
    const remove = () => setHover(null);
    const addDrag = () => setHover("drag");
    const addEnq = () => setHover("enquire");

    const imgs = document.querySelectorAll("img[data-cursor]");
    imgs.forEach((el) => {
      el.addEventListener("mouseenter", add);
      el.addEventListener("mouseleave", remove);
    });
    const rows = document.querySelectorAll("[data-cursor-row]");
    rows.forEach((el) => {
      el.addEventListener("mouseenter", addDrag);
      el.addEventListener("mouseleave", remove);
    });
    const links = document.querySelectorAll("a[data-cursor-enquire]");
    links.forEach((el) => {
      el.addEventListener("mouseenter", addEnq);
      el.addEventListener("mouseleave", remove);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      imgs.forEach((el) => {
        el.removeEventListener("mouseenter", add);
        el.removeEventListener("mouseleave", remove);
      });
      rows.forEach((el) => {
        el.removeEventListener("mouseenter", addDrag);
        el.removeEventListener("mouseleave", remove);
      });
      links.forEach((el) => {
        el.removeEventListener("mouseenter", addEnq);
        el.removeEventListener("mouseleave", remove);
      });
    };
  }, [reduced, pathname]);

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none hidden md:block">
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[120] h-[10px] w-[10px] rounded-full bg-white mix-blend-difference transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div
        ref={ring}
        className={`pointer-events-none fixed left-0 top-0 z-[119] flex items-center justify-center rounded-full border border-white/70 mix-blend-difference transition-[width,height,opacity] duration-200 ${
          hover ? "h-[72px] w-[72px]" : "h-[36px] w-[36px]"
        }`}
        style={{ opacity: visible ? 1 : 0 }}
      >
        {hover && <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white">{hover}</span>}
      </div>
    </div>
  );
}
