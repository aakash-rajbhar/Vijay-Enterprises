import Link from "next/link";

type Props = {
  number: string;
  title: string;
  description: string;
  spec: string;
  href?: string;
};

export function NumberedRow({ number, title, description, spec, href }: Props) {
  const inner = (
    <>
      <span className="text-spark w-8 shrink-0 font-mono text-xs">{number}</span>
      <span className="font-display flex-1 text-[clamp(1.5rem,3vw,2.75rem)] leading-none transition-transform duration-300 group-hover:translate-x-2">
        {title}
      </span>
      <span className="text-steel-300 hidden max-w-[34ch] text-sm md:block">{description}</span>
      <span className="text-steel-500 hidden font-mono text-xs lg:block">{spec}</span>
    </>
  );

  const cls =
    "group flex items-center gap-4 border-b border-white/10 py-6 text-left md:gap-8 md:py-7";

  return href ? (
    <Link href={href} className={cls} data-cursor-row>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
