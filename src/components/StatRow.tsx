import { Counter } from "@/components/Counter";

type Stat = {
  display?: string;
  value?: number;
  suffix?: string;
  label: string;
  caption: string;
};

export function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label}>
          <p className="border-b border-dashed border-steel-200 pb-4 font-display text-[clamp(2rem,3.2vw,3rem)] leading-none tracking-[-0.03em] tabular-nums">
            {s.display ? s.display : <Counter value={s.value ?? 0} suffix={s.suffix} />}
          </p>
          <p className="mt-3 text-sm">{s.label}</p>
          <p className="mt-1 text-sm text-steel-500">{s.caption}</p>
        </div>
      ))}
    </div>
  );
}
