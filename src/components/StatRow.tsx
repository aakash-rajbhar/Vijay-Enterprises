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
    <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col justify-between bg-white p-5 md:p-6">
          <div className="flex h-12 items-baseline border-b border-line pb-3 sm:h-14">
            <p className="font-display text-[clamp(1.4rem,2.1vw,2.65rem)] font-medium leading-none tracking-[-0.03em] tabular-nums whitespace-nowrap">
              {s.display ? s.display : <Counter value={s.value ?? 0} suffix={s.suffix} />}
            </p>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-ink">{s.label}</p>
            <p className="mt-1 text-xs text-steel-500 sm:text-sm">{s.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
