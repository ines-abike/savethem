import type { DonationCenter, OpeningSlot, WeekDay } from "@/types";

/**
 * Horaires et statut d'ouverture des centres (C6).
 *
 * Toutes les fonctions reçoivent `now` en paramètre plutôt que d'appeler
 * `new Date()` : elles restent déterministes, testables, et surtout
 * utilisables côté client uniquement (cf. CLAUDE.md §30.4 — calculer le
 * statut au rendu serveur produirait une valeur figée au build).
 */

export const DAY_LABELS: Record<WeekDay, string> = {
  0: "Dimanche",
  1: "Lundi",
  2: "Mardi",
  3: "Mercredi",
  4: "Jeudi",
  5: "Vendredi",
  6: "Samedi",
};

/** Ordre d'affichage : la semaine française commence le lundi. */
export const DISPLAY_DAYS: WeekDay[] = [1, 2, 3, 4, 5, 6, 0];

const MINUTES_PER_DAY = 24 * 60;

/** "14:30" → 870 minutes depuis minuit. */
export function parseTime(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** 870 → "14h30". */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  return `${hours}h${minutes}`;
}

export function formatSlot(slot: OpeningSlot): string {
  return `${formatTime(slot.opensAt)} – ${formatTime(slot.closesAt)}`;
}

function minutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/** Créneaux d'un jour donné, triés par heure d'ouverture. */
export function getSlotsForDay(
  center: DonationCenter,
  day: WeekDay,
): OpeningSlot[] {
  return center.openingHours
    .filter((slot) => slot.day === day)
    .sort((a, b) => parseTime(a.opensAt) - parseTime(b.opensAt));
}

/**
 * Le centre est-il ouvert à l'instant `now` ?
 *
 * L'ouverture est inclusive et la fermeture exclusive : à 18h00 pile, un
 * centre qui ferme à 18h00 est fermé. C'est le comportement attendu — on
 * n'envoie pas quelqu'un se présenter à la minute de fermeture.
 */
export function isOpenNow(center: DonationCenter, now: Date): boolean {
  const day = now.getDay() as WeekDay;
  const current = minutesSinceMidnight(now);

  return getSlotsForDay(center, day).some(
    (slot) =>
      current >= parseTime(slot.opensAt) && current < parseTime(slot.closesAt),
  );
}

/**
 * Prochaine ouverture à partir de `now`, ou `null` si le centre n'a aucun
 * créneau déclaré.
 *
 * Balaie les 7 jours suivants : un centre ouvert un seul jour par semaine
 * (les collectes mobiles) doit tout de même renvoyer une date.
 */
export function getNextOpening(center: DonationCenter, now: Date): Date | null {
  if (center.openingHours.length === 0) return null;

  const currentMinutes = minutesSinceMidnight(now);

  for (let offset = 0; offset < 7; offset += 1) {
    const day = ((now.getDay() + offset) % 7) as WeekDay;

    for (const slot of getSlotsForDay(center, day)) {
      const opensAt = parseTime(slot.opensAt);

      // Aujourd'hui, on ignore les créneaux déjà commencés ou passés.
      if (offset === 0 && opensAt <= currentMinutes) continue;

      const next = new Date(now);
      next.setDate(next.getDate() + offset);
      next.setHours(Math.floor(opensAt / 60), opensAt % 60, 0, 0);
      return next;
    }
  }

  // Un seul créneau, déjà passé aujourd'hui : il revient dans 7 jours.
  const [first] = getSlotsForDay(center, now.getDay() as WeekDay);
  if (first) {
    const opensAt = parseTime(first.opensAt);
    const next = new Date(now);
    next.setDate(next.getDate() + 7);
    next.setHours(Math.floor(opensAt / 60), opensAt % 60, 0, 0);
    return next;
  }

  return null;
}

/**
 * Formule courte décrivant la prochaine ouverture, pour l'afficher à côté
 * d'un statut « fermé ». Un centre fermé sans horizon de réouverture est une
 * impasse pour l'utilisateur.
 */
export function formatNextOpening(next: Date, now: Date): string {
  const time = `${String(next.getHours()).padStart(2, "0")}h${String(
    next.getMinutes(),
  ).padStart(2, "0")}`;

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfNext = new Date(
    next.getFullYear(),
    next.getMonth(),
    next.getDate(),
  );
  const daysAhead = Math.round(
    (startOfNext.getTime() - startOfToday.getTime()) /
      (MINUTES_PER_DAY * 60000),
  );

  if (daysAhead === 0) return `Ouvre à ${time}`;
  if (daysAhead === 1) return `Ouvre demain à ${time}`;
  return `Ouvre ${DAY_LABELS[next.getDay() as WeekDay].toLowerCase()} à ${time}`;
}

/** Horaires groupés par jour, dans l'ordre d'affichage français. */
export function getWeeklySchedule(center: DonationCenter) {
  return DISPLAY_DAYS.map((day) => ({
    day,
    label: DAY_LABELS[day],
    slots: getSlotsForDay(center, day),
  }));
}
