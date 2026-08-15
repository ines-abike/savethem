import type { ImpactStat } from "@/types";

/**
 * Chiffres d'impact de la section « Pourquoi donner » (C1), contexte béninois.
 *
 * Aucun chiffre national de collecte n'est avancé : je n'ai pas de relevé
 * daté et sourçable pour le Bénin, et fabriquer une statistique de santé
 * publique serait plus coûteux en crédibilité qu'un cadrage assumé.
 *
 * Ce qui est affirmé ici tient donc à des repères vérifiables :
 * - la recommandation de l'OMS (environ 1 % de la population donnant chaque
 *   année pour couvrir les besoins d'un pays) ;
 * - les principales indications de transfusion en Afrique de l'Ouest, à
 *   savoir l'anémie sévère de l'enfant et l'hémorragie de l'accouchement ;
 * - l'absence de substitut de synthèse au sang humain.
 *
 * Pour les données nationales à jour, la page renvoie vers l'Agence nationale
 * pour la transfusion sanguine (ANTS).
 */

export const IMPACT_SOURCE_LABEL =
  "Agence nationale pour la transfusion sanguine (ANTS) — Bénin";

/**
 * Repères de l'OMS sur la sécurité et la disponibilité du sang.
 *
 * ⚠️ À remplacer par l'adresse officielle de l'ANTS Bénin une fois vérifiée :
 * je n'ai pas confirmé son URL et je préfère ne pas en inventer une.
 */
export const IMPACT_SOURCE_URL =
  "https://www.who.int/news-room/fact-sheets/detail/blood-safety-and-availability";

export const IMPACT_STATS: ImpactStat[] = [
  {
    id: "seuil-oms",
    value: "1 %",
    label: "de la population, c'est ce qu'il faudrait chaque année",
    detail:
      "C'est le seuil que l'OMS retient pour qu'un pays couvre ses besoins " +
      "en produits sanguins. Un pourcentage qui paraît minuscule — et qui " +
      "n'est atteint nulle part sans donneurs réguliers.",
  },
  {
    id: "qui-recoit",
    value: "Enfants et mères",
    label: "les deux profils les plus transfusés en Afrique de l'Ouest",
    detail:
      "Anémie sévère chez l'enfant, souvent liée au paludisme ; hémorragie " +
      "au moment de l'accouchement chez la femme. On est loin de l'image de " +
      "l'accident de la route à laquelle on pense d'abord.",
  },
  {
    id: "substitut",
    value: "0",
    label: "produit capable de remplacer le sang humain",
    detail:
      "Il n'existe aucun substitut de synthèse. Tout ce qui est transfusé " +
      "aujourd'hui a été donné par quelqu'un, quelque part, quelques jours " +
      "plus tôt.",
  },
];

/**
 * Message porteur de la section rouge (§30.3).
 *
 * Le parti pris éditorial du contexte béninois : dans une large partie de la
 * région, quand un patient a besoin de sang, c'est encore souvent à sa
 * famille qu'on demande de trouver des donneurs. Le don bénévole n'est donc
 * pas un supplément d'âme — il évite à quelqu'un d'avoir à chercher dans
 * l'urgence.
 *
 * C'est plus juste ici que le registre « votre don sauve des vies », et c'est
 * descriptif plutôt qu'injonctif, comme le demande §19.
 */
export const IMPACT_HEADLINE =
  "Quand le sang manque, c'est la famille qui part en chercher.";

export const IMPACT_LEAD =
  "Un proche hospitalisé, et voilà des gens qui téléphonent à tout leur " +
  "carnet d'adresses en pleine nuit pour trouver un donneur compatible. " +
  "Chaque don bénévole, donné à l'avance et sans que personne ne le réclame, " +
  "c'est une famille de moins à qui on demandera ça.";
