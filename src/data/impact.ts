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
 * - la durée de conservation des globules rouges ;
 * - l'absence de substitut de synthèse au sang humain.
 *
 * Les indications de transfusion sont énoncées dans le chapô plutôt que dans
 * les chiffres, et **volontairement élargies**. S'en tenir à « enfants et
 * femmes enceintes » posait deux problèmes : c'était incomplet pour la région
 * — la drépanocytose et les traumatismes de la route pèsent lourd — et un
 * lecteur homme n'y trouvait aucune situation où se reconnaître. Or la
 * section doit lui donner une raison d'agir, pas seulement décrire des
 * bénéficiaires.
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

/**
 * Les trois chiffres sont volontairement **homogènes** : un pourcentage, une
 * durée, un zéro. `value` est rendu en très gros caractères gras — y glisser
 * une phrase la casserait en plusieurs lignes à côté de « 0 » et ruinerait
 * l'alignement des trois colonnes.
 */
export const IMPACT_STATS: ImpactStat[] = [
  {
    id: "seuil-oms",
    value: "1–2 %",
    label: "de la population suffit à couvrir les besoins d'un pays",
    detail:
      "C'est le seuil que retient l'OMS. Un pourcentage qui paraît minuscule " +
      "— et qui n'est atteint nulle part sans donneurs réguliers.",
  },
  {
    id: "conservation",
    value: "42 jours",
    label: "et un don de globules rouges n'est plus utilisable",
    detail:
      "Sept jours seulement pour les plaquettes. On ne constitue donc pas un " +
      "stock une fois pour toutes : une réserve pleine aujourd'hui est vide " +
      "dans quelques semaines si personne ne revient.",
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

/*
 * Les quatre situations citées couvrent délibérément tout le monde : un
 * enfant, une femme qui accouche, une maladie chronique qui touche les deux
 * sexes à tout âge, et un accident de la route dont les victimes sont
 * majoritairement de jeunes hommes.
 *
 * S'en tenir aux enfants et aux femmes enceintes aurait été à la fois
 * incomplet pour la région et démobilisateur : un homme adulte n'aurait vu
 * nulle part une situation qui le concerne.
 */
export const IMPACT_LEAD =
  "Un paludisme grave chez un enfant, un accouchement qui se complique, une " +
  "crise drépanocytaire, un accident de la route : personne ne choisit d'en " +
  "avoir besoin. Et quand la réserve est vide, ce sont les proches du patient " +
  "qui appellent tout leur carnet d'adresses, parfois en pleine nuit, pour " +
  "trouver un donneur. Un don fait à l'avance, c'est une famille " +
  "de moins à qui on demandera ça.";
