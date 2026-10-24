"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { processStages, type ProcessStage } from "@/lib/process";
import { ProcessIllustration3D } from "@/components/process/ProcessIllustration3D";
import { StageSnapshot } from "@/components/process/StageSnapshot";

gsap.registerPlugin(ScrollTrigger);

const stages: ProcessStage[] = processStages;

const STATIC_PARTICLES = [
  { x: 18, y: 15, size: 2.2, speed: 0.55, delay: 0.12 },
  { x: 42, y: 38, size: 1.8, speed: 0.72, delay: 0.45 },
  { x: 65, y: 18, size: 2.8, speed: 0.42, delay: 0.81 },
  { x: 88, y: 44, size: 1.4, speed: 0.88, delay: 0.29 },
  { x: 22, y: 68, size: 2.5, speed: 0.63, delay: 0.64 },
  { x: 46, y: 82, size: 1.6, speed: 0.38, delay: 0.17 },
  { x: 71, y: 62, size: 3.1, speed: 0.77, delay: 0.93 },
  { x: 91, y: 78, size: 1.9, speed: 0.49, delay: 0.52 },
  { x: 30, y: 25, size: 2.0, speed: 0.67, delay: 0.33 },
  { x: 54, y: 52, size: 1.5, speed: 0.83, delay: 0.74 },
  { x: 77, y: 32, size: 2.4, speed: 0.51, delay: 0.08 },
  { x: 15, y: 92, size: 2.7, speed: 0.59, delay: 0.86 },
];

