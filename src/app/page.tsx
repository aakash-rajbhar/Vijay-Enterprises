import Image from "next/image";
import Link from "next/link";

import { machines } from "@/lib/machines";
import { processStages } from "@/lib/process";
import { servicesList } from "@/lib/services";
import type { Metadata } from "next";

import { ClosingCTA } from "@/components/ClosingCTA";
import { Eyebrow } from "@/components/Eyebrow";
import { GlassCard } from "@/components/GlassCard";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { MaskedLines } from "@/components/MaskedLines";
import { NumberedRow } from "@/components/NumberedRow";
import { ProcessScroll } from "@/components/ProcessScroll";
import { ProductGrid } from "@/components/ProductGrid";
import { ScrollWords } from "@/components/ScrollWords";
import { Container, Section } from "@/components/Section";
import { StatRow } from "@/components/StatRow";

export const metadata: Metadata = {
  title: "Vijay Enterprises | Sheet Metal Fabrication in Delhi NCR",
  description:
    "Laser cutting, shearing, bending, welding and fabrication under one roof in Delhi NCR. Email your drawing for a quote.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Vijay Enterprises | Sheet Metal Fabrication in Delhi NCR",
    description: "Precision sheet metal fabrication in Delhi NCR.",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />

      <Section theme="light" className="py-[clamp(80px,12vw,180px)]">
        <Container>
          <Eyebrow>Who we are</Eyebrow>
          <ScrollWords
            className="font-display mt-8 max-w-[24ch] text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.02] tracking-[-0.04em] text-balance"
            faded="so one supplier answers for the part."
          >
            We cut, bend, shear and weld under one roof,
          </ScrollWords>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link href="/about" className="group inline-flex items-center gap-3 text-sm">
              About the workshop
              <span className="border-ink/20 flex h-8 w-8 items-center justify-center border transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
            </Link>
          </div>
        </Container>
      </Section>

      <Section theme="dark" className="pt-[clamp(80px,12vw,180px)] pb-0">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>The process</Eyebrow>
              <h2 className="font-display mt-6 max-w-[18ch] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["From sheet to part."]} />
              </h2>
              <p className="text-steel-300 mt-5 max-w-[52ch] text-base leading-relaxed">
                Seven steps under one roof. Follow the sheet from layout to finished part.
              </p>
            </div>
            <Link
              href="/services"
              className="text-steel-300 hidden text-sm transition-colors hover:text-white md:inline"
            >
              View all services
            </Link>
          </div>
        </Container>
        <div className="mt-12 lg:mt-0">
          <ProcessScroll stages={processStages} />
        </div>
      </Section>

      <Section theme="light" className="py-[clamp(80px,12vw,180px)]">
        <Container>
          <Eyebrow>By the numbers</Eyebrow>
          <div className="mt-8">
            <StatRow
              stats={[
                {
                  value: 30,
                  suffix: "+",
                  label: "Years in the metal industry",
                  caption: "Founder-led experience",
                },
                {
                  value: 25,
                  suffix: " mm",
                  label: "Laser cutting capacity",
                  caption: "TL Series TL4020",
                },
                {
                  display: "12 mm × 3 m",
                  label: "Shearing capacity",
                  caption: "NC “Genius” series",
                },
                {
                  value: 5,
                  label: "Processes under one roof",
                  caption: "Cut · Shear · Bend · Weld · Fabricate",
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      <Section theme="dark" className="py-[clamp(80px,12vw,180px)]">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <Eyebrow>Services</Eyebrow>
              <h2 className="font-display mt-6 max-w-[16ch] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["The work, in order."]} />
              </h2>
            </div>
            <Link
              href="/services"
              className="text-steel-300 hidden text-sm hover:text-white md:inline"
            >
              All services
            </Link>
          </div>
          <div className="mt-10 border-t border-white/10">
            {servicesList.map((s) => (
              <NumberedRow
                key={s.number}
                number={s.number}
                title={s.title}
                description={s.description}
                spec={s.spec}
                href="/services"
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section theme="light" className="py-[clamp(80px,12vw,180px)]">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <Eyebrow>Machines</Eyebrow>
              <h2 className="font-display mt-6 max-w-[16ch] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["Machines and capacity."]} />
              </h2>
            </div>
            <Link
              href="/services#machines"
              className="text-steel-500 hover:text-ink hidden text-sm md:inline"
            >
              Machine details
            </Link>
          </div>
          <div className="border-line bg-line mt-10 grid gap-px border md:grid-cols-2 xl:grid-cols-4">
            {machines.map((m, i) => (
              <GlassCard key={m.name}>
                <div
                  data-image-reveal
                  className="bg-steel-900 relative aspect-[4/3] overflow-hidden"
                >
                  <Image
                    src={m.image}
                    alt={`${m.name} - sheet metal fabrication machine at Vijay Enterprises`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="image-drift object-cover contrast-110"
                    data-cursor="view"
                  />
                </div>
                <div
                  className={`mt-6 flex h-8 w-8 items-center justify-center ${i === 0 ? "bg-spark text-ink" : "border-ink/15 text-ink border"}`}
                >
                  <span className="font-mono text-[10px]">0{i + 1}</span>
                </div>
                <p className="text-steel-500 mt-4 font-mono text-[10px] tracking-[0.14em] uppercase">
                  {m.role}
                </p>
                <h3 className="font-display mt-2 text-2xl leading-tight">{m.name}</h3>
                <p className="text-steel-500 mt-2 text-sm">{m.desc}</p>
              </GlassCard>
            ))}
          </div>
        </Container>
      </Section>

      <Section theme="light" className="py-[clamp(80px,12vw,180px)]">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <Eyebrow>Products</Eyebrow>
              <h2 className="font-display mt-6 max-w-[14ch] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["Parts and structures."]} />
              </h2>
            </div>
            <Link
              href="/products"
              className="text-steel-500 hover:text-ink hidden text-sm md:inline"
            >
              All products
            </Link>
          </div>
          <div className="mt-10">
            <ProductGrid limit={6} />
          </div>
        </Container>
      </Section>

      <Section theme="mist" grid="split-5-7" className="py-[clamp(80px,12vw,180px)]">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-16">
            <div className="md:col-span-5">
              <div
                data-image-reveal
                className="border-line bg-steel-900 relative aspect-[4/5] overflow-hidden border"
              >
                <Image
                  src="/images/placeholder/placeholder-founder.jpg"
                  alt="Portrait of Vijay Rajbhar, founder of Vijay Enterprises"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="image-drift object-cover contrast-110 grayscale"
                  data-cursor="view"
                />
              </div>
            </div>
            <div className="md:col-span-7">
              <Eyebrow>Founder</Eyebrow>
              <h2 className="font-display mt-6 text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["Vijay Rajbhar"]} />
              </h2>
              <p className="text-steel-500 mt-3 font-mono text-xs">
                30+ years in the metal industry
              </p>
              <p className="text-steel-500 mt-6 max-w-[54ch] text-lg">
                Vijay Enterprises is a founder-led workshop in New Delhi. Cutting, shearing,
                bending, welding and fabrication stay with one team, so a drawing stays with one
                supplier from first cut to finished part.
              </p>
              <Link href="/about" className="group mt-8 inline-flex items-center gap-3 text-sm">
                Read about the workshop
                <span className="border-ink/20 flex h-8 w-8 items-center justify-center border transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <ClosingCTA />
    </>
  );
}
