import { FAQ_ENTRIES } from "@/data/faq";
import { Accordion } from "@/components/ui/accordion";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { FlowLines } from "@/components/illustrations/shapes";

/**
 * FAQ et idées reçues (C8).
 *
 * Le titre reprend la formulation recommandée par §8 — « vous vous posez
 * probablement ces questions » — parce qu'une FAQ qui ressemble à un
 * formulaire administratif n'est jamais ouverte.
 */
export function Faq() {
  return (
    <Section id="questions">
      <FlowLines className="absolute inset-x-0 bottom-0 h-56 w-full text-primary/10" />

      <Container className="relative">
        <SectionHeader
          eyebrow="Questions fréquentes"
          title="Vous vous posez probablement ces questions"
          lead="Les vraies interrogations des personnes qui n'ont jamais donné — y compris celles qu'on n'ose pas poser sur place."
        />

        <div className="mt-10 max-w-3xl">
          <Accordion
            items={FAQ_ENTRIES.map((entry) => ({
              id: entry.id,
              question: entry.question,
              answer: entry.answer,
            }))}
          />
        </div>
      </Container>
    </Section>
  );
}