/* ── Floating particles layer ─────────────────────────── */
function FloatingParticles({ progress }: { progress: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {STATIC_PARTICLES.map((p, i) => {
        const drift = ((progress * p.speed + p.delay) % 1) * 100;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-spark/20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              transform: `translate(${Math.sin(drift * 0.0628) * 20}px, ${-drift * 0.4}px)`,
              opacity: 0.15 + Math.sin(drift * 0.0314) * 0.15,
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Step content block (left side text) ─────────────── */
function StepContent({
  stage,
  isActive,
  direction,
}: {
  stage: ProcessStage;
  isActive: boolean;
  direction: "up" | "down" | "none";
}) {
  const translateY = isActive ? 0 : direction === "down" ? 40 : -40;
  const opacity = isActive ? 1 : 0;
  const blur = isActive ? 0 : 4;

  return (
    <div
      className="absolute inset-0 flex flex-col justify-center"
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
        filter: `blur(${blur}px)`,
        transition:
          "transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms cubic-bezier(0.22, 1, 0.36, 1), filter 500ms cubic-bezier(0.22, 1, 0.36, 1)",
        pointerEvents: isActive ? "auto" : "none",
      }}
    >
      <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-steel-500">
        <span className="h-1.5 w-1.5 bg-spark" />
        <span>The process</span>
      </div>

      <div className="mt-5 font-mono text-[clamp(4.5rem,8vw,7rem)] leading-[0.8] tracking-[-0.06em] text-white tabular-nums">
        {stage.number}
      </div>

      <h3 className="mt-6 font-display text-[clamp(2rem,3.4vw,3.25rem)] leading-[0.95] tracking-[-0.04em] text-white">
        {stage.label}
      </h3>
      <p className="mt-4 max-w-[36ch] text-base leading-relaxed text-steel-300">
        {stage.description}
      </p>
      {stage.fact && (
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-steel-500">
          {stage.fact}
        </p>
      )}
    </div>
  );
}

/* ── Horizontal scroll progress bar ─────────────────── */
function ScrollProgressBar({
  active,
  progress,
}: {
  active: number;
  progress: number;
}) {
  return (
    <div className="absolute bottom-8 left-8 right-8">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-steel-500">
        <span>Stage</span>
        <span>{stages[active].number} / 07</span>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {stages.map((s, i) => (
          <div
            key={s.number}
            className="relative h-[2px] overflow-hidden bg-white/10"
          >
            <div
              className="h-full origin-left bg-spark"
              style={{
                transform: `scaleX(${i < active ? 1 : i === active ? Math.min(1, (progress - i / stages.length) / (1 / stages.length)) : 0})`,
                transition: "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Stage transition indicator dots ────────────────── */
function StageIndicatorDots({
  active,
  total,
}: {
  active: number;
  total: number;
}) {
  return (
    <div className="absolute right-8 top-1/2 flex -translate-y-1/2 flex-col gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          className="group relative flex h-3 w-3 items-center justify-center"
          aria-label={`Stage ${i + 1}: ${stages[i].label}`}
          tabIndex={-1}
        >
          <span
            className="absolute h-full w-full rounded-full border transition-all duration-500"
            style={{
              borderColor:
                i === active
                  ? "var(--color-spark)"
                  : i < active
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(255,255,255,0.1)",
              transform: i === active ? "scale(1.4)" : "scale(1)",
            }}
          />
          <span
            className="h-1 w-1 rounded-full transition-all duration-500"
            style={{
              backgroundColor:
                i === active
                  ? "var(--color-spark)"
                  : i < active
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.15)",
            }}
          />
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ██ ProcessStrip — Immersive scroll-driven storytelling
   ══════════════════════════════════════════════════════ */
export function ProcessStrip() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  // Track direction for text animation
  const direction: "up" | "down" | "none" =
    active > prevActive ? "down" : active < prevActive ? "up" : "none";

  const handleActiveChange = useCallback((newActive: number) => {
    setActive((prev) => {
      if (prev !== newActive) {
        setPrevActive(prev);
      }
      return newActive;
    });
  }, []);

  useEffect(() => {
    if (!rootRef.current || !stickyRef.current || reduced) return;

    const mm = gsap.matchMedia(rootRef.current);

    mm.add(
      {
        desktop:
          "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        mobile:
          "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        if (context.conditions?.reduced) return;

        if (context.conditions?.desktop && stickyRef.current) {
          // The core scroll trigger — pinned for ~500vh of scrolling
          ScrollTrigger.create({
            trigger: rootRef.current!,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            onUpdate: (self) => {
              const p = self.progress;
              setProgress(p);
              const nextActive = Math.min(
                stages.length - 1,
                Math.floor(p * stages.length),
              );
              handleActiveChange(nextActive);
            },
          });

          ScrollTrigger.refresh();
        }

        if (context.conditions?.mobile && rootRef.current) {
          const cards = gsap.utils.toArray<HTMLElement>(
            "[data-stage-card]",
            rootRef.current,
          );
          gsap.set(cards, { opacity: 0, y: 26 });
          ScrollTrigger.batch(cards, {
            start: "top 88%",
            once: true,
            onEnter: (batch) => {
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: "power3.out",
                overwrite: true,
              });
            },
          });
        }
      },
    );

    const onFonts = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(onFonts).catch(() => {});
    window.addEventListener("load", onFonts);

    return () => {
      window.removeEventListener("load", onFonts);
      mm.revert();
    };
  }, [reduced, handleActiveChange]);

  const activeStage = stages[active];

  return (
    <div ref={rootRef} className="relative">
      {/* SR-only content */}
      <ol className="sr-only">
        {stages.map((s) => (
          <li key={s.id}>
            <h3>
              {s.number} {s.label}
            </h3>
            <p>{s.description}</p>
            {s.fact ? <p>{s.fact}</p> : null}
          </li>
        ))}
      </ol>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Stage {active + 1} of {stages.length}: {activeStage.label}.{" "}
        {activeStage.description}
        {activeStage.fact ? ` ${activeStage.fact}.` : "."}
      </div>

      {/* ═══ DESKTOP — Full-viewport immersive scroll ═══ */}
      <div className="motion-reduce:hidden">
        <div className="hidden lg:block">
          {/* Tall scroll container — the scroll "track" */}
          <div style={{ height: "500vh" }}>
            {/* Sticky viewport — stays fixed while user scrolls */}
            <div
              ref={stickyRef}
              className="sticky top-0 h-screen overflow-hidden"
            >
              {/* Background gradient that subtly shifts with progress */}
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse 70% 60% at ${48 + progress * 4}% ${45 + progress * 10}%, var(--color-steel-900) 0%, var(--color-ink) 100%)`,
                  transition: "background 0.2s linear",
                }}
              />

              {/* Floating particles */}
              <FloatingParticles progress={progress} />

              {/* Grain texture overlay */}
              <div className="grain-layer" />

              <div className="relative z-[2] mx-auto flex h-full max-w-[1360px] items-center px-5 md:px-8">
                {/* Left side: Text content */}
                <div className="relative h-[400px] w-[40%] pr-12">
                  {stages.map((s, i) => (
                    <StepContent
                      key={s.id}
                      stage={s}
                      isActive={i === active}
                      direction={
                        i === active ? direction : i < active ? "up" : "down"
                      }
                    />
                  ))}
                </div>

                {/* Right side: 3D Illustration viewport */}
                <div className="relative flex-1">
                  {/* The illustration card */}
                  <div
                    className="relative overflow-hidden rounded-[var(--radius-card)] border border-white/10"
                    style={{
                      aspectRatio: "16/10",
                      transform: `perspective(1200px) rotateY(${-1 + progress * 2}deg) rotateX(${0.5 - progress * 1}deg)`,
                      transition: "transform 0.1s linear",
                      boxShadow: `0 ${20 + progress * 10}px ${40 + progress * 20}px rgba(0,0,0,${0.3 + progress * 0.2}), inset 0 1px 0 rgba(255,255,255,0.05)`,
                    }}
                  >
                    <ProcessIllustration3D
                      progress={progress}
                      activeStage={active}
                    />

                    {/* Top-left meta label */}
                    <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-steel-500">
                      <span>Flat pattern</span>
                      <span className="h-1 w-1 rounded-full bg-steel-500" />
                      <span>Finished part</span>
                    </div>

                    {/* Bottom-right scroll hint */}
                    <div
                      className="absolute bottom-5 right-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-steel-500"
                      style={{
                        opacity:
                          progress < 0.05 ? 1 : Math.max(0, 1 - progress * 5),
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <div className="scroll-line h-4 w-[2px] rounded-full bg-white/10" />
                      <span>Scroll to advance</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage indicator dots on the right */}
              <StageIndicatorDots active={active} total={stages.length} />

              {/* Bottom progress bar */}
              <ScrollProgressBar active={active} progress={progress} />

              {/* Bottom-left CTA */}
              <div className="absolute bottom-8 left-8 z-[3]">
                <Link
                  href="/contact"
                  data-cursor-enquire
                  className="group inline-flex items-center gap-3 text-sm text-white"
                  style={{
                    opacity: progress > 0.85 ? 1 : 0.6,
                    transition: "opacity 0.5s ease",
                  }}
                >
                  Request a quote
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 9L9 1M9 1H1M9 1V9"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ MOBILE — Card-based fallback ═══ */}
        <div className="lg:hidden">
          <div className="mx-auto max-w-[1360px] px-5 md:px-8">
            <div className="border-t border-white/10">
              {stages.map((s, i) => (
                <article
                  key={s.id}
                  data-stage-card
                  className="grid gap-6 border-b border-white/10 py-9 sm:grid-cols-[1fr_1.15fr] sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-steel-500">
                      <span className="h-1.5 w-1.5 bg-spark" />
                      <span>{s.number} / 07</span>
                    </div>
                    <h3 className="mt-4 font-display text-[clamp(2rem,6vw,3rem)] leading-[0.95] tracking-[-0.04em] text-white">
                      {s.label}
                    </h3>
                    <p className="mt-4 max-w-[36ch] text-base leading-relaxed text-steel-300">
                      {s.description}
                    </p>
                    {s.fact ? (
                      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-steel-500">
                        {s.fact}
                      </p>
                    ) : null}
                  </div>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-graphite">
                    <div data-snapshot className="h-full w-full">
                      <StageSnapshot stage={i} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-10 flex items-center justify-center">
              <Link
                href="/contact"
                data-cursor-enquire
                className="group inline-flex items-center gap-3 rounded-pill border border-white/25 px-6 py-3 text-sm text-white"
              >
                Request a quote
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 9L9 1M9 1H1M9 1V9"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ REDUCED MOTION — Static layout ═══ */}
      <div className="hidden motion-reduce:block">
        <div className="mx-auto max-w-[1360px] px-5 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-graphite">
              <StageSnapshot stage={6} />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-steel-500">
                <span className="h-1.5 w-1.5 bg-spark" />
                <span>From sheet to part</span>
              </div>
              <h3 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.95] tracking-[-0.04em] text-white">
                Seven steps under one roof
              </h3>
              <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-steel-300">
                One roof in Tughlakabad, New Delhi. From drawing to finished
                part, each step stays with one supplier.
              </p>
              <ol className="mt-8 grid gap-5">
                {stages.map((s) => (
                  <li
                    key={s.id}
                    className="grid gap-2 border-t border-white/10 pt-5 sm:grid-cols-[4rem_1fr] sm:items-start"
                  >
                    <span className="font-mono text-sm text-steel-500">
                      {s.number}
                    </span>
                    <div>
                      <p className="font-display text-xl leading-tight text-white">
                        {s.label}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-steel-300">
                        {s.description}
                      </p>
                      {s.fact ? (
                        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-steel-500">
                          {s.fact}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8">
                <Link
                  href="/contact"
                  data-cursor-enquire
                  className="group inline-flex items-center gap-3 text-sm text-white"
                >
                  Request a quote
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 9L9 1M9 1H1M9 1V9"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
