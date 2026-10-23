"use client";

import { useRef } from "react";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
};

export function MagneticButton({ children, className = "", ...props }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  };

  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <a
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-flex items-center gap-3 rounded-pill bg-spark px-6 py-3 text-sm text-white transition-colors hover:bg-spark-deep group ${className}`}
      {...props}
    >
      <span>{children}</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/20 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </span>
    </a>
  );
}
