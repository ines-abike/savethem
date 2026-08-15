import { describe, expect, it } from "vitest";
import type { DonationCenter } from "@/types";
import { DONATION_CENTERS } from "@/data/centers";
import {
  formatNextOpening,
  formatSlot,
  getNextOpening,
  isOpenNow,
} from "./opening-hours";

/**
 * Repères de dates utilisés ici (vérifiés, pas supposés) :
 *   vendredi  14 août 2026  → getDay() 5
 *   samedi    15 août 2026  → 6
 *   dimanche  16 août 2026  → 0
 *   lundi     17 août 2026  → 1
 */

/** Centre fictif avec pause déjeuner le vendredi, fermé le week-end. */
const withLunchBreak: DonationCenter = {
  ...DONATION_CENTERS[0],
  id: "fixture-pause",
  openingHours: [
    { day: 5, opensAt: "08:30", closesAt: "12:30" },
    { day: 5, opensAt: "13:30", closesAt: "17:00" },
    { day: 1, opensAt: "09:00", closesAt: "17:00" },
  ],
};

/** Collecte mobile n'ouvrant qu'un seul jour par semaine. */
const weeklyOnly: DonationCenter = {
  ...DONATION_CENTERS[0],
  id: "fixture-mobile",
  openingHours: [{ day: 5, opensAt: "13:00", closesAt: "18:00" }],
};

describe("isOpenNow", () => {
  it("est ouvert en plein créneau du matin", () => {
    expect(isOpenNow(withLunchBreak, new Date(2026, 7, 14, 10, 0))).toBe(true);
  });

  it("est fermé pendant la pause déjeuner", () => {
    // Le cas que rate systématiquement un modèle « une plage par jour ».
    expect(isOpenNow(withLunchBreak, new Date(2026, 7, 14, 13, 0))).toBe(false);
  });

  it("rouvre après la pause", () => {
    expect(isOpenNow(withLunchBreak, new Date(2026, 7, 14, 14, 0))).toBe(true);
  });

  it("est ouvert à la minute d'ouverture", () => {
    expect(isOpenNow(withLunchBreak, new Date(2026, 7, 14, 8, 30))).toBe(true);
  });

  it("est fermé à la minute de fermeture", () => {
    // Fermeture exclusive : on n'envoie personne se présenter à 17h00 pile.
    expect(isOpenNow(withLunchBreak, new Date(2026, 7, 14, 17, 0))).toBe(false);
  });

  it("est fermé juste avant l'ouverture", () => {
    expect(isOpenNow(withLunchBreak, new Date(2026, 7, 14, 8, 29))).toBe(false);
  });

  it("est fermé un jour non déclaré", () => {
    expect(isOpenNow(withLunchBreak, new Date(2026, 7, 16, 10, 0))).toBe(false);
  });
});

describe("getNextOpening", () => {
  it("renvoie le créneau de l'après-midi depuis la pause déjeuner", () => {
    const next = getNextOpening(withLunchBreak, new Date(2026, 7, 14, 13, 0));
    expect(next).toEqual(new Date(2026, 7, 14, 13, 30));
  });

  it("saute au jour d'ouverture suivant en fin de journée", () => {
    // Vendredi 18h, fermé samedi et dimanche → lundi 9h.
    const next = getNextOpening(withLunchBreak, new Date(2026, 7, 14, 18, 0));
    expect(next).toEqual(new Date(2026, 7, 17, 9, 0));
  });

  it("revient à la semaine suivante pour une collecte hebdomadaire passée", () => {
    const next = getNextOpening(weeklyOnly, new Date(2026, 7, 14, 19, 0));
    expect(next).toEqual(new Date(2026, 7, 21, 13, 0));
  });

  it("renvoie null sans aucun créneau déclaré", () => {
    const closed: DonationCenter = { ...weeklyOnly, openingHours: [] };
    expect(getNextOpening(closed, new Date(2026, 7, 14, 10, 0))).toBeNull();
  });
});

describe("formatNextOpening", () => {
  const now = new Date(2026, 7, 14, 18, 0);

  it("dit « ouvre à » pour le jour même", () => {
    expect(formatNextOpening(new Date(2026, 7, 14, 19, 30), now)).toBe(
      "Ouvre à 19h30",
    );
  });

  it("dit « demain » pour J+1", () => {
    expect(formatNextOpening(new Date(2026, 7, 15, 9, 0), now)).toBe(
      "Ouvre demain à 09h00",
    );
  });

  it("nomme le jour au-delà de J+1", () => {
    expect(formatNextOpening(new Date(2026, 7, 17, 9, 0), now)).toBe(
      "Ouvre lundi à 09h00",
    );
  });
});

describe("formatSlot", () => {
  it("utilise la notation horaire française", () => {
    expect(formatSlot({ day: 1, opensAt: "09:30", closesAt: "18:00" })).toBe(
      "09h30 – 18h00",
    );
  });
});

describe("intégrité du jeu de données", () => {
  it("fournit au moins les 8 centres exigés par le brief", () => {
    expect(DONATION_CENTERS.length).toBeGreaterThanOrEqual(8);
  });

  it("couvre exactement un centre par département béninois", () => {
    // Le maillage est la promesse du répertoire : un département sans centre
    // laisserait une région entière sans point d'entrée.
    const departments = DONATION_CENTERS.map((c) => c.address.department);
    expect(new Set(departments).size).toBe(12);
    expect(departments).toHaveLength(12);
  });

  it("place chaque centre dans une ville distincte", () => {
    const cities = DONATION_CENTERS.map((c) => c.address.city);
    expect(new Set(cities).size).toBe(cities.length);
  });

  it("n'a aucun identifiant en double", () => {
    const ids = DONATION_CENTERS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("déclare des horaires cohérents partout", () => {
    for (const center of DONATION_CENTERS) {
      expect(center.openingHours.length).toBeGreaterThan(0);

      for (const slot of center.openingHours) {
        expect(slot.opensAt < slot.closesAt).toBe(true);
      }
    }
  });

  it("n'expose que des numéros béninois du bloc fictif interne", () => {
    // Garde-fou : empêche qu'un vrai numéro se glisse dans les données.
    // Format béninois à dix chiffres, sur un bloc `00 00` qui se lit comme
    // un gabarit.
    for (const center of DONATION_CENTERS) {
      expect(center.contact.phone).toMatch(/^\+229 01 00 00 \d{2} \d{2}$/);
    }
  });

  it("décrit des adresses au format béninois", () => {
    // Quartier et département sont la maille de localisation réelle : les
    // laisser vides casserait la recherche autant que l'affichage.
    for (const center of DONATION_CENTERS) {
      expect(center.address.district.length).toBeGreaterThan(0);
      expect(center.address.department.length).toBeGreaterThan(0);
      expect(center.address.country).toBe("Bénin");
    }
  });

  it("n'expose que des domaines .example non routables", () => {
    for (const center of DONATION_CENTERS) {
      if (center.contact.email) {
        expect(center.contact.email).toMatch(/@[\w.-]+\.example$/);
      }
    }
  });
});
