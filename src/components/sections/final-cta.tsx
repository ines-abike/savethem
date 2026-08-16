import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";

/**
 * Étape suivante (§27.9).
 *
 * La question posée par §20 — « est-ce que l'utilisateur sait quoi faire
 * ensuite ? » — doit trouver sa réponse ici. Deux sorties selon là où en est
 * le visiteur, et pas une exhortation de plus.
 */
export function FinalCta() {
  return (
    <Section tone="surface">
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-balance text-ink sm:text-4xl">
            Il ne reste qu&apos;une chose à faire : y aller.
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-pretty text-ink-secondary">
            Vous savez maintenant si vous pouvez donner, comment ça se passe et
            combien de temps ça prend. Le reste tient en une adresse et une
            heure.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="#ou-donner" size="lg">
              Trouver un centre
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>

            <ButtonLink href="#puis-je-donner" variant="secondary" size="lg">
              Refaire le test
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
