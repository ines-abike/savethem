import type { ImpactStat } from "@/types";

/**
 * Chiffres d'impact de la section « Pourquoi donner » (C1).
 *
 * Ce sont des **ordres de grandeur** communément diffusés dans la
 * communication publique française sur le don du sang, arrondis et présentés
 * comme tels. Ils ne sont pas issus d'un relevé daté : pour les chiffres
 * officiels et à jour, la page renvoie explicitement vers l'Établissement
 * français du sang.
 *
 * On ne cite pas de décimale ni de millésime qu'on ne pourrait pas sourcer —
 * la précision feinte est plus coûteuse en crédibilité que l'arrondi assumé.
 */

export const IMPACT_SOURCE_URL = "https://dondesang.efs.sante.fr/";

export const IMPACT_STATS: ImpactStat[] = [
  {
    id: "besoins-quotidiens",
    value: "~10 000",
    label: "dons nécessaires chaque jour en France",
    detail:
      "Ce besoin ne baisse ni le week-end, ni pendant les vacances. C'est " +
      "l'été et les périodes de fêtes que les réserves se tendent le plus.",
  },
  {
    id: "patients",
    value: "~1 million",
    label: "de patients soignés chaque année",
    detail:
      "Accidents et hémorragies, mais surtout maladies du sang, cancers et " +
      "interventions chirurgicales lourdes — la majorité des transfusions " +
      "n'a rien à voir avec l'urgence spectaculaire.",
  },
  {
    id: "substitut",
    value: "0",
    label: "produit capable de remplacer le sang humain",
    detail:
      "Il n'existe aucun substitut de synthèse. Tout ce qui est transfusé " +
      "aujourd'hui a été donné par quelqu'un.",
  },
];

/**
 * Message porteur de la section rouge (§30.3).
 *
 * Volontairement descriptif plutôt qu'injonctif : le cadrage §19 proscrit
 * « vous devez donner ».
 */
export const IMPACT_HEADLINE = "Votre don ne reste pas une poche de sang.";

export const IMPACT_LEAD =
  "Il est séparé en plusieurs composants, qui partent vers plusieurs " +
  "personnes. Un même don peut accompagner la chimiothérapie d'un patient, " +
  "l'accouchement compliqué d'une femme et l'opération d'un accidenté.";
