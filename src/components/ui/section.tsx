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
        "relative overflow-hidden",
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
            onPrimary ? "text-background/80" : "text-primary",
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
