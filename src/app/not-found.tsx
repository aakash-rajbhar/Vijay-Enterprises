import type { Metadata } from "next";
import Link from "next/link";
import { MagneticButton } from "@/components/MagneticButton";
import { Eyebrow } from "@/components/Eyebrow";
import { Grain } from "@/components/Grain";
import { MaskedLines } from "@/components/MaskedLines";

export const metadata: Metadata = {
  title: "404 | Vijay Enterprises",
  description: "Page not found. Return to Vijay Enterprises or send a drawing for a quote.",
};

export default function NotFound() {
  return (
    <section data-nav-theme="dark" className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink px-5 py-32 md:px-8">
      <Grain />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-display text-[clamp(12rem,34vw,30rem)] leading-none tracking-[-0.06em] text-white/[0.04]"
      >
        404
      </span>
      <div className="relative z-10 mx-auto w-full max-w-[1360px]">
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-6 max-w-[10ch] font-display text-[clamp(3.25rem,9vw,9rem)] leading-[0.9] tracking-[-0.04em]">
          <MaskedLines lines={["Off the drawing."]} scroll={false} />
        </h1>
        <p className="mt-6 max-w-[48ch] text-lg text-steel-300">
          This page is not part of the drawing. Go back to the home page, or send the drawing and get a quote.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-5">
          <MagneticButton href="/">Back home</MagneticButton>
          <Link href="/contact" className="text-sm text-steel-300 underline underline-offset-4 hover:text-white">
            Request a quote
          </Link>
        </div>
      </div>
    </section>
  );
}
