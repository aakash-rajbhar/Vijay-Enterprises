import Link from "next/link";

import type { Metadata } from "next";

import { ClosingCTA } from "@/components/ClosingCTA";
import { Eyebrow } from "@/components/Eyebrow";
import { MachineStack } from "@/components/MachineStack";
import { MaskedLines } from "@/components/MaskedLines";
import { PageHeader } from "@/components/PageHeader";
import { Container, Section } from "@/components/Section";
import { ServiceAccordion } from "@/components/ServiceAccordion";
import { SpecTable } from "@/components/SpecTable";

import { machines } from "@/lib/machines";
import { capacityTable, processChain, servicesList } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services | Vijay Enterprises",
  description:
    "Laser cutting up to 25 mm, shearing 12 mm × 3 m, CNC press-brake bending, welding, fabrication, machine parts and product design in Delhi NCR.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Vijay Enterprises",
    description: "Laser cutting up to 25 mm, shearing 12 mm × 3 m and CNC bending in Delhi NCR.",
    url: "/services",
  },
};

const orderSteps = [
  {
    number: "01",
    title: "Send the drawing or spec",
    desc: "A DXF, DWG, PDF, STEP, sketch, or sample with material, thickness, and quantity.",
  },
  {
    number: "02",
    title: "Get a quote",
    desc: "We review the process and reply with the price. Ask us for a turnaround estimate with your quote.",
  },
  {
    number: "03",
    title: "We make it",
    desc: "Cut, shear, bend, weld, and fabricate under one roof with one point of accountability.",
  },
  {
    number: "04",
    title: "Delivery in Delhi NCR",
    desc: "Collection or delivery is arranged within Delhi NCR. No pan-India or export work.",
  },
];

const required = [
  "Drawing or sketch, with bend lines and tolerances where relevant",
  "Material and thickness",
  "Quantity",
  "Delivery location in Delhi NCR",
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        lines={["Five processes."]}
        lead="One accountable supplier for cutting, shearing, bending, welding and fabrication. Confirmed machine limits, quoted from your drawing."
        image="/images/placeholder/placeholder-hero.jpg"
        imageAlt="Sheet metal cutting and fabrication at Vijay Enterprises"
      />

      <Section theme="light" className="py-[clamp(80px,10vw,150px)]">
        <Container>
          <Eyebrow>The chain</Eyebrow>
          <h2 className="font-display mt-6 max-w-[18ch] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
            <MaskedLines lines={["The part does not", "leave the building."]} />
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-3 md:flex md:items-center">
            {processChain.map((p, i) => (
              <div key={p.number} className="contents">
                <div className="border-line flex items-center gap-3 border bg-white px-4 py-3 md:shrink-0">
                  <span className="text-spark-ink font-mono text-[10px]">{p.number}</span>
                  <span className="text-sm">{p.label}</span>
                </div>
                {i < processChain.length - 1 && (
                  <span
                    className="bg-steel-200 relative hidden h-px flex-1 md:block"
                    aria-hidden="true"
                  >
                    <span className="border-steel-300 absolute top-1/2 -right-1 h-2 w-2 -translate-y-1/2 rotate-45 border-t border-r" />
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="text-steel-500 mt-6 max-w-[58ch] text-sm">
            A drawing moves through the process list without being sent to another shop. If a limit
            is close, ask before you commit.
          </p>
        </Container>
      </Section>

      <Section theme="dark" className="py-[clamp(80px,10vw,150px)]">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <Eyebrow>Services</Eyebrow>
              <h2 className="font-display mt-6 max-w-[16ch] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["The process list."]} />
              </h2>
            </div>
            <span className="text-steel-500 hidden font-mono text-xs md:block">07 PROCESSES</span>
          </div>
          <div className="mt-10">
            <ServiceAccordion items={servicesList} />
          </div>
        </Container>
      </Section>

      <Section theme="light" grid="split-4-8" className="py-[clamp(80px,10vw,150px)]">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <Eyebrow>Capacity</Eyebrow>
              <h2 className="font-display mt-6 text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["Confirmed limits."]} />
              </h2>
              <p className="text-steel-500 mt-5 max-w-[42ch] text-sm">
                Only the figures the workshop has confirmed. Anything outside this table is a
                drawing review, not a promise.
              </p>
            </div>
            <div className="md:col-span-8">
              <SpecTable rows={capacityTable} id="capacity" />
            </div>
          </div>
        </Container>
      </Section>

      <Section theme="dark" className="py-[clamp(80px,10vw,150px)]">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <div id="machines">
                <Eyebrow>Machines</Eyebrow>
              </div>
              <h2 className="font-display mt-6 max-w-[16ch] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["What does the work."]} />
              </h2>
            </div>
            <span className="text-steel-500 hidden font-mono text-xs md:block">
              {String(machines.length).padStart(2, "0")} MACHINES
            </span>
          </div>
          <MachineStack />
        </Container>
      </Section>

      <Section theme="light" className="py-[clamp(80px,10vw,150px)]">
        <Container>
          <Eyebrow>How an order works</Eyebrow>
          <h2 className="font-display mt-6 max-w-[20ch] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
            <MaskedLines lines={["From drawing", "to delivery."]} />
          </h2>
          <div className="border-line bg-line mt-10 grid gap-px border sm:grid-cols-2 lg:grid-cols-4">
            {orderSteps.map((s) => (
              <div key={s.number} className="bg-white py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
                <span className="text-spark-ink font-mono text-xs">{s.number}</span>
                <h3 className="font-display mt-3 text-2xl leading-none">{s.title}</h3>
                <p className="text-steel-500 mt-3 max-w-[32ch] text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section theme="mist" className="py-[clamp(80px,10vw,150px)]">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <Eyebrow>What we need</Eyebrow>
              <h2 className="font-display mt-6 text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["Send enough", "to quote."]} />
              </h2>
            </div>
            <div className="md:col-span-8">
              <ul className="border-steel-200 border-t">
                {required.map((item) => (
                  <li key={item} className="border-steel-200 flex items-start gap-3 border-b py-4">
                    <span className="bg-spark mt-2 h-1.5 w-1.5 shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-steel-500 mt-6 max-w-[58ch] text-sm">
                Work is quoted and delivered within Delhi NCR only. No phone number is published;
                email{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-ink underline underline-offset-4"
                >
                  {site.email}
                </a>
                .
              </p>
              <Link
                href="/contact"
                className="bg-spark-deep hover:bg-spark hover:text-ink mt-7 inline-flex h-[46px] items-center gap-3 px-5 font-mono text-[11px] font-medium tracking-[0.14em] text-white uppercase transition-colors"
              >
                Request a quote
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <ClosingCTA />
    </>
  );
}
