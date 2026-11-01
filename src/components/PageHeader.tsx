import Image from "next/image";

import { Eyebrow } from "@/components/Eyebrow";
import { Grain } from "@/components/Grain";
import { GridLines } from "@/components/GridLines";
import { MaskedLines } from "@/components/MaskedLines";

type Props = {
  eyebrow: string;
  lines: string[];
  lead: string;
  image: string;
  imageAlt: string;
};

export function PageHeader({ eyebrow, lines, lead, image, imageAlt }: Props) {
  return (
    <header
      data-nav-theme="dark"
      className="border-line relative flex min-h-[70vh] items-end overflow-hidden border-b pt-32 pb-10 md:pt-36 md:pb-14"
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover contrast-110 grayscale"
      />
      <div className="from-ink via-ink/60 to-ink/20 absolute inset-0 bg-gradient-to-t" />
      <Grain />
      <GridLines theme="dark" onImage variant="hero" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1360px] items-end justify-between gap-6 px-5 md:px-8">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="font-display mt-5 text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.04em] text-white">
            <MaskedLines lines={lines} scroll={false} />
          </h1>
          <p className="text-steel-300 mt-5 max-w-[58ch] text-lg">{lead}</p>
        </div>
        <span
          className="hidden h-11 w-11 shrink-0 items-center justify-center border border-white/50 md:flex"
          aria-hidden="true"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2V10M6 10L2 6M6 10L10 6" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </span>
      </div>
    </header>
  );
}
