"use client";

import { CalendarClock, CircleCheck, Info } from "lucide-react";
import type { EligibilityResult } from "@/lib/eligibility";
import { formatDate } from "@/lib/eligibility";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";
import { MedicalDisclaimer } from "@/components/ui/callout";
import { cn } from "@/lib/utils";

/**
 * Affichage du résultat du simulateur (§04).
 *
 * Trois statuts, trois traitements distincts — et surtout trois tons
 * différents. « Non éligible » n'est pas une faute de l'utilisateur, et
 * « revenez en mars » n'est pas un refus.
 *
 * Le rouge de la marque n'est jamais utilisé ici : §26.3 lui réserve
 * l'action et l'identité. Un résultat positif est vert, un blocage est
 * neutre, une attente est ambrée.
 */

const TONES = {
  eligible: {
    wrapper: "border-success/30 bg-success-soft",
    icon: "text-success",
    Icon: CircleCheck,
  },
  "eligible-later": {
    wrapper: "border-warning/30 bg-warning-soft",
    icon: "text-warning",
    Icon: CalendarClock,
  },
  "not-eligible": {
    wrapper: "border-border bg-surface",
    icon: "text-ink-secondary",
    Icon: Info,
  },
} as const;

function Headline({ result }: { result: EligibilityResult }) {
  switch (result.status) {
    case "eligible":
      return <>Vous remplissez les critères principaux.</>;
    case "eligible-later":
      return (
        <>
          Vous pourrez donner à partir du {formatDate(result.nextEligibleDate)}.
        </>
      );
    case "not-eligible":
      return <>Le don ne semble pas possible aujourd&apos;hui.</>;
  }
}

function Lead({ result }: { result: EligibilityResult }) {
  switch (result.status) {
    case "eligible":
      return (
        <>
          Rien ne s&apos;oppose au don sur les critères d&apos;âge, de poids et
          de délai. La suite se passe sur place, avec un professionnel de santé.
        </>
      );
    case "eligible-later":
      return (
        <>
          Ce n&apos;est pas un refus : votre organisme a simplement besoin de ce
          délai pour reconstituer ce qui a été prélevé. Notez la date, et
          revenez.
        </>
      );
    case "not-eligible":
      return (
        <>
          Un critère au moins n&apos;est pas rempli. Cela ne dit rien de votre
          état de santé, et cela peut changer — la plupart des situations
          d&apos;inéligibilité sont temporaires.
        </>
      );
  }
}

export function EligibilityResultPanel({
  result,
  onReset,
}: {
  result: EligibilityResult;
  onReset: () => void;
}) {
  const tone = TONES[result.status];
  const { Icon } = tone;

  return (
    // `aria-live` sur un conteneur toujours monté : l'annonce ne part que si
    // la région existait déjà au moment où son contenu change.
    <div className="flex flex-col gap-5">
      <div
        className={cn("rounded-3xl border p-6 sm:p-8", tone.wrapper)}
        // Le résultat est un message d'état : `status` le fait annoncer sans
        // interrompre ce que l'utilisateur est en train de lire.
        role="status"
      >
        <div className="flex gap-4">
          <Icon
            aria-hidden="true"
            className={cn("mt-0.5 size-7 shrink-0", tone.icon)}
          />

          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold text-balance text-ink sm:text-2xl">
              <Headline result={result} />
            </h3>

            <p className="leading-relaxed text-pretty text-ink-secondary">
              <Lead result={result} />
            </p>

            {result.status !== "eligible" && result.reasons.length > 0 && (
              <ul className="mt-1 flex flex-col gap-2">
                {result.reasons.map((reason) => (
                  <li
                    key={reason.code}
                    className="flex gap-2 text-sm leading-relaxed text-ink"
                  >
                    <span aria-hidden="true" className="text-muted">
                      —
                    </span>
                    {reason.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <MedicalDisclaimer />

      <div className="flex flex-wrap gap-3">
        {result.status === "eligible" && (
          <ButtonLink href="#ou-donner">Trouver un centre</ButtonLink>
        )}
        {result.status === "eligible-later" && (
          <ButtonLink href="#ou-donner" variant="secondary">
            Repérer un centre dès maintenant
          </ButtonLink>
        )}
        {result.status === "not-eligible" && (
          <ButtonLink href="#questions" variant="secondary">
            Consulter les questions fréquentes
          </ButtonLink>
        )}

        <Button variant="ghost" onClick={onReset}>
          Recommencer
        </Button>
      </div>
    </div>
  );
}
