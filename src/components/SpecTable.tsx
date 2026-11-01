type Row = { process: string; machine: string; capacity: string };

export function SpecTable({ rows, id }: { rows: readonly Row[]; id?: string }) {
  return (
    <div id={id} className="border-line overflow-hidden border bg-white">
      <div className="border-steel-200 text-steel-500 hidden grid-cols-3 gap-4 border-b px-6 py-4 font-mono text-[10px] tracking-[0.12em] uppercase md:grid">
        <span>Process</span>
        <span>Machine</span>
        <span>Capacity</span>
      </div>
      {rows.map((r) => (
        <div
          key={r.process}
          className="border-steel-200 grid gap-1 border-b px-6 py-5 last:border-b-0 md:grid-cols-3 md:gap-4"
        >
          <span className="font-display text-lg">{r.process}</span>
          <span className="text-steel-500 font-mono text-sm">{r.machine}</span>
          <span className="font-mono text-sm">{r.capacity}</span>
        </div>
      ))}
    </div>
  );
}
