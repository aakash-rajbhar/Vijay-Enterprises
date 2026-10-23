import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Section, Container } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { ScrollWords } from "@/components/ScrollWords";
import { MaskedLines } from "@/components/MaskedLines";
import { StatRow } from "@/components/StatRow";
import { NumberedRow } from "@/components/NumberedRow";
import { GlassCard } from "@/components/GlassCard";
import { ProcessStrip } from "@/components/ProcessStrip";
import { ClosingCTA } from "@/components/ClosingCTA";
import { servicesList, machines } from "@/lib/services";
import { productCategories } from "@/lib/products";


const productImages: Record<string, string> = {
  "machine-parts": "/images/placeholder/placeholder-machine-parts.jpg",
  "covers-and-panels": "/images/placeholder/placeholder-covers-panels.jpg",
  hoppers: "/images/placeholder/placeholder-hoppers.jpg",
  ladders: "/images/placeholder/placeholder-ladders.jpg",
  "jali-designs": "/images/placeholder/placeholder-jali.jpg",
  "metal-frames": "/images/placeholder/placeholder-frames.jpg",
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
            className="mt-8 max-w-[24ch] font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.02] tracking-[-0.04em] text-balance"
            faded="so one supplier answers for the part."
          >
            We cut, bend, shear and weld under one roof,
          </ScrollWords>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link href="/about" className="group inline-flex items-center gap-3 text-sm">
              About the workshop
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
            </Link>
          </div>
        </Container>
      </Section>

      <Section theme="light" className="pb-[clamp(80px,12vw,180px)]">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <Eyebrow>The process</Eyebrow>
            <Link href="/services" className="hidden text-sm text-steel-500 hover:text-ink md:inline">
              View all services
            </Link>
          </div>
          <ProcessStrip />
        </Container>
      </Section>

      <Section theme="light" className="pb-[clamp(80px,12vw,180px)]">
        <Container>
          <Eyebrow>By the numbers</Eyebrow>
          <div className="mt-8">
            <StatRow
              stats={[
                { value: 30, suffix: "+", label: "Years in the metal industry", caption: "Founder-led experience" },
                { value: 25, suffix: " mm", label: "Laser cutting thickness", caption: "TL Series TL4020" },
                { display: "12 mm × 3 m", label: "Shearing capacity", caption: "NC “Genius” series" },
                { value: 5, label: "Processes under one roof", caption: "Cut, shear, bend, weld, fabricate" },
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
              <h2 className="mt-6 max-w-[16ch] font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["The work, in order."]} />
              </h2>
            </div>
            <Link href="/services" className="hidden text-sm text-steel-300 hover:text-white md:inline">
              All services
            </Link>
          </div>
          <div className="mt-10 border-t border-white/10">
            {servicesList.map((s) => (
              <NumberedRow key={s.number} number={s.number} title={s.title} description={s.description} spec={s.spec} href="/services" />
            ))}
          </div>
        </Container>
      </Section>

      <Section theme="light" className="py-[clamp(80px,12vw,180px)]">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <Eyebrow>Machines</Eyebrow>
              <h2 className="mt-6 max-w-[14ch] font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["Confirmed capacity."]} />
              </h2>
            </div>
            <Link href="/services#machines" className="hidden text-sm text-steel-500 hover:text-ink md:inline">
              Machine details
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {machines.map((m, i) => (
              <GlassCard key={m.name}>
                <div data-image-reveal className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-steel-900">
                  <Image
                    src={`/images/placeholder/placeholder-machine-${["tl4020", "hawk", "genius"][i]}.jpg`}
                    alt={`Placeholder machine image for ${m.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="image-drift object-cover grayscale contrast-110" data-cursor="view"
                  />
                </div>
                <div className={`mt-6 flex h-9 w-9 items-center justify-center rounded-full ${i === 0 ? "bg-spark text-white" : "bg-ink/5 text-ink"}`}>
                  <span className="font-mono text-[10px]">0{i + 1}</span>
                </div>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-steel-500">{m.role}</p>
                <h3 className="mt-2 font-display text-2xl leading-tight">{m.name}</h3>
                <p className="mt-2 text-sm text-steel-500">{m.desc}</p>
              </GlassCard>
            ))}
          </div>
        </Container>
      </Section>

      <Section theme="light" className="pb-[clamp(80px,12vw,180px)]">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <Eyebrow>Products</Eyebrow>
              <h2 className="mt-6 max-w-[14ch] font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["Parts and structures."]} />
              </h2>
            </div>
            <Link href="/products" className="hidden text-sm text-steel-500 hover:text-ink md:inline">
              All products
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productCategories.slice(0, 6).map((cat) => (
              <Link key={cat.slug} href="/products" className="group" data-cursor-row>
                <div data-image-reveal className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] border border-black/5 bg-steel-900">
                  <Image
                    src={productImages[cat.slug]}
                    alt={`Placeholder product image for ${cat.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="image-drift object-cover grayscale contrast-110" data-cursor="view"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-ink/20 text-white backdrop-blur-sm transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                    <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">Products</p>
                    <p className="mt-1 font-display text-2xl text-white">{cat.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section theme="mist" className="py-[clamp(80px,12vw,180px)]">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-16">
            <div className="md:col-span-5">
              <div data-image-reveal className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-window)] border border-black/5 bg-steel-900">
                <Image
                  src="/images/placeholder/placeholder-founder.jpg"
                  alt="Placeholder portrait slot for Vijay Rajbhar"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="image-drift object-cover grayscale contrast-110" data-cursor="view"
                />
                <span className="absolute bottom-4 left-4 rounded-pill bg-ink/60 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-white backdrop-blur-md">
                  Placeholder portrait
                </span>
              </div>
            </div>
            <div className="md:col-span-7">
              <Eyebrow>Founder</Eyebrow>
              <h2 className="mt-6 font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
                <MaskedLines lines={["Vijay Rajbhar"]} />
              </h2>
              <p className="mt-3 font-mono text-xs text-steel-500">30+ years in the metal industry</p>
              <p className="mt-6 max-w-[54ch] text-lg text-steel-500">
                Vijay Enterprises is a founder-led workshop in Tughlakabad Village, New Delhi. The work is organised around one roof, so a drawing can stay with one supplier from the first cut to the finished part.
              </p>
              <Link href="/about" className="group mt-8 inline-flex items-center gap-3 text-sm">
                Read about the workshop
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
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
