"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export interface RadioOption<T extends string> {
  value: T;
  label: string;
  /** Complément affiché sous le libellé, en option. */
  description?: string;
}

interface RadioGroupProps<T extends string> {
  legend: string;
  /** Masque visuellement la légende sans la retirer de l'arbre a11y. */
  hideLegend?: boolean;
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** `chips` pour les filtres, `cards` pour les choix du simulateur. */
  layout?: "chips" | "cards";
  className?: string;
}

/**
 * Groupe de choix exclusif, bâti sur des `<input type="radio">` natifs.
 *
 * Le natif n'est pas un repli faute de mieux : il apporte gratuitement la
 * navigation aux flèches, la sémantique de groupe et le comportement attendu
 * des lecteurs d'écran. Un groupe réimplémenté avec des `<div role>` aurait
 * demandé tout ce câblage à la main, pour un résultat plus fragile.
 */
export function RadioGroup<T extends string>({
  legend,
  hideLegend = false,
  options,
  value,
  onChange,
  layout = "chips",
  className,
}: RadioGroupProps<T>) {
  const name = useId();

  return (
    <fieldset className={cn("border-0 p-0", className)}>
      <legend
        className={cn(
          "text-sm font-semibold text-ink",
          hideLegend ? "sr-only" : "mb-3",
        )}
      >
        {legend}
      </legend>

      <div
        className={cn(
          layout === "chips"
            ? "flex flex-wrap gap-2"
            : "grid gap-3 sm:grid-cols-2",
        )}
      >
        {options.map((option) => {
          const checked = option.value === value;

          return (
            <label
              key={option.value}
              className={cn(
                "cursor-pointer transition-colors",
                // `has-[:focus-visible]` remonte le focus du radio masqué
                // jusqu'au label : sans ça, le focus clavier serait invisible.
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink",
                "has-[:focus-visible]:outline-offset-2",
                layout === "chips"
                  ? "rounded-full border px-4 py-2 text-sm font-medium"
                  : "flex flex-col gap-1 rounded-2xl border p-4 text-sm",
                checked
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border-strong text-ink-secondary hover:border-ink-secondary hover:bg-surface",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                className={cn(layout === "cards" && "font-semibold text-ink")}
              >
                {option.label}
              </span>
              {option.description && (
                <span className="text-muted">{option.description}</span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
