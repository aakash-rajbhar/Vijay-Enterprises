"use client";

import { useEffect, useRef, useState } from "react";
import { useFinePointer } from "@/hooks/useFinePointer";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const textSelector =
  "p, h1, h2, h3, h4, h5, h6, li, label, input, textarea, select, option";
const interactiveSelector =
  "a, button, [role='button'], [data-cursor], [data-cursor-row]";
const sparkColors = ["#fff6d8", "#ffd166", "#ff9a2e", "#ff4a1c"];

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  width: number;
  color: string;
};

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(true);
  const reduced = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const enabled = finePointer && !reduced;

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    const ctx = canvas.current?.getContext("2d") ?? null;
    let x = 0;
    let y = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let running = false;
    const sparks: Spark[] = [];

    const setPosition = (clientX: number, clientY: number) => {
      x = clientX;
      y = clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    const move = (e: PointerEvent) => setPosition(e.clientX, e.clientY);
    window.addEventListener("pointermove", move, { passive: true });

    const over = (e: PointerEvent) => {
      setPosition(e.clientX, e.clientY);
      const target = e.target instanceof Element ? e.target : null;
      const isText = Boolean(target?.closest(textSelector));
      const isInteractive = Boolean(target?.closest(interactiveSelector));
      const showCustom = !isText && !isInteractive;
      setVisible(showCustom);
      root.classList.toggle("custom-cursor-active", showCustom);
    };
    window.addEventListener("pointerover", over, { passive: true });

    const leave = () => root.classList.remove("custom-cursor-active");
    window.addEventListener("pointerleave", leave);

    const resize = () => {
      if (!canvas.current || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.current.width = Math.floor(width * dpr);
      canvas.current.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (time: number) => {
      if (!ctx) return;
      const dt = last ? Math.min((time - last) / 1000, 0.05) : 0.016;
      last = time;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.vy += 820 * dt;
        p.vx *= 0.985;
        p.vy *= 0.985;
        const px = p.x;
        const py = p.y;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;

        if (p.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        const lifeRatio = p.life / p.maxLife;
        ctx.globalAlpha = lifeRatio * lifeRatio;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.width;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      if (sparks.length > 0) {
        raf = requestAnimationFrame(draw);
      } else {
        running = false;
        last = 0;
        ctx.clearRect(0, 0, width, height);
      }
    };

    const burst = (e: PointerEvent) => {
      if (!ctx || e.button !== 0) return;
      const amount = sparks.length > 120 ? 8 : 18;

      for (let i = 0; i < amount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 90 + Math.random() * 300;
        const life = 0.28 + Math.random() * 0.4;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 70,
          life,
          maxLife: life,
          width: 0.7 + Math.random() * 1.6,
          color: sparkColors[(Math.random() * sparkColors.length) | 0],
        });
      }

      if (sparks.length > 160) sparks.splice(0, sparks.length - 160);

      if (!running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(draw);
      }
    };
    window.addEventListener("pointerdown", burst, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", burst);
      root.classList.remove("custom-cursor-active");
      if (ctx) ctx.clearRect(0, 0, width, height);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120]">
      <canvas ref={canvas} className="h-full w-full" />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 will-change-transform [transform:translate3d(-100px,-100px,0)]"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 180ms ease" }}
      >
        <div className="relative h-5 w-5 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-spark/80" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-spark/80" />
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-white" />
        </div>
      </div>
    </div>
  );
}
