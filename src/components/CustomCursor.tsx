"use client";

import { useEffect, useRef } from "react";
import { useFinePointer } from "@/hooks/useFinePointer";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

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
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const enabled = finePointer && !reduced;

  useEffect(() => {
    if (!enabled) return;

    const ctx = canvas.current?.getContext("2d") ?? null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let running = false;
    const sparks: Spark[] = [];

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
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", burst);
      if (ctx) ctx.clearRect(0, 0, width, height);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
    >
      <canvas ref={canvas} className="h-full w-full" />
    </div>
  );
}
