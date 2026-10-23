"use client";

import Link from "next/link";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = React.ComponentProps<typeof Link> & {
  children: React.ReactNode;
};

export function MagneticButton({ children, className = "", onMouseMove, onMouseLeave, ...props }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = usePrefersReducedMotion();

  const move = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onMouseMove?.(e);
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${Math.max(-10, Math.min(10, x * 0.25))}px, ${Math.max(-10, Math.min(10, y * 0.25))}px)`;
  };

  const leave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onMouseLeave?.(e);
    if (!ref.current) return;
    ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <Link
      ref={ref}
      data-cursor-enquire
      onMouseMove={move}
      onMouseLeave={leave}
      className={`group inline-flex items-center gap-3 rounded-pill bg-spark-deep px-6 py-3 text-sm text-white transition-[transform,background-color] duration-300 ease-out will-change-transform hover:bg-spark-deep-hover ${className}`}
      {...props}
    >
      <span>{children}</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/20 transition-transform duration-300 group-hover:rotate-45">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </span>
    </Link>
  );
}
