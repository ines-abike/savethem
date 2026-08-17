import { IMPACT_HEADLINE, IMPACT_LEAD, IMPACT_STATS } from "@/data/impact";
import { Confluence } from "@/components/illustrations/shapes";
import { Container, Section } from "@/components/ui/section";

/**
 * Pourquoi donner (C1) — **la seule grande section rouge** de la page
 * (CLAUDE.md §30.3).
 *
 * Le rouge est ici parce que le propos est émotionnel, pas parce que le
 * sujet est le sang. Ailleurs, il reste cantonné aux actions : c'est la
 * rareté de cette surface qui lui donne son poids (§26.6, ~10 % de rouge).
 *
 * Le ton reste descriptif, jamais injonctif — §19 proscrit « vous devez
 * donner ».
 */
export function WhyDonate() {
  return (
    <Section id="pourquoi-donner" tone="primary">
      {/* La confluence traduit « plusieurs donneurs, un patient ». */}
      <Confluence className="absolute -top-6 right-0 hidden h-[420px] w-[560px] text-background/25 lg:block" />

      <Container className="relative">
        <div data-reveal className="max-w-2xl">
          {/*
            Aucune opacité sous 90 % sur cette surface : #C62828 ne contraste
            qu'à 5.62:1 avec le blanc pur, et le blanc à 80 % tombe déjà à
            4.07:1. La hiérarchie se fait donc à la taille et à la graisse,
            pas à la transparence.
          */}
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-background uppercase">
            Pourquoi donner
          </p>

          <h2 className="text-3xl font-bold text-balance text-background sm:text-4xl lg:text-5xl">
            {IMPACT_HEADLINE}
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-pretty text-background/90">
            {IMPACT_LEAD}
          </p>
        </div>

        {/* Cascade sur les trois chiffres : ils se lisent l'un après l'autre,
            le décalage rejoue cet ordre au lieu de les jeter d'un bloc. */}
        <ul
          data-reveal-group
          className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8"
        >
          {IMPACT_STATS.map((stat) => (
            <li key={stat.id} className="flex flex-col gap-2">
              <p className="text-4xl font-bold text-background lg:text-5xl">
                {stat.value}
              </p>
              <p className="text-base font-semibold text-balance text-background">
                {stat.label}
              </p>
              <p className="text-sm leading-relaxed text-pretty text-background/90">
                {stat.detail}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
