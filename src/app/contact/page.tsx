import { Suspense } from "react";

import { site } from "@/lib/site";
import type { Metadata } from "next";

import { Eyebrow } from "@/components/Eyebrow";
import { GridLines } from "@/components/GridLines";
import { MaskedLines } from "@/components/MaskedLines";
import { QuoteForm } from "@/components/QuoteForm";
import { Container, Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Contact | Vijay Enterprises",
  description:
    "Request a quote from Vijay Enterprises in Okhla Phase 1, New Delhi. Email your drawing, material, thickness, quantity and delivery location. Delhi NCR only.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Vijay Enterprises",
    description:
      "Send your drawing and requirements for a sheet metal fabrication quote in Delhi NCR.",
    url: "/contact",
  },
};

function ContactSection({ product }: { product?: string }) {
  return (
    <Section theme="light" grid="split-7-5" className="py-[clamp(60px,8vw,120px)]">
      <Container>
        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <h2 className="font-display text-[clamp(1.75rem,3.2vw,3rem)] leading-none tracking-[-0.03em]">
              <MaskedLines lines={["Quote request"]} />
            </h2>
            <p className="text-steel-500 mt-3 max-w-[52ch] text-sm">
              Fields marked by validation are required. Your email app will open with the details
              filled in.
            </p>
            <div className="mt-6">
              <QuoteForm defaultProduct={product} />
            </div>
          </div>

          <div className="md:col-span-5">
            <div data-nav-theme="dark" className="border-line bg-ink border p-6 text-white md:p-8">
              <p className="text-steel-500 font-mono text-[10px] tracking-[0.14em] uppercase">
                Workshop
              </p>
              <p className="font-display mt-4 text-2xl leading-tight">{site.address}</p>
              <a
                href={`mailto:${site.email}`}
                className="text-steel-300 mt-3 inline-block text-sm underline underline-offset-4 hover:text-white"
              >
                {site.email}
              </a>
              <p className="text-steel-300 mt-5 max-w-[38ch] text-sm">
                Email before visiting so someone is available to review the drawing. Quotes and
                delivery are within Delhi NCR only.
              </p>

              <div className="mt-6 overflow-hidden border border-white/15">
                <iframe
                  src={site.mapEmbed}
                  title="Vijay Enterprises location in Okhla Phase 1, New Delhi"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-[300px] w-full contrast-110 grayscale"
                />
              </div>
              <a
                href={site.mapLink}
                target="_blank"
                rel="noreferrer"
                className="text-steel-300 mt-4 inline-flex items-center gap-2 text-sm hover:text-white"
              >
                Open in Google Maps
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </a>

              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="text-steel-500 font-mono text-[10px] tracking-[0.14em] uppercase">
                  Drawings
                </p>
                <p className="text-steel-300 mt-2 text-sm">
                  Email drawings to{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="underline underline-offset-4 hover:text-white"
                  >
                    {site.email}
                  </a>
                  . DXF, DWG, PDF, STEP, or a clear photo of a sketch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

async function ContactData({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product } = await searchParams;
  return <ContactSection product={product} />;
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  return (
    <>
      <header
        data-nav-theme="dark"
        className="border-line bg-ink relative overflow-hidden border-b pt-32 pb-12 md:pt-40 md:pb-16"
      >
        <span
          className="pointer-events-none absolute top-0 right-0 h-full w-1/2 bg-[radial-gradient(circle_at_70%_30%,rgba(255,74,28,0.08),transparent_60%)]"
          aria-hidden="true"
        />
        <GridLines theme="dark" onImage variant="hero" />
        <Container className="relative z-[2]">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="font-display mt-6 max-w-[14ch] text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.04em]">
            Send the drawing. Get a quote.
          </h1>
          <p className="text-steel-300 mt-5 max-w-[56ch] text-lg">
            No form backend, no cart. This form prepares an email to the workshop with the details
            you enter. Attach the drawing before you send it.
          </p>
        </Container>
      </header>

      <Suspense
        fallback={
          <Section theme="light" className="py-[clamp(60px,8vw,120px)]">
            <Container>
              <div className="border-line bg-steel-200/50 h-[520px] animate-pulse border" />
            </Container>
          </Section>
        }
      >
        <ContactData searchParams={searchParams} />
      </Suspense>
    </>
  );
}
