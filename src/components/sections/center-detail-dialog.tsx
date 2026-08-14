"use client";

import { Globe, Mail, MapPin, Phone } from "lucide-react";
import type { DonationCenter } from "@/types";
import {
  APPOINTMENT_MODE_LABELS,
  DONATION_TYPE_LABELS,
  ESTABLISHMENT_KIND_LABELS,
} from "@/lib/centers";
import {
  formatNextOpening,
  formatSlot,
  getNextOpening,
  getWeeklySchedule,
  isOpenNow,
} from "@/lib/opening-hours";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { cn } from "@/lib/utils";

/** Fiche complète d'un centre (§17 — dernier maillon du parcours). */
export function CenterDetailDialog({
  center,
  now,
  onClose,
}: {
  center: DonationCenter | null;
  now: Date | null;
  onClose: () => void;
}) {
  const open = center !== null && now !== null ? isOpenNow(center, now) : null;
  const nextOpening =
    center && now && open === false ? getNextOpening(center, now) : null;
  const today = now?.getDay() ?? null;

  return (
    <Dialog
      open={center !== null}
      onClose={onClose}
      title={center?.name ?? ""}
      className="max-w-xl"
    >
      {center && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Badge>{ESTABLISHMENT_KIND_LABELS[center.kind]}</Badge>
            <StatusIndicator
              status={now === null ? "unknown" : open ? "open" : "closed"}
              detail={
                nextOpening && now
                  ? formatNextOpening(nextOpening, now)
                  : undefined
              }
            />
          </div>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-ink">Horaires</h3>

            <ul className="divide-y divide-border text-sm">
              {getWeeklySchedule(center).map(({ day, label, slots }) => (
                <li
                  key={day}
                  className={cn(
                    "flex items-baseline justify-between gap-4 py-2",
                    // Le jour courant est mis en avant : c'est celui qu'on
                    // cherche des yeux en premier.
                    day === today && "font-semibold text-ink",
                  )}
                >
                  <span className={cn(day !== today && "text-ink-secondary")}>
                    {label}
                  </span>

                  {slots.length === 0 ? (
                    <span className="text-muted">Fermé</span>
                  ) : (
                    <span className="text-right">
                      {slots.map((slot, index) => (
                        <span key={index} className="block">
                          {formatSlot(slot)}
                        </span>
                      ))}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-ink">
              Adresse et contact
            </h3>

            <ul className="flex flex-col gap-2 text-sm text-ink-secondary">
              <li className="flex items-start gap-2">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-muted"
                />
                <span>
                  {center.address.street}
                  <br />
                  {center.address.postalCode} {center.address.city}
                </span>
              </li>

              <li className="flex items-center gap-2">
                <Phone
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted"
                />
                <a href={`tel:${center.contact.phone.replace(/\s/g, "")}`}>
                  {center.contact.phone}
                </a>
              </li>

              {center.contact.email && (
                <li className="flex items-center gap-2">
                  <Mail
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted"
                  />
                  <a
                    href={`mailto:${center.contact.email}`}
                    className="break-all"
                  >
                    {center.contact.email}
                  </a>
                </li>
              )}

              {center.contact.website && (
                <li className="flex items-center gap-2">
                  <Globe
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted"
                  />
                  <a
                    href={center.contact.website}
                    className="break-all"
                    rel="noreferrer"
                  >
                    {center.contact.website.replace(/^https?:\/\//, "")}
                  </a>
                </li>
              )}
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-ink">Dons acceptés</h3>

            <ul className="flex flex-wrap gap-1.5">
              {center.donationTypes.map((type) => (
                <li key={type}>
                  <Badge tone="primary">{DONATION_TYPE_LABELS[type]}</Badge>
                </li>
              ))}
            </ul>

            <p className="text-sm text-ink-secondary">
              {APPOINTMENT_MODE_LABELS[center.appointmentMode]}
            </p>
          </section>

          <p className="border-t border-border pt-4 text-xs leading-relaxed text-muted">
            Établissement fictif, créé pour la démonstration de ce site. Les
            coordonnées et horaires ne correspondent à aucun centre réel.
          </p>
        </div>
      )}
    </Dialog>
  );
}
