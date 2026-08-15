import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "surface" | "primary";

const TONES: Record<Tone, string> = {
  default: "bg-background text-ink",
  surface: "bg-surface text-ink",
  // `on-primary` bascule la couleur du focus visible (cf. globals.css) :
  // un contour ink serait illisible sur cette surface.
  primary: "bg-primary text-background on-primary",
};

interface SectionProps {
  id?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
}

/**
 * Enveloppe de section : porte le rythme vertical et le fond.
 *
 * Centraliser l'espacement ici évite la dérive classique où chaque section
 * invente son propre `py-` et où la page perd sa respiration.
 */
export function Section({
  id,
  tone = "default",
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      // scroll-mt compense le header collant lors des ancres de navigation.
      className={cn(
        "scroll-mt-20 py-20 sm:py-28",
        TONES[tone],
        // `clip` et non `hidden` : les deux découpent les formes décoratives
        // qui débordent, mais `hidden` crée un conteneur de défilement, ce
        // qui casse tout `position: sticky` en descendance — l'illustration
        // de la FAQ, notamment. `clip` ne crée pas de scrollport.
        "relative overflow-clip",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Largeur de lecture commune à toute la page. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  /** Surtitre court : situe la section sans faire concurrence au titre. */
  eyebrow?: string;
  title: string;
  lead?: string;
  tone?: Tone;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  tone = "default",
  className,
}: SectionHeaderProps) {
  const onPrimary = tone === "primary";

  return (
    <header className={cn("max-w-2xl", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-semibold tracking-[0.18em] uppercase",
            // Jamais sous 90 % d'opacité sur le fond primaire : le blanc à
            // 80 % n'y contraste qu'à 4.07:1, sous le seuil AA.
            onPrimary ? "text-background" : "text-primary",
          )}
        >
          {eyebrow}
        </p>
      )}

      <h2
        className={cn(
          "text-3xl font-bold text-balance sm:text-4xl",
          onPrimary ? "text-background" : "text-ink",
        )}
      >
        {title}
      </h2>

      {lead && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed text-pretty",
            onPrimary ? "text-background/90" : "text-ink-secondary",
          )}
        >
          {lead}
        </p>
      )}
    </header>
  );
}
