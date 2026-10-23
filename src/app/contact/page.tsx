import type { Metadata } from "next";
import { Suspense } from "react";
import { Container, Section } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { MaskedLines } from "@/components/MaskedLines";
import { QuoteForm } from "@/components/QuoteForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact | Vijay Enterprises",
  description:
    "Request a quote from Vijay Enterprises in Tughlakabad Village, New Delhi. Email your drawing, material, thickness, quantity and delivery location. Delhi NCR only.",
};

function ContactSection({ product }: { product?: string }) {
  return (
    <Section theme="light" className="py-[clamp(60px,8vw,120px)]">
      <Container>
        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <h2 className="font-display text-[clamp(1.75rem,3.2vw,3rem)] leading-none tracking-[-0.03em]">
              <MaskedLines lines={["Quote request"]} />
            </h2>
            <p className="mt-3 max-w-[52ch] text-sm text-steel-500">
              Fields marked by validation are required. Your email app will open with the details filled in.
            </p>
            <div className="mt-6">
              <QuoteForm defaultProduct={product} />
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-[var(--radius-card)] bg-ink p-6 text-white md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel-500">Workshop</p>
              <p className="mt-4 font-display text-2xl leading-tight">{site.address}</p>
              <a href={`mailto:${site.email}`} className="mt-3 inline-block text-sm text-steel-300 underline underline-offset-4 hover:text-white">
                {site.email}
              </a>
              <p className="mt-5 max-w-[38ch] text-sm text-steel-300">
                Email before visiting so someone is available to review the drawing. Quotes and delivery are within Delhi NCR only.
              </p>

              <div className="mt-6 overflow-hidden rounded-[22px] border border-white/10">
                <iframe
                  src={site.mapEmbed}
                  title="Vijay Enterprises location in Tughlakabad Village, New Delhi"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-[300px] w-full grayscale contrast-110"
                />
              </div>
              <a
                href={site.mapLink}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm text-steel-300 hover:text-white"
              >
                Open in Google Maps
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </a>

              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel-500">Drawings</p>
                <p className="mt-2 text-sm text-steel-300">
                  Email drawings to{" "}
                  <a href={`mailto:${site.email}`} className="underline underline-offset-4 hover:text-white">
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

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  return (
    <>
      <header data-nav-theme="dark" className="relative overflow-hidden bg-ink px-5 pb-12 pt-32 md:px-8 md:pb-16 md:pt-40">
        <span className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_70%_30%,rgba(255,74,28,0.08),transparent_60%)]" aria-hidden="true" />
        <Container className="relative px-0 md:px-0">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-6 max-w-[14ch] font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.04em]">
            Send the drawing. Get a quote.
          </h1>
          <p className="mt-5 max-w-[56ch] text-lg text-steel-300">
            No form backend, no cart. This form prepares an email to the workshop with the details you enter. Attach the drawing before you send it.
          </p>
        </Container>
      </header>

      <Suspense
        fallback={
          <Section theme="light" className="py-[clamp(60px,8vw,120px)]">
            <Container>
              <div className="h-[520px] animate-pulse rounded-[var(--radius-card)] bg-steel-200/50" />
            </Container>
          </Section>
        }
      >
        <ContactData searchParams={searchParams} />
      </Suspense>
    </>
  );
}
