import type { DonationStep } from "@/types";

/**
 * Le parcours du don, étape par étape (C4).
 *
 * L'objectif de cette section est de rendre l'expérience prévisible : la peur
 * vient surtout de ne pas savoir ce qui va se passer (insight 02). Chaque
 * étape dit donc concrètement ce qu'on fait, pas ce qu'on ressent.
 */

export const DONATION_STEPS: DonationStep[] = [
  {
    id: "accueil",
    title: "Accueil et inscription",
    description:
      "Vous présentez une pièce d'identité et remplissez un questionnaire " +
      "de santé. Rien de médical à ce stade : ce sont des questions écrites, " +
      "que vous remplissez tranquillement.",
    durationMinutes: 10,
  },
  {
    id: "entretien",
    title: "Entretien avec un professionnel de santé",
    description:
      "Un médecin ou un infirmier reprend le questionnaire avec vous, en " +
      "tête-à-tête et confidentiellement. C'est le moment où l'on vérifie " +
      "que le don est sans risque pour vous comme pour le receveur — et le " +
      "seul moment où votre aptitude est réellement établie.",
    durationMinutes: 15,
  },
  {
    id: "don",
    title: "Le prélèvement",
    description:
      "Vous êtes installé en position allongée ou semi-allongée. La piqûre " +
      "dure une seconde ; le prélèvement lui-même, entre 8 et 10 minutes " +
      "pour un don de sang total. Une personne reste présente pendant " +
      "toute la durée.",
    durationMinutes: 10,
  },
  {
    id: "collation",
    title: "Repos et collation",
    description:
      "Vous restez au moins 20 minutes sur place, assis, avec de quoi boire " +
      "et manger. Ce temps n'est pas une formalité : c'est lui qui limite " +
      "les malaises, qui surviennent le plus souvent après le don plutôt " +
      "que pendant.",
    durationMinutes: 20,
  },
];

/** Durée totale, calculée plutôt que saisie — elle ne peut pas diverger. */
export const TOTAL_DURATION_MINUTES = DONATION_STEPS.reduce(
  (total, step) => total + step.durationMinutes,
  0,
);
