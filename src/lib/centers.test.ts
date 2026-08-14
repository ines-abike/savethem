import { describe, expect, it } from "vitest";
import { DONATION_CENTERS } from "@/data/centers";
import {
  EMPTY_FILTERS,
  countActiveFilters,
  filterCenters,
  listCities,
} from "./centers";

const ALL = DONATION_CENTERS;

/** Vendredi 14 août 2026, 10h00. */
const FRIDAY_MORNING = new Date(2026, 7, 14, 10, 0);

function filter(
  overrides: Partial<typeof EMPTY_FILTERS>,
  now = FRIDAY_MORNING,
) {
  return filterCenters(ALL, { ...EMPTY_FILTERS, ...overrides }, now);
}

describe("filterCenters — recherche libre", () => {
  it("ne filtre rien sans critère", () => {
    expect(filter({})).toHaveLength(ALL.length);
  });

  it("trouve par ville", () => {
    const results = filter({ query: "lyon" });
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((c) => /lyon|villeurbanne/i.test(c.address.city)) ||
        results.every((c) => c.name.toLowerCase().includes("lyon")),
    ).toBe(true);
  });

  it("ignore la casse et les accents", () => {
    // « Établissement » saisi sans accent et en minuscules doit matcher.
    expect(filter({ query: "etablissement" }).length).toBeGreaterThan(0);
  });

  it("trouve par code postal", () => {
    const results = filter({ query: "75019" });
    expect(results).toHaveLength(1);
    expect(results[0].address.postalCode).toBe("75019");
  });

  it("accepte les mots dans le désordre", () => {
    const results = filter({ query: "paris don" });
    expect(results.length).toBeGreaterThan(0);
  });

  it("renvoie une liste vide pour une saisie sans correspondance", () => {
    expect(filter({ query: "reykjavik" })).toHaveLength(0);
  });
});

describe("filterCenters — filtres structurés", () => {
  it("filtre par ville exacte", () => {
    const results = filter({ city: "Bordeaux" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((c) => c.address.city === "Bordeaux")).toBe(true);
  });

  it("filtre par type de don", () => {
    const results = filter({ donationType: "plaquettes" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((c) => c.donationTypes.includes("plaquettes"))).toBe(
      true,
    );
  });

  it("ne garde que les centres réellement ouverts", () => {
    const results = filter({ openNow: true });
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThan(ALL.length);
  });

  it("change de résultat selon l'heure", () => {
    // Même filtre, dimanche à 4h du matin : plus rien n'est ouvert.
    const sundayNight = new Date(2026, 7, 16, 4, 0);
    expect(
      filterCenters(ALL, { ...EMPTY_FILTERS, openNow: true }, sundayNight),
    ).toHaveLength(0);
  });

  it("n'applique pas le filtre horaire tant que l'heure client est inconnue", () => {
    // §30.4 : avant le montage côté client, `now` vaut null. Filtrer
    // renverrait une liste faussement vide au premier rendu.
    const results = filterCenters(
      ALL,
      { ...EMPTY_FILTERS, openNow: true },
      null,
    );
    expect(results).toHaveLength(ALL.length);
  });
});

describe("filterCenters — combinaisons", () => {
  it("cumule les critères", () => {
    const results = filter({ city: "Lille", donationType: "plaquettes" });
    expect(
      results.every(
        (c) =>
          c.address.city === "Lille" && c.donationTypes.includes("plaquettes"),
      ),
    ).toBe(true);
  });

  it("atteint l'état vide sur une combinaison impossible", () => {
    // L'état « aucun résultat » doit être réellement atteignable, sinon on
    // ne peut pas le concevoir ni le tester dans l'interface.
    const results = filter({
      city: "Strasbourg",
      donationType: "plaquettes",
    });
    expect(results).toHaveLength(0);
  });
});

describe("listCities", () => {
  it("dédoublonne et trie alphabétiquement", () => {
    const cities = listCities(ALL);
    expect(new Set(cities).size).toBe(cities.length);
    expect([...cities].sort((a, b) => a.localeCompare(b, "fr"))).toEqual(
      cities,
    );
  });

  it("couvre au moins 5 villes", () => {
    expect(listCities(ALL).length).toBeGreaterThanOrEqual(5);
  });
});

describe("countActiveFilters", () => {
  it("ne compte rien à l'état initial", () => {
    expect(countActiveFilters(EMPTY_FILTERS)).toBe(0);
  });

  it("ignore une recherche composée d'espaces", () => {
    expect(countActiveFilters({ ...EMPTY_FILTERS, query: "   " })).toBe(0);
  });

  it("additionne les critères actifs", () => {
    expect(
      countActiveFilters({
        query: "lyon",
        city: "Lyon",
        donationType: "plasma",
        openNow: true,
      }),
    ).toBe(4);
  });
});
