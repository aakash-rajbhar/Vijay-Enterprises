import Image from "next/image";
import { Eyebrow } from "@/components/Eyebrow";
import { MaskedLines } from "@/components/MaskedLines";
import { Grain } from "@/components/Grain";
import { GridLines } from "@/components/GridLines";

type Props = {
  eyebrow: string;
  lines: string[];
  lead: string;
  image: string;
  imageAlt: string;
};

export function PageHeader({ eyebrow, lines, lead, image, imageAlt }: Props) {
  return (
    <header data-nav-theme="dark" className="relative flex min-h-[70vh] items-end overflow-hidden border-b border-line pb-10 pt-32 md:pb-14 md:pt-36">
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover grayscale contrast-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
      <Grain />
      <GridLines theme="dark" onImage variant="hero" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1360px] items-end justify-between gap-6 px-5 md:px-8">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.04em] text-white">
            <MaskedLines lines={lines} scroll={false} />
          </h1>
          <p className="mt-5 max-w-[58ch] text-lg text-steel-300">{lead}</p>
        </div>
        <span className="hidden h-11 w-11 shrink-0 items-center justify-center border border-white/50 md:flex" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2V10M6 10L2 6M6 10L10 6" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </span>
      </div>
    </header>
  );
}
