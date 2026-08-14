"use client";

import { Search, X } from "lucide-react";
import type { DonationType } from "@/types";
import {
  DONATION_TYPE_LABELS,
  countActiveFilters,
  type CenterFilters,
} from "@/lib/centers";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const ALL = "toutes";

/**
 * Barre de filtres, dans l'ordre imposé par §17 :
 * localisation → type de don → disponibilité.
 *
 * Cet ordre n'est pas cosmétique : il suit la façon dont on cherche
 * réellement un centre — d'abord où, ensuite quoi, enfin quand.
 */
export function CenterFilters({
  filters,
  cities,
  onChange,
  onReset,
}: {
  filters: CenterFilters;
  cities: string[];
  onChange: (filters: CenterFilters) => void;
  onReset: () => void;
}) {
  const activeCount = countActiveFilters(filters);

  return (
    <div className="flex flex-col gap-6">
      {/* 1 — Localisation */}
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <label htmlFor="center-search" className="sr-only">
            Rechercher un centre par nom, ville ou code postal
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted"
          />
          <input
            id="center-search"
            type="search"
            value={filters.query}
            onChange={(event) =>
              onChange({ ...filters, query: event.target.value })
            }
            placeholder="Ville, code postal ou nom du centre"
            className={cn(
              "border-border-strong bg-background text-ink placeholder:text-muted",
              "w-full rounded-xl border py-3 pr-4 pl-12 hover:border-ink-secondary",
              "text-base transition-colors",
            )}
          />
        </div>

        <div>
          <label htmlFor="center-city" className="sr-only">
            Filtrer par ville
          </label>
          <select
            id="center-city"
            value={filters.city ?? ALL}
            onChange={(event) =>
              onChange({
                ...filters,
                city: event.target.value === ALL ? null : event.target.value,
              })
            }
            className={cn(
              "border-border-strong bg-background text-ink hover:border-ink-secondary",
              "w-full rounded-xl border px-4 py-3 text-base transition-colors sm:w-56",
            )}
          >
            <option value={ALL}>Toutes les villes</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2 — Type de don */}
      <RadioGroup
        legend="Type de don"
        options={[
          { value: ALL, label: "Tous" },
          ...(Object.keys(DONATION_TYPE_LABELS) as DonationType[]).map(
            (type) => ({ value: type, label: DONATION_TYPE_LABELS[type] }),
          ),
        ]}
        value={filters.donationType ?? ALL}
        onChange={(value) =>
          onChange({
            ...filters,
            donationType: value === ALL ? null : (value as DonationType),
          })
        }
      />

      {/* 3 — Disponibilité */}
      <div className="flex flex-wrap items-center gap-3">
        <label
          className={cn(
            "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium",
            "transition-colors",
            "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink",
            "has-[:focus-visible]:outline-offset-2",
            filters.openNow
              ? "border-primary bg-primary-soft text-primary"
              : "border-border-strong text-ink-secondary hover:border-ink-secondary hover:bg-surface",
          )}
        >
          <input
            type="checkbox"
            checked={filters.openNow}
            onChange={(event) =>
              onChange({ ...filters, openNow: event.target.checked })
            }
            className="sr-only"
          />
          Ouvert maintenant
        </label>

        {activeCount > 0 && (
          <Button variant="ghost" onClick={onReset} size="md">
            <X aria-hidden="true" className="size-4" />
            Réinitialiser
            <span className="sr-only"> les {activeCount} filtres actifs</span>
          </Button>
        )}
      </div>
    </div>
  );
}
