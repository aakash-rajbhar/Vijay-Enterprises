export function GlassCard({ children, className = "", dark = false }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <div
      className={`p-6 md:p-8 ${
        dark ? "border border-line bg-graphite" : "bg-white"
      } ${className}`}
    >
      {children}
    </div>
  );
}
