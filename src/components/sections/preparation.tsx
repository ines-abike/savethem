import type { PreparationPhase } from "@/types";
import { PREPARATION_TIPS } from "@/data/preparation";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { Callout } from "@/components/ui/callout";
import { TrajectoryDot } from "@/components/illustrations/shapes";

const PHASES: { key: PreparationPhase; label: string; caption: string }[] = [
  {
    key: "avant",
    label: "Avant",
    caption: "Ce qui se prépare à la maison",
  },
  {
    key: "pendant",
    label: "Pendant",
    caption: "Ce qui se passe sur place",
  },
  {
    key: "apres",
    label: "Après",
    caption: "Les heures qui suivent",
  },
];

/**
 * Préparation au don (C5).
 *
 * Règle de ton non négociable (§28) : rassurer sans nier. La dernière carte
 * nomme explicitement les réactions possibles et la conduite à tenir — c'est
 * ce qui rassure réellement, pas le silence sur le sujet.
 */
export function Preparation() {
  return (
    <Section id="preparation">
      <Container>
        <SectionHeader
          eyebrow="Se préparer"
          title="Avant, pendant, après"
          lead="Rien de compliqué : une pièce d'identité, un repas, de l'eau. Le reste tient à savoir ce qui vous attend."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-8">
          {PHASES.map((phase) => {
            const tips = PREPARATION_TIPS.filter(
              (tip) => tip.phase === phase.key,
            );

            return (
              <section key={phase.key} className="flex flex-col gap-6">
                <header className="flex flex-col gap-1 border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <TrajectoryDot
                      filled
                      className="size-3 shrink-0 text-primary"
                    />
                    <h3 className="text-lg font-bold text-ink">
                      {phase.label}
                    </h3>
                  </div>
                  <p className="text-sm text-muted">{phase.caption}</p>
                </header>

                <ul className="flex flex-col gap-5">
                  {tips.map((tip) => (
                    <li key={tip.id} className="flex flex-col gap-1.5">
                      <h4 className="text-sm font-semibold text-balance text-ink">
                        {tip.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-pretty text-ink-secondary">
                        {tip.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <Callout
          tone="warning"
          className="mt-12"
          title="Et si ça se passe mal ?"
        >
          Personne ne vous promettra qu&apos;il ne se passera rien. Un
          étourdissement ou une fatigue passagère arrivent, et l&apos;équipe
          sait exactement quoi faire — c&apos;est pour cette raison que vous
          restez sur place après le don plutôt que de repartir aussitôt.
        </Callout>
      </Container>
    </Section>
  );
}
