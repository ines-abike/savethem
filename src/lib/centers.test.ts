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
    const results = filter({ query: "natitingou" });
    expect(results).toHaveLength(1);
    expect(results[0].address.city).toBe("Natitingou");
  });

  it("indexe aussi les points de repère de l'adresse", () => {
    /*
      Au Bénin on s'oriente au repère — « route de Parakou », « carrefour
      Toyota », « en face du marché » — et non au numéro de voie. La rue est
      donc indexée volontairement.

      Effet de bord assumé, verrouillé ici pour qu'il reste un choix et non
      une surprise : une route nommée d'après une ville ressort sur le nom de
      cette ville. Chercher « parakou » remonte donc aussi Djougou, qui est
      sur la route de Parakou.
    */
    const results = filter({ query: "parakou" });
    expect(results.map((c) => c.address.city).sort()).toEqual([
      "Djougou",
      "Parakou",
    ]);
  });

  it("ignore la casse et les accents", () => {
    // « Cadjèhoun » saisi sans accent et en minuscules doit matcher.
    const results = filter({ query: "cadjehoun" });
    expect(results).toHaveLength(1);
    expect(results[0].address.district).toBe("Cadjèhoun");
  });

  it("trouve par quartier", () => {
    // Au Bénin, on se repère au quartier avant la ville.
    const results = filter({ query: "godomey" });
    expect(results).toHaveLength(1);
    expect(results[0].address.district).toBe("Godomey");
  });

  it("trouve par département", () => {
    const results = filter({ query: "borgou" });
    expect(results).toHaveLength(1);
    expect(results[0].address.department).toBe("Borgou");
  });

  it("accepte les mots dans le désordre", () => {
    const results = filter({ query: "cotonou don" });
    expect(results.length).toBeGreaterThan(0);
  });

  it("renvoie une liste vide pour une saisie sans correspondance", () => {
    expect(filter({ query: "reykjavik" })).toHaveLength(0);
  });
});

describe("filterCenters — filtres structurés", () => {
  it("filtre par ville exacte", () => {
    const results = filter({ city: "Cotonou" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((c) => c.address.city === "Cotonou")).toBe(true);
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
    const results = filter({ city: "Cotonou", donationType: "plaquettes" });
    expect(results).toHaveLength(1);
    expect(results[0].donationTypes).toContain("plaquettes");
  });

  it("restreint les plaquettes aux grandes villes du Sud", () => {
    // L'aphérèse suppose un plateau technique : la répartition des types de
    // don n'est pas uniforme, et le filtre doit le refléter.
    const results = filter({ donationType: "plaquettes" });
    expect(results.map((c) => c.address.city).sort()).toEqual([
      "Abomey-Calavi",
      "Cotonou",
      "Porto-Novo",
    ]);
  });

  it("atteint l'état vide sur une combinaison impossible", () => {
    // L'état « aucun résultat » doit être réellement atteignable, sinon on
    // ne peut pas le concevoir ni le tester dans l'interface.
    const results = filter({
      city: "Natitingou",
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
        query: "cotonou",
        city: "Cotonou",
        donationType: "plasma",
        openNow: true,
      }),
    ).toBe(4);
  });
});
