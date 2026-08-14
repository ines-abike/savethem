import { cn } from "@/lib/utils";

/**
 * Indicateur de progression du simulateur (§16).
 *
 * L'étape courante est annoncée en texte (« Étape 2 sur 3 ») en plus des
 * segments colorés : la progression ne repose donc pas sur la seule couleur,
 * conformément à §12.
 */
export function Stepper({
  current,
  total,
  className,
}: {
  /** Index 1-based de l'étape en cours. */
  current: number;
  total: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-sm font-medium text-muted">
        Étape {current} sur {total}
      </p>

      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={`Étape ${current} sur ${total}`}
      >
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-300",
              index < current ? "bg-primary" : "bg-border",
            )}
          />
        ))}
      </div>
    </div>
  );
}
