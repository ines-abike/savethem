"use client";

import { MapPin, Phone } from "lucide-react";
import type { DonationCenter } from "@/types";
import {
  APPOINTMENT_MODE_LABELS,
  DONATION_TYPE_LABELS,
  ESTABLISHMENT_KIND_LABELS,
} from "@/lib/centers";
import {
  formatNextOpening,
  getNextOpening,
  isOpenNow,
} from "@/lib/opening-hours";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/ui/status-indicator";

/**
 * Fiche résumée d'un centre dans la liste de résultats.
 *
 * Le statut d'ouverture n'est calculé que si `now` est connu (§30.4) ;
 * sinon on affiche un état « en cours de vérification » plutôt qu'un
 * « fermé » qui serait faux une fois sur deux.
 */
export function CenterCard({
  center,
  now,
  onOpenDetail,
}: {
  center: DonationCenter;
  now: Date | null;
  onOpenDetail: () => void;
}) {
  const open = now ? isOpenNow(center, now) : null;
  const nextOpening =
    now && open === false ? getNextOpening(center, now) : null;

  return (
    <li className="flex flex-col gap-4 rounded-3xl border border-border bg-background p-5 sm:p-6">
      <div className="flex flex-col gap-2">
        <Badge>{ESTABLISHMENT_KIND_LABELS[center.kind]}</Badge>

        <h3 className="text-lg font-bold text-balance text-ink">
          {center.name}
        </h3>

        <StatusIndicator
          status={now === null ? "unknown" : open ? "open" : "closed"}
          detail={
            nextOpening && now ? formatNextOpening(nextOpening, now) : undefined
          }
        />
      </div>

      <div className="flex flex-col gap-2 text-sm text-ink-secondary">
        <p className="flex items-start gap-2">
          <MapPin
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-muted"
          />
          <span>
            {center.address.street}
            <br />
            {center.address.district}, {center.address.city}
          </span>
        </p>

        <p className="flex items-center gap-2">
          <Phone aria-hidden="true" className="size-4 shrink-0 text-muted" />
          {/* Numéro cliquable : sur mobile, c'est l'action la plus probable. */}
          <a href={`tel:${center.contact.phone.replace(/\s/g, "")}`}>
            {center.contact.phone}
          </a>
        </p>
      </div>

      <ul className="flex flex-wrap gap-1.5">
        {center.donationTypes.map((type) => (
          <li key={type}>
            <Badge tone="primary">{DONATION_TYPE_LABELS[type]}</Badge>
          </li>
        ))}
      </ul>

      <p className="text-sm text-muted">
        {APPOINTMENT_MODE_LABELS[center.appointmentMode]}
      </p>

      <Button
        variant="secondary"
        onClick={onOpenDetail}
        className="mt-auto w-full"
      >
        Horaires et détails
      </Button>
    </li>
  );
}
