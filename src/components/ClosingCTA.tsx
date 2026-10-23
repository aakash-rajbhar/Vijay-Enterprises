import Image from "next/image";
import { MagneticButton } from "@/components/MagneticButton";
import { site } from "@/lib/site";
import { Grain } from "@/components/Grain";
import { MaskedLines } from "@/components/MaskedLines";

export function ClosingCTA() {
  return (
    <section data-nav-theme="dark" className="relative overflow-hidden">
      <Image
        src="/images/placeholder/placeholder-cta.jpg"
        alt="Placeholder dark process imagery for closing section"
        fill
        sizes="100vw"
        className="object-cover grayscale contrast-110"
      />
      <div className="absolute inset-0 bg-ink/70" />
      <Grain />
      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-[1360px] flex-col justify-center px-5 py-24 md:px-8">
        <h2 className="max-w-[15ch] font-display text-[clamp(3.25rem,9vw,9rem)] leading-[0.9] tracking-[-0.04em]">
          <MaskedLines lines={["Send the drawing.", "We return the part."]} />
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <MagneticButton href="/contact">Request a quote</MagneticButton>
          <a href={`mailto:${site.email}`} className="text-sm text-steel-300 underline-offset-4 hover:text-white hover:underline">
            {site.email}
          </a>
        </div>
      </div>
    </section>
  );
}
