import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section, Container } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { MaskedLines } from "@/components/MaskedLines";
import { ProductGrid } from "@/components/ProductGrid";
import { ClosingCTA } from "@/components/ClosingCTA";
import { processChain } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products | Vijay Enterprises",
  description:
    "Machine parts, covers and panels, hoppers, ladders, tables, gates, jali designs and metal frames made to order in Delhi NCR.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        lines={["Parts and structures,", "made to order."]}
        lead="Machine parts, covers, hoppers, ladders, tables, gates, jali and frames. Every item starts with a drawing, material and quantity."
        image="/images/placeholder/placeholder-covers-panels.jpg"
        imageAlt="Placeholder dark sheet metal process imagery"
      />

      <Section theme="light" className="py-[clamp(80px,10vw,150px)]">
        <Container>
          <div id="categories" className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Categories</Eyebrow>
              <h2 className="mt-6 max-w-[16ch] font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["What we make."]} />
              </h2>
            </div>
            <p className="max-w-[38ch] text-sm text-steel-500">
              These are part families, not a catalogue. Open a category to see what it covers and how it is made.
            </p>
          </div>
          <div className="mt-10">
            <ProductGrid />
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-steel-500">
            All images are placeholders, not photographs of Vijay Enterprises work.
          </p>
        </Container>
      </Section>

      <Section theme="dark" className="py-[clamp(80px,10vw,150px)]">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-16">
            <div className="md:col-span-5">
              <Eyebrow>Made with</Eyebrow>
              <h2 className="mt-6 font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["One part,", "several processes."]} />
              </h2>
              <p className="mt-5 max-w-[42ch] text-steel-300">
                A single bracket can be cut, sheared, bent and welded before it leaves the building. That is what one roof means for a buyer.
              </p>
              <Link href="/services" className="group mt-8 inline-flex items-center gap-3 text-sm">
                See the process list
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </span>
              </Link>
            </div>
            <div className="md:col-span-7">
              <div className="border-t border-white/10">
                {processChain.map((p) => (
                  <Link
                    key={p.number}
                    href="/services"
                    className="group flex items-center gap-5 border-b border-white/10 py-5"
                  >
                    <span className="w-8 font-mono text-xs text-spark">{p.number}</span>
                    <span className="flex-1 font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-none transition-transform duration-300 group-hover:translate-x-2">
                      {p.label}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-white/50">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section theme="mist" className="py-[clamp(80px,10vw,150px)]">
        <Container>
          <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-16">
            <div className="md:col-span-8">
              <Eyebrow>Custom work</Eyebrow>
              <h2 className="mt-6 max-w-[16ch] font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["Not listed?", "Send the drawing."]} />
              </h2>
              <p className="mt-5 max-w-[52ch] text-steel-500">
                One-off parts and production runs are both welcome. If the part is not in the list, the drawing is still the starting point.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-pill bg-spark px-6 py-3 text-sm text-white transition-colors hover:bg-spark-deep"
              >
                Request a quote
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/15">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </span>
              </Link>
              <p className="mt-4 text-xs text-steel-500">
                Or email{" "}
                <a href={`mailto:${site.email}`} className="underline underline-offset-4 hover:text-ink">
                  {site.email}
                </a>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <ClosingCTA />
    </>
  );
}
