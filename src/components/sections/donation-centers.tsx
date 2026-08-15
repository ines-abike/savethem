"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, LoaderCircle, SearchX } from "lucide-react";
import type { DonationCenter } from "@/types";
import { DONATION_CENTERS } from "@/data/centers";
import {
  EMPTY_FILTERS,
  filterCenters,
  listCities,
  type CenterFilters as Filters,
} from "@/lib/centers";
import { useClientNow } from "@/hooks/use-client-now";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Button } from "@/components/ui/button";
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
/**
 * Nombre de centres visibles avant dépliage — une rangée pleine sur desktop.
 *
 * Douze fiches d'un bloc noient la barre de filtres, qui est pourtant l'outil
 * de la section : on montre de quoi juger, puis on laisse demander la suite.
 */
const INITIAL_VISIBLE = 3;

export function DonationCenters() {
  const now = useClientNow();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selected, setSelected] = useState<DonationCenter | null>(null);
  const [expanded, setExpanded] = useState(false);

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

  const canExpand = results.length > INITIAL_VISIBLE;
  const visible = expanded ? results : results.slice(0, INITIAL_VISIBLE);
  const hiddenCount = results.length - visible.length;

  /*
    Toute modification de filtre replie la liste. Sans ça, quelqu'un qui a
    déplié une fois voit les recherches suivantes s'ouvrir en pleine longueur
    sans l'avoir demandé — et le bouton disparaît de son champ de vision.
  */
  function handleFiltersChange(next: Filters) {
    setFilters(next);
    setExpanded(false);
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS);
    setExpanded(false);
  }

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
            onChange={handleFiltersChange}
            onReset={handleReset}
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
              {/*
                Annoncer « 12 trouvés » en n'en montrant que 3 serait faux
                pour qui ne voit pas la liste.
              */}
              {canExpand && !expanded && `, ${visible.length} affichés`}
            </span>
          )}
        </div>

        {hasResults ? (
          <>
            <ul
              id="liste-centres"
              className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visible.map((center) => (
                <CenterCard
                  key={center.id}
                  center={center}
                  now={now}
                  onOpenDetail={() => setSelected(center)}
                />
              ))}
            </ul>

            {/*
              Le bouton n'apparaît que s'il reste réellement quelque chose à
              voir : proposer « voir plus » devant une liste complète est une
              promesse vide.
            */}
            {canExpand && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="secondary"
                  aria-expanded={expanded}
                  aria-controls="liste-centres"
                  onClick={() => setExpanded((open) => !open)}
                >
                  {expanded ? (
                    <>
                      <ChevronUp aria-hidden="true" className="size-4" />
                      Afficher moins
                    </>
                  ) : (
                    <>
                      <ChevronDown aria-hidden="true" className="size-4" />
                      Voir les {hiddenCount} autres centres
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
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

            <Button variant="secondary" onClick={handleReset}>
              Voir tous les centres
            </Button>
          </div>
        )}
      </Container>

      <CenterDetailDialog
        center={selected}
        now={now}
        onClose={() => setSelected(null)}
      />
    </Section>
  );
}
