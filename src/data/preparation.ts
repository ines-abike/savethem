import type { PreparationTip } from "@/types";

/**
 * Préparation au don : avant, pendant, après (C5).
 *
 * Règle de ton imposée par le cadrage (§28) : rassurer sans nier. On ne
 * promet jamais qu'il n'y aura « rien » après le don. Les réactions
 * passagères sont nommées, avec la conduite à tenir — c'est ce qui rassure
 * réellement, pas le silence.
 */

export const PREPARATION_TIPS: PreparationTip[] = [
  // — Avant —
  {
    id: "avant-identite",
    phase: "avant",
    title: "Une pièce d'identité",
    description:
      "C'est le seul document indispensable. Pas de carte Vitale, pas " +
      "d'ordonnance, pas de dossier médical à apporter.",
  },
  {
    id: "avant-repas",
    phase: "avant",
    title: "Ne venez pas à jeun",
    description:
      "Mangez normalement dans les heures qui précèdent. Un repas léger et " +
      "peu gras suffit.",
  },
  {
    id: "avant-hydratation",
    phase: "avant",
    title: "Buvez davantage que d'habitude",
    description:
      "De l'eau, dans les heures qui précèdent. Un volume sanguin bien " +
      "hydraté rend le prélèvement plus simple et la récupération plus rapide.",
  },
  {
    id: "avant-temps",
    phase: "avant",
    title: "Prévoyez une heure",
    description:
      "Le prélèvement dure une dizaine de minutes, mais le parcours complet " +
      "en demande environ une. Venir en courant entre deux rendez-vous est " +
      "la meilleure façon de mal le vivre.",
  },

  // — Pendant —
  {
    id: "pendant-accompagnement",
    phase: "pendant",
    title: "Vous n'êtes jamais seul",
    description:
      "Une personne de l'équipe reste présente pendant tout le prélèvement. " +
      "Vous pouvez l'appeler à tout moment, y compris pour dire simplement " +
      "que vous êtes mal à l'aise.",
  },
  {
    id: "pendant-position",
    phase: "pendant",
    title: "Vous êtes allongé",
    description:
      "Position allongée ou semi-allongée du début à la fin. Si vous " +
      "n'aimez pas voir l'aiguille, vous pouvez tourner la tête ou fermer " +
      "les yeux — personne ne vous demandera de regarder.",
  },
  {
    id: "pendant-signaler",
    phase: "pendant",
    title: "Signalez tout de suite ce que vous ressentez",
    description:
      "Chaleur, vertige, nausée, bourdonnement : ce sont des sensations " +
      "connues et gérables, à condition d'être dites tôt. Il n'y a rien à " +
      "supporter en silence.",
  },

  // — Après —
  {
    id: "apres-repos",
    phase: "apres",
    title: "Restez au moins 20 minutes",
    description:
      "Assis, avec la collation. Ce n'est pas une politesse : la majorité " +
      "des malaises survient dans les minutes qui suivent le don, pas " +
      "pendant.",
  },
  {
    id: "apres-hydratation",
    phase: "apres",
    title: "Buvez dans les heures qui suivent",
    description:
      "Votre organisme reconstitue le volume prélevé en quelques heures. " +
      "L'hydratation est ce qui l'y aide le plus directement.",
  },
  {
    id: "apres-effort",
    phase: "apres",
    title: "Évitez l'effort intense dans la journée",
    description:
      "Sport soutenu, port de charges lourdes, plongée : à reporter au " +
      "lendemain. Une journée ordinaire, en revanche, se poursuit " +
      "normalement.",
  },
  {
    id: "apres-reactions",
    phase: "apres",
    title: "Si vous ne vous sentez pas bien",
    description:
      "Fatigue, étourdissement ou hématome au point de piqûre peuvent " +
      "survenir : c'est passager et sans gravité. Allongez-vous, surélevez " +
      "les jambes, buvez. Si la sensation persiste ou vous inquiète, " +
      "appelez le centre — le numéro figure sur le document remis à votre " +
      "départ.",
  },
];
