import type { ReactNode } from "react";
import { Info, ShieldCheck, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "info" | "medical" | "warning";

const TONES: Record<
  Tone,
  { wrapper: string; icon: string; Icon: typeof Info }
> = {
  info: {
    wrapper: "bg-surface border-border text-ink-secondary",
    icon: "text-info",
    Icon: Info,
  },
  // Ton réservé au rappel « seul un entretien médical peut confirmer
  // l'aptitude au don » — obligatoire dès qu'un résultat est affiché.
  medical: {
    wrapper: "bg-primary-subtle border-primary-soft text-ink-secondary",
    icon: "text-primary",
    Icon: ShieldCheck,
  },
  warning: {
    wrapper: "bg-warning-soft border-warning-soft text-ink-secondary",
    icon: "text-warning",
    Icon: TriangleAlert,
  },
};

export function Callout({
  tone = "info",
  title,
  className,
  children,
}: {
  tone?: Tone;
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  const { wrapper, icon, Icon } = TONES[tone];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border p-4 text-sm leading-relaxed",
        wrapper,
        className,
      )}
    >
      <Icon aria-hidden="true" className={cn("mt-0.5 size-5 shrink-0", icon)} />
      <div>
        {title && <p className="mb-1 font-semibold text-ink">{title}</p>}
        <div className="text-pretty">{children}</div>
      </div>
    </div>
  );
}

/**
 * Le disclaimer médical, formulé une seule fois et réutilisé partout.
 *
 * Le brief l'impose (annexe) et le cadrage le répète (§04) : le centraliser
 * garantit qu'il ne peut pas diverger d'un endroit à l'autre de la page.
 */
export function MedicalDisclaimer({ className }: { className?: string }) {
  return (
    <Callout
      tone="medical"
      title="Ce résultat est indicatif"
      className={className}
    >
      Les critères utilisés ici sont simplifiés pour ce site. Seul un{" "}
      <strong className="font-semibold text-ink">
        entretien médical avec un professionnel de santé
      </strong>{" "}
      peut confirmer votre aptitude au don — et il a lieu sur place, avant
      chaque prélèvement.
    </Callout>
  );
}
