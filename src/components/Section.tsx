import { Grain } from "@/components/Grain";

export function Section({ children, className = "", theme = "dark" }: { children: React.ReactNode; className?: string; theme?: "dark" | "light" | "mist" }) {
  const bg = theme === "dark" ? "bg-ink text-white" : theme === "light" ? "bg-white text-ink" : "bg-mist text-ink";
  return (
    <section data-nav-theme={theme === "dark" ? "dark" : "light"} className={`relative ${bg} ${className}`}>
      {theme === "dark" && <Grain />}
      <div className="relative z-[2]">{children}</div>
    </section>
  );
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1360px] px-5 md:px-8 ${className}`}>{children}</div>;
}
