"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();

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

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

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
      window.removeEventListener("mousemove", move);
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
  }, [reduced]);

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="hidden md:block">
      <div ref={dot} className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full bg-white mix-blend-difference pointer-events-none z-[120]" />
      <div
        ref={ring}
        className={`fixed top-0 left-0 rounded-full border border-white/70 mix-blend-difference pointer-events-none z-[119] transition-[width,height] duration-200 flex items-center justify-center ${hover ? "w-[72px] h-[72px]" : "w-[36px] h-[36px]"}`}
      >
        {hover && <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-white">{hover}</span>}
      </div>
    </div>
  );
}
