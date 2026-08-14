import type { StockLevel } from "@/types";
import {
  BLOOD_STOCKS,
  STOCKS_CONTEXT,
  STOCKS_REASSURANCE,
  STOCKS_UPDATED_AT,
} from "@/data/blood-stocks";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/utils";

/**
 * État des réserves (C7).
 *
 * Volontairement **sur fond blanc** : la surface rouge est attribuée à
 * « Pourquoi donner » (§30.3). Traiter les réserves en rouge plein
 * basculerait vers le catastrophisme que l'insight 06 cherche à éviter.
 *
 * Le niveau est porté par un libellé texte autant que par la couleur (§12) :
 * une barre verte sans le mot « satisfaisant » serait illisible pour qui ne
 * distingue pas les couleurs.
 */

const LEVELS: Record<
  StockLevel,
  { label: string; bar: string; text: string; track: string }
> = {
  critique: {
    label: "Besoin urgent",
    bar: "bg-error",
    text: "text-error",
    track: "bg-error-soft",
  },
  faible: {
    label: "Besoin marqué",
    bar: "bg-warning",
    text: "text-warning",
    track: "bg-warning-soft",
  },
  satisfaisant: {
    label: "Réserve stable",
    bar: "bg-success",
    text: "text-success",
    track: "bg-success-soft",
  },
};

export function BloodReserve() {
  const updatedAt = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(STOCKS_UPDATED_AT));

  return (
    <Section id="reserves" tone="surface">
      <Container>
        <SectionHeader
          eyebrow="État des réserves"
          title="Chaque groupe compte, certains manquent"
          lead={STOCKS_CONTEXT}
        />

        {/*
          Grille et non tableau : à 390 px, un tableau à 4 colonnes déborde
          ou devient illisible (§18).
        */}
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BLOOD_STOCKS.map((stock) => {
            const level = LEVELS[stock.level];

            return (
              <li
                key={stock.group}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-5"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-2xl font-bold text-ink">{stock.group}</p>
                  <p className={cn("text-xs font-semibold", level.text)}>
                    {level.label}
                  </p>
                </div>

                <div
                  className={cn("h-2 w-full rounded-full", level.track)}
                  role="img"
                  aria-label={`Groupe ${stock.group} : réserve à ${stock.fillRate} %, ${level.label.toLowerCase()}`}
                >
                  <div
                    className={cn("h-full rounded-full", level.bar)}
                    style={{ width: `${stock.fillRate}%` }}
                  />
                </div>

                <p className="text-xs text-muted">
                  Réserve à {stock.fillRate} %
                </p>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <p className="max-w-2xl text-sm leading-relaxed text-pretty text-ink-secondary">
            {STOCKS_REASSURANCE}
          </p>

          <ButtonLink href="#ou-donner" className="shrink-0">
            Trouver un centre
          </ButtonLink>
        </div>

        <p className="mt-8 text-xs leading-relaxed text-muted">
          Données d&apos;illustration figées au {updatedAt}, créées pour ce
          site. Elles ne reflètent pas l&apos;état réel des stocks.
        </p>
      </Container>
    </Section>
  );
}
