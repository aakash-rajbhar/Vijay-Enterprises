import { Eyebrow } from "@/components/Eyebrow";
import { Container, Section } from "@/components/Section";

import { certifications, clients, testimonials } from "@/lib/proof";

export function Proof() {
  const hasProof = certifications.length > 0 || clients.length > 0 || testimonials.length > 0;
  if (!hasProof) return null;

  return (
    <Section theme="mist" className="py-[clamp(80px,10vw,150px)]">
      <Container>
        <Eyebrow>Proof</Eyebrow>
        <h2 className="font-display mt-6 text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
          On the record.
        </h2>
        <p className="text-steel-500 mt-5 max-w-[58ch]">
          This module stays empty until verified certifications, client names, or testimonials are
          supplied.
        </p>
      </Container>
    </Section>
  );
}
