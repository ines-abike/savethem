import { describe, expect, it } from "vitest";
import { addMonths, checkEligibility, getAge } from "./eligibility";

/**
 * On ne teste pas les cas évidents : on teste les bornes et les pièges de
 * calendrier, c'est-à-dire exactement ce qu'un correcteur ira éprouver à la
 * main. `referenceDate` est injectée partout — aucun test ne dépend du jour
 * où il est exécuté.
 */

const REFERENCE = new Date(2026, 7, 14); // vendredi 14 août 2026

/** Profil valide par défaut, que chaque test dégrade sur un seul axe. */
function profile(overrides: Partial<Parameters<typeof checkEligibility>[0]>) {
  return checkEligibility({
    birthDate: new Date(1995, 0, 1),
    weightKg: 70,
    sex: "homme",
    lastDonationDate: null,
    referenceDate: REFERENCE,
    ...overrides,
  });
}

describe("getAge", () => {
  it("ne compte pas l'année en cours avant l'anniversaire", () => {
    // Anniversaire le 15 août, on est le 14 : il a encore 30 ans.
    expect(getAge(new Date(1995, 7, 15), REFERENCE)).toBe(30);
  });

  it("compte l'année le jour même de l'anniversaire", () => {
    expect(getAge(new Date(1995, 7, 14), REFERENCE)).toBe(31);
  });
});

describe("addMonths", () => {
  it("ne déborde pas sur le mois suivant depuis un 31", () => {
    // Le piège classique : Date.setMonth donnerait le 1er mai.
    expect(addMonths(new Date(2026, 0, 31), 3)).toEqual(new Date(2026, 3, 30));
  });

  it("gère l'atterrissage en février", () => {
    expect(addMonths(new Date(2026, 10, 30), 3)).toEqual(new Date(2027, 1, 28));
  });

  it("gère une année bissextile", () => {
    expect(addMonths(new Date(2027, 10, 30), 3)).toEqual(new Date(2028, 1, 29));
  });

  it("franchit correctement le changement d'année", () => {
    expect(addMonths(new Date(2026, 11, 10), 4)).toEqual(new Date(2027, 3, 10));
  });
});

describe("checkEligibility — bornes d'âge", () => {
  it("accepte 18 ans le jour de l'anniversaire", () => {
    const result = profile({ birthDate: new Date(2008, 7, 14) });
    expect(result.status).toBe("eligible");
  });

  it("refuse la veille des 18 ans", () => {
    const result = profile({ birthDate: new Date(2008, 7, 15) });
    expect(result.status).toBe("not-eligible");
    expect(result).toMatchObject({ reasons: [{ code: "age-too-low" }] });
  });

  it("accepte 65 ans révolus", () => {
    const result = profile({ birthDate: new Date(1961, 7, 14) });
    expect(result.status).toBe("eligible");
  });

  it("refuse à partir de 66 ans", () => {
    const result = profile({ birthDate: new Date(1960, 7, 14) });
    expect(result.status).toBe("not-eligible");
    expect(result).toMatchObject({ reasons: [{ code: "age-too-high" }] });
  });
});

describe("checkEligibility — poids", () => {
  it("accepte 50 kg pile", () => {
    expect(profile({ weightKg: 50 }).status).toBe("eligible");
  });

  it("refuse juste en dessous de 50 kg", () => {
    const result = profile({ weightKg: 49.9 });
    expect(result.status).toBe("not-eligible");
    expect(result).toMatchObject({ reasons: [{ code: "weight-too-low" }] });
  });
});

describe("checkEligibility — motifs cumulés", () => {
  it("remonte l'âge ET le poids d'un coup", () => {
    // Sinon l'utilisateur corrige son poids pour découvrir ensuite que son
    // âge bloquait aussi : une correction en cascade, pénible et évitable.
    const result = profile({
      birthDate: new Date(2015, 0, 1),
      weightKg: 40,
    });

    expect(result.status).toBe("not-eligible");
    expect(result).toMatchObject({
      reasons: [{ code: "age-too-low" }, { code: "weight-too-low" }],
    });
  });
});

describe("checkEligibility — délai entre deux dons", () => {
  it("considère le délai rempli sans don antérieur", () => {
    expect(profile({ lastDonationDate: null }).status).toBe("eligible");
  });

  it("accepte un homme à exactement 3 mois", () => {
    const result = profile({
      sex: "homme",
      lastDonationDate: new Date(2026, 4, 14),
    });
    expect(result.status).toBe("eligible");
  });

  it("refuse un homme à 2 mois et donne la date de retour", () => {
    const result = profile({
      sex: "homme",
      lastDonationDate: new Date(2026, 5, 14),
    });

    expect(result.status).toBe("eligible-later");
    expect(result).toMatchObject({
      nextEligibleDate: new Date(2026, 8, 14),
      reasons: [{ code: "delay-not-elapsed" }],
    });
  });

  it("applique bien 4 mois à une femme là où 3 suffiraient à un homme", () => {
    const lastDonationDate = new Date(2026, 4, 14);

    expect(profile({ sex: "homme", lastDonationDate }).status).toBe("eligible");
    expect(profile({ sex: "femme", lastDonationDate }).status).toBe(
      "eligible-later",
    );
  });

  it("accepte une femme à exactement 4 mois", () => {
    const result = profile({
      sex: "femme",
      lastDonationDate: new Date(2026, 3, 14),
    });
    expect(result.status).toBe("eligible");
  });

  it("ignore l'heure du don : seul le jour compte", () => {
    // Un don enregistré à 23h ne doit pas décaler l'éligibilité d'un jour.
    const result = profile({
      sex: "homme",
      lastDonationDate: new Date(2026, 4, 14, 23, 59),
    });
    expect(result.status).toBe("eligible");
  });
});

describe("checkEligibility — priorité des motifs", () => {
  it("ne parle pas de délai quand l'âge bloque déjà", () => {
    // Annoncer « revenez dans 2 mois » à quelqu'un de 70 ans serait faux.
    const result = profile({
      birthDate: new Date(1950, 0, 1),
      lastDonationDate: new Date(2026, 6, 1),
    });

    expect(result.status).toBe("not-eligible");
    expect(result).toMatchObject({ reasons: [{ code: "age-too-high" }] });
  });
});
