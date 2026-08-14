"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const CONTROL_BASE =
  "w-full rounded-xl border bg-background px-4 py-3 text-base text-ink " +
  "placeholder:text-muted transition-colors";

/**
 * Bordure de contrôle : `border-strong` et non `border`.
 *
 * `#E4E4E7` ne contraste qu'à 1.27:1 sur blanc, sous le seuil de 3:1 exigé
 * par WCAG 1.4.11 pour une bordure qui délimite un composant (cf. §26.2).
 */
const CONTROL_IDLE = "border-border-strong hover:border-ink-secondary";
const CONTROL_INVALID = "border-error bg-error-soft";

interface FieldProps {
  label: string;
  /** Aide affichée sous le label, avant toute saisie. */
  hint?: string;
  /** Message d'erreur ; sa présence bascule le champ en état invalide. */
  error?: string;
  children: (props: {
    id: string;
    "aria-describedby": string | undefined;
    "aria-invalid": boolean;
    className: string;
  }) => ReactNode;
  className?: string;
}

/**
 * Enveloppe de champ : label, aide, erreur, et le câblage ARIA qui va avec.
 *
 * Le câblage `aria-describedby` / `aria-invalid` est fait ici une fois pour
 * toutes, plutôt que réécrit à chaque champ — c'est précisément ce qu'on
 * oublie sur le troisième champ d'un formulaire.
 */
export function Field({ label, hint, error, children, className }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>

      {hint && (
        <p id={hintId} className="-mt-1 text-sm text-muted">
          {hint}
        </p>
      )}

      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": Boolean(error),
        className: cn(CONTROL_BASE, error ? CONTROL_INVALID : CONTROL_IDLE),
      })}

      {error && (
        <p id={errorId} className="text-sm font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}

/** Champ de saisie nu, à composer dans un `Field`. */
export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input className={cn(CONTROL_BASE, CONTROL_IDLE, className)} {...props} />
  );
}

export function Select({
  className,
  children,
  ...props
}: ComponentProps<"select">) {
  return (
    <select className={cn(CONTROL_BASE, CONTROL_IDLE, className)} {...props}>
      {children}
    </select>
  );
}
