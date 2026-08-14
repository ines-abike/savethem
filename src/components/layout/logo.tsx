import { cn } from "@/lib/utils";

/**
 * Marque Savethem.
 *
 * Le symbole reprend la grammaire de la page : un arc de trajectoire qui se
 * termine par un point — le trajet et son destinataire. Pas de goutte, pas
 * de croix : §9 et §Direction visuelle les excluent.
 */
export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 32 32"
        className="size-7 shrink-0"
      >
        <path
          d="M3 24 C 9 24 10 8 19 8 C 24 8 26 12 29 11"
          fill="none"
          stroke={onDark ? "currentColor" : "var(--color-primary)"}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle
          cx="27"
          cy="22"
          r="3.5"
          fill={onDark ? "currentColor" : "var(--color-primary)"}
        />
      </svg>

      <span
        className={cn(
          "text-lg font-bold tracking-tight",
          onDark ? "text-background" : "text-ink",
        )}
      >
        Savethem
      </span>
    </span>
  );
}
