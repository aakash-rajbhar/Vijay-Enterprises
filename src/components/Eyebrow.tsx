export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="bg-spark h-2 w-2" aria-hidden="true" />
      <span className="text-[0.8125rem]">{children}</span>
    </div>
  );
}
