import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
};

export function PillButton({ href, children, variant = "primary", className = "" }: Props) {
  const base =
    "inline-flex h-[46px] items-center gap-3 px-6 font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-all";
  const styles =
    variant === "primary"
      ? "bg-spark-deep text-white hover:bg-spark-deep-hover group"
      : variant === "secondary"
        ? "bg-white text-ink"
        : "border border-white/60 text-white";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      <span>{children}</span>
      <span className="flex h-6 w-6 items-center justify-center border border-current/30 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </span>
    </Link>
  );
}
