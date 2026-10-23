"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  src: string;
  alt: string;
  aspect?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  caption?: string;
  children?: React.ReactNode;
};

export function ImageWindow({
  src,
  alt,
  aspect = "16 / 9",
  className = "",
  imageClassName = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 80vw",
  caption,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const el = ref.current;
    const img = el.querySelector("img");
    gsap.fromTo(
      el,
      { clipPath: "inset(12% 12% 12% 12% round 32px)" },
      {
        clipPath: "inset(0% 0% 0% 0% round 40px)",
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      }
    );
    if (img) {
      gsap.fromTo(
        img,
        { scale: 1.2 },
        {
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        }
      );
    }
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [reduced]);

  return (
    <figure className={className}>
      <div
        ref={ref}
        className="group relative overflow-hidden border border-white/10 bg-steel-900"
        style={{ aspectRatio: aspect, borderRadius: "var(--radius-window)" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover grayscale contrast-110 transition-transform duration-700 group-hover:scale-[1.03] ${imageClassName}`}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_35%,rgba(0,0,0,0.45)_100%)]" />
        {children}
      </div>
      {caption && <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-steel-500">{caption}</figcaption>}
    </figure>
  );
}
