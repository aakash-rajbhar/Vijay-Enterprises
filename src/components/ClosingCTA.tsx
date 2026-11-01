import Image from "next/image";

import { site } from "@/lib/site";

import { Grain } from "@/components/Grain";
import { GridLines } from "@/components/GridLines";
import { MagneticButton } from "@/components/MagneticButton";
import { MaskedLines } from "@/components/MaskedLines";

export function ClosingCTA() {
  return (
    <section data-nav-theme="dark" className="border-line relative overflow-hidden border-b">
      <Image
        src="/images/placeholder/placeholder-cta.jpg"
        alt="Sheet metal parts and fabrication"
        fill
        sizes="100vw"
        className="object-cover contrast-110 grayscale"
      />
      <div className="bg-ink/70 absolute inset-0" />
      <Grain />
      <GridLines theme="dark" onImage variant="closing-cta" />
      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-[1360px] flex-col justify-center px-5 py-24 md:px-8">
        <h2 className="font-display max-w-[15ch] text-[clamp(3.25rem,9vw,9rem)] leading-[0.9] tracking-[-0.04em]">
          <MaskedLines lines={["Send the drawing.", "We return the part."]} />
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <MagneticButton href="/contact">Request a quote</MagneticButton>
          <a
            href={`mailto:${site.email}`}
            className="text-steel-300 text-sm underline-offset-4 hover:text-white hover:underline"
          >
            {site.email}
          </a>
        </div>
      </div>
    </section>
  );
}
