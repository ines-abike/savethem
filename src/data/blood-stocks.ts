import type { BloodStock } from "@/types";

/**
 * État des réserves par groupe sanguin (C7).
 *
 * ⚠️ DONNÉES D'ILLUSTRATION, figées pour le challenge.
 *
 * Le brief demande que l'interface donne l'impression d'une information
 * vivante. On s'arrête à l'impression : afficher « mis à jour il y a 5 min »
 * sur des données statiques serait un mensonge. La date ci-dessous est donc
 * explicite et fixe, et l'interface indique clairement qu'il s'agit d'un
 * jeu de démonstration.
 *
 * Les proportions reflètent la répartition réelle des groupes en France :
 * les groupes rares sont ceux dont la réserve se tend le plus vite.
 */

export const STOCKS_UPDATED_AT = "2026-08-14";

export const BLOOD_STOCKS: BloodStock[] = [
  { group: "O-", fillRate: 22, level: "critique" },
  { group: "B-", fillRate: 31, level: "critique" },
  { group: "A-", fillRate: 44, level: "faible" },
  { group: "O+", fillRate: 48, level: "faible" },
  { group: "AB-", fillRate: 52, level: "faible" },
  { group: "A+", fillRate: 71, level: "satisfaisant" },
  { group: "B+", fillRate: 76, level: "satisfaisant" },
  { group: "AB+", fillRate: 83, level: "satisfaisant" },
];

/**
 * Message de contexte affiché sous la grille.
 *
 * Formulé en besoin plutôt qu'en alerte : l'insight 06 du cadrage demande
 * que l'urgence mène à une action, pas qu'elle génère de l'anxiété.
 */
export const STOCKS_CONTEXT =
  "Les besoins sont particulièrement importants pour les groupes O− et B−. " +
  "Ces groupes sont plus rares dans la population, et le O− peut être " +
  "transfusé à presque tout le monde en situation d'urgence — ce qui le rend " +
  "précieux même en petite quantité.";

/**
 * Repère saisonnier propre au contexte béninois.
 *
 * La saison des pluies s'accompagne d'une recrudescence du paludisme, donc
 * de davantage d'anémies sévères à transfuser chez l'enfant. La tension sur
 * les réserves n'est pas uniforme dans l'année, et le dire donne un sens
 * concret à « pourquoi maintenant ».
 */
export const STOCKS_SEASON =
  "Les besoins augmentent pendant la saison des pluies : le paludisme y est " +
  "plus fréquent, et avec lui les anémies sévères qui se traitent par " +
  "transfusion — surtout chez les jeunes enfants.";

/** Rappel que tous les groupes comptent, y compris ceux affichés en vert. */
export const STOCKS_REASSURANCE =
  "Un groupe bien approvisionné aujourd'hui ne le sera plus dans trois " +
  "semaines : les globules rouges se conservent 42 jours, les plaquettes 7. " +
  "Chaque groupe a besoin de donneurs réguliers.";
