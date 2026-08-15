import Image from "next/image";
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

        {/*
          Deux colonnes plutôt qu'un accordéon isolé : le flanc droit était
          vide en `lg`. L'illustration y est `sticky`, donc elle reste en vue
          pendant qu'on déplie les questions — le conteneur s'étire sur la
          hauteur de la ligne (`items-stretch` par défaut), sans quoi rien
          n'accrocherait.

          Masquée sous `lg` : sur mobile elle repousserait les questions,
          qui sont l'élément utile de la section.
        */}
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
          <Accordion
            items={FAQ_ENTRIES.map((entry) => ({
              id: entry.id,
              question: entry.question,
              answer: entry.answer,
            }))}
          />

          <div className="hidden lg:block">
            <Image
              src="/illustrations/questions-pana.svg"
              alt=""
              width={500}
              height={500}
              className="sticky top-28 h-auto w-full"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
