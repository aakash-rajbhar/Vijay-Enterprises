type Row = { process: string; machine: string; capacity: string };

export function SpecTable({ rows, id }: { rows: Row[]; id?: string }) {
  return (
    <div id={id} className="overflow-hidden rounded-[var(--radius-card)] border border-black/5 bg-white">
      <div className="hidden grid-cols-3 gap-4 border-b border-steel-200 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-steel-500 md:grid">
        <span>Process</span>
        <span>Machine</span>
        <span>Capacity</span>
      </div>
      {rows.map((r) => (
        <div key={r.process} className="grid gap-1 border-b border-steel-200 px-6 py-5 last:border-b-0 md:grid-cols-3 md:gap-4">
          <span className="font-display text-lg">{r.process}</span>
          <span className="font-mono text-sm text-steel-500">{r.machine}</span>
          <span className="font-mono text-sm">{r.capacity}</span>
        </div>
      ))}
    </div>
  );
}
