import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
};

export function PillButton({ href, children, variant = "primary", className = "" }: Props) {
  const base = "inline-flex items-center gap-3 rounded-pill px-6 py-3 text-sm transition-all";
  const styles =
    variant === "primary"
      ? "bg-spark-deep text-white hover:bg-spark-deep-hover group"
      : variant === "secondary"
        ? "bg-white text-ink"
        : "border border-white/60 text-white";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      <span>{children}</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/15 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </span>
    </Link>
  );
}
