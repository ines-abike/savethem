import { cn } from "@/lib/utils";

type Status = "open" | "closed" | "unknown";

const STATUS: Record<Status, { label: string; dot: string; text: string }> = {
  open: { label: "Ouvert", dot: "bg-success", text: "text-success" },
  closed: { label: "Fermé", dot: "bg-muted", text: "text-muted" },
  // État affiché au premier rendu, avant que l'heure client soit connue
  // (§30.4). Nommé plutôt que masqué : un statut vide inquiète davantage.
  unknown: {
    label: "Horaires en cours de vérification",
    dot: "bg-border-strong",
    text: "text-muted",
  },
};

/**
 * Statut d'ouverture d'un centre.
 *
 * Le libellé texte est **toujours** rendu : §12 interdit de porter une
 * information par la seule couleur. La pastille colorée est un renfort, pas
 * le message.
 */
export function StatusIndicator({
  status,
  detail,
  className,
}: {
  status: Status;
  /** Complément : « Ouvre demain à 09h00 ». */
  detail?: string;
  className?: string;
}) {
  const config = STATUS[status];

  return (
    <span className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", config.dot)}
      />
      <span className={cn("font-semibold", config.text)}>{config.label}</span>
      {detail && <span className="text-muted">· {detail}</span>}
    </span>
  );
}
