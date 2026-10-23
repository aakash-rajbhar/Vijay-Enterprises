export function GlassCard({ children, className = "", dark = false }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border p-6 backdrop-blur-md md:p-8 ${
        dark ? "border-white/10 bg-graphite" : "border-black/5 bg-white/70"
      } ${className}`}
    >
      {children}
    </div>
  );
}
