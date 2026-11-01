import Link from "next/link";

import type { Metadata } from "next";

import { Eyebrow } from "@/components/Eyebrow";
import { Grain } from "@/components/Grain";
import { GridLines } from "@/components/GridLines";
import { MagneticButton } from "@/components/MagneticButton";
import { MaskedLines } from "@/components/MaskedLines";

export const metadata: Metadata = {
  title: "404 | Vijay Enterprises",
  description: "Page not found. Return to Vijay Enterprises or send a drawing for a quote.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section
      data-nav-theme="dark"
      className="border-line bg-ink relative flex min-h-[100svh] items-center overflow-hidden border-b py-32"
    >
      <Grain />
      <GridLines theme="dark" onImage variant="hero" />
      <span
        aria-hidden="true"
        className="font-display pointer-events-none absolute top-1/2 -right-6 -translate-y-1/2 text-[clamp(12rem,34vw,30rem)] leading-none tracking-[-0.06em] text-white/[0.04] select-none"
      >
        404
      </span>
      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-5 md:px-8">
        <Eyebrow>404</Eyebrow>
        <h1 className="font-display mt-6 max-w-[10ch] text-[clamp(3.25rem,9vw,9rem)] leading-[0.9] tracking-[-0.04em]">
          <MaskedLines lines={["Off the drawing."]} scroll={false} />
        </h1>
        <p className="text-steel-300 mt-6 max-w-[48ch] text-lg">
          This page is not part of the drawing. Go back to the home page, or send the drawing and
          get a quote.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-5">
          <MagneticButton href="/">Back home</MagneticButton>
          <Link
            href="/contact"
            className="text-steel-300 text-sm underline underline-offset-4 hover:text-white"
          >
            Request a quote
          </Link>
        </div>
      </div>
    </section>
  );
}
