import type { AppointmentMode, DonationCenter, DonationType } from "@/types";
import { isOpenNow } from "./opening-hours";

/**
 * Recherche et filtrage des centres (C6).
 *
 * Fonctions pures : `now` est injecté, aucune dépendance à React. Le filtre
 * « ouvert maintenant » n'est donc pas plus difficile à tester que les autres.
 */

export interface CenterFilters {
  /** Recherche libre : nom, ville, quartier, département ou rue. */
  query: string;
  /** Ville exacte, ou `null` pour toutes. */
  city: string | null;
  /** Type de don, ou `null` pour tous. */
  donationType: DonationType | null;
  /** Ne conserver que les centres ouverts à l'instant `now`. */
  openNow: boolean;
}

export const EMPTY_FILTERS: CenterFilters = {
  query: "",
  city: null,
  donationType: null,
  openNow: false,
};

/**
 * Minuscules sans diacritiques : « Marseille » et « marseille » doivent
 * matcher, mais aussi « Krutenau » saisi sans accent.
 */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function matchesQuery(center: DonationCenter, query: string): boolean {
  const needle = normalize(query);
  if (needle === "") return true;

  // Le quartier et le département sont indexés : au Bénin, on cherche
  // « Cadjèhoun » ou « Borgou » aussi naturellement qu'un nom de ville.
  const haystack = [
    center.name,
    center.address.district,
    center.address.city,
    center.address.department,
    center.address.street,
  ]
    .map(normalize)
    .join(" ");

  // Chaque mot saisi doit apparaître : « don paris » trouve la maison du don
  // parisienne, sans exiger l'ordre exact.
  return needle.split(/\s+/).every((word) => haystack.includes(word));
}

export function filterCenters(
  centers: DonationCenter[],
  filters: CenterFilters,
  now: Date | null,
): DonationCenter[] {
  return centers.filter((center) => {
    if (!matchesQuery(center, filters.query)) return false;

    if (filters.city !== null && center.address.city !== filters.city) {
      return false;
    }

    if (
      filters.donationType !== null &&
      !center.donationTypes.includes(filters.donationType)
    ) {
      return false;
    }

    // `now` vaut null tant que l'heure client n'est pas connue (§30.4) :
    // on n'applique pas un filtre dont on ne peut pas encore calculer le
    // résultat, plutôt que de renvoyer une liste faussement vide.
    if (filters.openNow && now !== null && !isOpenNow(center, now)) {
      return false;
    }

    return true;
  });
}

/** Villes présentes dans le répertoire, dédoublonnées et triées. */
export function listCities(centers: DonationCenter[]): string[] {
  const cities = new Set(centers.map((center) => center.address.city));
  return [...cities].sort((a, b) => a.localeCompare(b, "fr"));
}

export function countActiveFilters(filters: CenterFilters): number {
  let count = 0;
  if (filters.query.trim() !== "") count += 1;
  if (filters.city !== null) count += 1;
  if (filters.donationType !== null) count += 1;
  if (filters.openNow) count += 1;
  return count;
}

export const DONATION_TYPE_LABELS: Record<DonationType, string> = {
  "sang-total": "Sang total",
  plasma: "Plasma",
  plaquettes: "Plaquettes",
};

export const APPOINTMENT_MODE_LABELS: Record<AppointmentMode, string> = {
  "sur-rendez-vous": "Sur rendez-vous uniquement",
  "sans-rendez-vous": "Sans rendez-vous",
  "les-deux": "Avec ou sans rendez-vous",
};

export const ESTABLISHMENT_KIND_LABELS: Record<DonationCenter["kind"], string> =
  {
    "etablissement-fixe": "Établissement de transfusion",
    "maison-du-don": "Maison du don",
    "collecte-mobile": "Collecte mobile",
    hopital: "Centre hospitalier",
  };
