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
    <div className="border-line bg-line grid grid-cols-2 gap-px border md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col justify-between bg-white p-5 md:p-6">
          <div className="border-line flex h-12 items-baseline border-b pb-3 sm:h-14">
            <p className="font-display text-[clamp(1.4rem,2.1vw,2.65rem)] leading-none font-medium tracking-[-0.03em] whitespace-nowrap tabular-nums">
              {s.display ? s.display : <Counter value={s.value ?? 0} suffix={s.suffix} />}
            </p>
          </div>
          <div className="mt-4">
            <p className="text-ink text-sm font-medium">{s.label}</p>
            <p className="text-steel-500 mt-1 text-xs sm:text-sm">{s.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
