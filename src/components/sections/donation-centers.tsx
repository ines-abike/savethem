"use client";

import { useMemo, useState } from "react";
import { LoaderCircle, SearchX } from "lucide-react";
import type { DonationCenter } from "@/types";
import { DONATION_CENTERS } from "@/data/centers";
import { EMPTY_FILTERS, filterCenters, listCities } from "@/lib/centers";
import { useClientNow } from "@/hooks/use-client-now";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { CenterCard } from "./center-card";
import { CenterDetailDialog } from "./center-detail-dialog";
import { CenterFilters } from "./center-filters";

/**
 * Répertoire des centres (C6) — la fonctionnalité centrale du brief.
 *
 * Traitée comme une tâche et non comme un contenu à lire (§Principe 2) :
 * recherche, filtres, compteur, état vide avec une sortie, fiche détaillée.
 */
export function DonationCenters() {
  const now = useClientNow();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selected, setSelected] = useState<DonationCenter | null>(null);

  // Seule la saisie libre est retardée. Les filtres à puces s'appliquent
  // instantanément : y ajouter un délai serait une latence inventée.
  const [debouncedQuery, isTyping] = useDebouncedValue(filters.query);

  const cities = useMemo(() => listCities(DONATION_CENTERS), []);

  const results = useMemo(
    () =>
      filterCenters(
        DONATION_CENTERS,
        { ...filters, query: debouncedQuery },
        now,
      ),
    [filters, debouncedQuery, now],
  );

  const hasResults = results.length > 0;

  return (
    <Section id="ou-donner">
      <Container>
        <SectionHeader
          eyebrow="Où donner"
          title="Trouvez un centre près de chez vous"
          lead="Filtrez par ville, par type de don ou par disponibilité. Chaque fiche indique les horaires, le statut du moment et s'il faut prendre rendez-vous."
        />

        <div className="mt-10">
          <CenterFilters
            filters={filters}
            cities={cities}
            onChange={setFilters}
            onReset={() => setFilters(EMPTY_FILTERS)}
          />
        </div>

        {/*
          Compteur en région live : c'est le seul retour qu'un utilisateur de
          lecteur d'écran reçoit après avoir modifié un filtre.
        */}
        <div
          aria-live="polite"
          className="mt-8 flex items-center gap-2 border-b border-border pb-4 text-sm text-ink-secondary"
        >
          {isTyping ? (
            <>
              <LoaderCircle
                aria-hidden="true"
                className="size-4 animate-spin text-muted"
              />
              <span>Recherche en cours…</span>
            </>
          ) : (
            <span>
              <strong className="font-semibold text-ink">
                {results.length}
              </strong>{" "}
              {results.length > 1 ? "centres trouvés" : "centre trouvé"}
              {filters.openNow && now !== null && " et ouverts actuellement"}
            </span>
          )}
        </div>

        {hasResults ? (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((center) => (
              <CenterCard
                key={center.id}
                center={center}
                now={now}
                onOpenDetail={() => setSelected(center)}
              />
            ))}
          </ul>
        ) : (
          /*
            L'état vide est un écran à part entière, avec une issue : sans le
            bouton de réinitialisation, l'utilisateur reste bloqué face à une
            liste vide sans comprendre quel filtre l'a produite.
          */
          <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border px-6 py-16 text-center">
            <SearchX aria-hidden="true" className="size-8 text-muted" />

            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold text-ink">
                Aucun centre ne correspond à ces critères
              </p>
              <p className="mx-auto max-w-md text-sm text-pretty text-ink-secondary">
                Essayez d&apos;élargir la recherche : une autre ville, un autre
                type de don, ou sans la contrainte d&apos;ouverture immédiate.
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={() => setFilters(EMPTY_FILTERS)}
            >
              Voir tous les centres
            </Button>
          </div>
        )}

        <Callout tone="info" className="mt-8">
          Les {DONATION_CENTERS.length} établissements présentés ici sont{" "}
          <strong className="font-semibold text-ink">fictifs</strong> et servent
          à démontrer la recherche. Pour trouver un vrai point de collecte,
          consultez le site de l&apos;Établissement français du sang.
        </Callout>
      </Container>

      <CenterDetailDialog
        center={selected}
        now={now}
        onClose={() => setSelected(null)}
      />
    </Section>
  );
}
