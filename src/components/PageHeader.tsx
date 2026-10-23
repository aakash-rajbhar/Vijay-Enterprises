import Image from "next/image";
import { Eyebrow } from "@/components/Eyebrow";
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
    <header data-nav-theme="dark" className="relative flex min-h-[70vh] items-end overflow-hidden px-4 pb-10 pt-28 md:px-8 md:pb-14">
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover grayscale contrast-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
      <div className="relative mx-auto w-full max-w-[1360px]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.04em] text-white">
          <MaskedLines lines={lines} />
        </h1>
        <p className="mt-5 max-w-[58ch] text-lg text-steel-300">{lead}</p>
      </div>
      <span className="absolute bottom-10 right-4 hidden h-11 w-11 items-center justify-center rounded-full border border-white/50 md:right-8 md:flex" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 2V10M6 10L2 6M6 10L10 6" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </span>
    </header>
  );
}
