import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { Section, Container } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { Proof } from "@/components/Proof";
import { MaskedLines } from "@/components/MaskedLines";
import { ClosingCTA } from "@/components/ClosingCTA";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About | Vijay Enterprises",
  description:
    "Vijay Enterprises is a founder-led metal fabrication workshop in Tughlakabad Village, New Delhi, led by Vijay Rajbhar with 30+ years in the metal industry.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Vijay Enterprises",
    description: "A founder-led metal fabrication workshop in Tughlakabad Village, New Delhi, with 30+ years of experience.",
    url: "/about",
  },
};

const principles = [
  {
    number: "01",
    title: "All processes under one roof",
    desc: "Cutting, shearing, bending, welding and fabrication stay with one team, so one supplier answers for the finished part.",
  },
  {
    number: "02",
    title: "Custom and production runs",
    desc: "One-off parts and repeat production work are both quoted from the drawing, not from a fixed catalogue.",
  },
  {
    number: "03",
    title: "Fast turnaround",
    desc: "Work moves through the process list without being sent to another shop. Ask for a turnaround estimate with your quote.",
  },
  {
    number: "04",
    title: "Competitive pricing",
    desc: "Quotes are based on the material, thickness, quantity and process the part actually needs. No online checkout.",
  },
];

const oneRoof = [
  "The drawing stays with one supplier from the first cut to the finished part.",
  "Fewer handoffs between shops means fewer chances for a spec to drift.",
  "If a limit is close, the same team reviews it before the quote is sent.",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        lines={["Thirty years of", "working with metal."]}
        lead="A founder-led fabrication workshop in Tughlakabad Village, New Delhi. Cutting, shearing, bending, welding and fabrication under one team, drawing-led from first cut to finished part."
        image="/images/placeholder/placeholder-hero.jpg"
        imageAlt="Sheet metal fabrication process at Vijay Enterprises"
      />

      <Section theme="light" className="py-[clamp(80px,10vw,150px)]">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-16">
            <div className="md:col-span-5">
              <div data-image-reveal className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-window)] border border-black/5 bg-steel-900">
                <Image
                  src="/images/placeholder/placeholder-founder.jpg"
                  alt="Portrait of Vijay Rajbhar, founder of Vijay Enterprises"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="image-drift object-cover grayscale contrast-110"
                />
              </div>
            </div>
            <div className="md:col-span-7">
              <Eyebrow>Founder</Eyebrow>
              <h2 className="mt-6 font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["Vijay Rajbhar"]} />
              </h2>
              <p className="mt-3 font-mono text-xs text-steel-500">30+ years in the metal industry</p>
              <p className="mt-6 max-w-[54ch] text-lg text-steel-500">
                Vijay Rajbhar leads Vijay Enterprises. He has spent more than 30 years in the metal industry, and the workshop is organised around the way he works: one roof, one team, and a drawing that stays with the people making the part.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section theme="dark" className="py-[clamp(80px,10vw,150px)]">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <Eyebrow>The workshop</Eyebrow>
              <h2 className="mt-6 font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["Tughlakabad Village."]} />
              </h2>
              <p className="mt-5 max-w-[42ch] text-steel-300">{site.address}</p>
              <p className="mt-4 max-w-[42ch] text-sm text-steel-500">
                Quotes and delivery are within Delhi NCR only. Email before visiting so someone is available to review the drawing.
              </p>
            </div>
            <div className="md:col-span-7">
              <p className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.1] tracking-[-0.02em]">
                What one roof means for a buyer.
              </p>
              <ul className="mt-7 border-t border-white/10">
                {oneRoof.map((item, i) => (
                  <li key={item} className="flex gap-5 border-b border-white/10 py-5">
                    <span className="font-mono text-xs text-spark">0{i + 1}</span>
                    <span className="text-steel-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section theme="light" className="py-[clamp(80px,10vw,150px)]">
        <Container>
          <Eyebrow>Principles</Eyebrow>
          <h2 className="mt-6 max-w-[18ch] font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
            <MaskedLines lines={["How the work", "is judged."]} />
          </h2>
          <div className="mt-10 border-t border-steel-200">
            {principles.map((p) => (
              <div key={p.number} className="grid gap-3 border-b border-steel-200 py-6 md:grid-cols-12 md:gap-8 md:py-8">
                <span className="font-mono text-xs text-spark-ink md:col-span-1">{p.number}</span>
                <h3 className="font-display text-2xl leading-none md:col-span-4">{p.title}</h3>
                <p className="max-w-[52ch] text-sm text-steel-500 md:col-span-7">{p.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Proof />

      <ClosingCTA />
    </>
  );
}
