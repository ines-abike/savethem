/**
 * Simulateur d'éligibilité au don du sang (C3).
 *
 * Règles issues de l'annexe du brief — volontairement simplifiées.
 * Un entretien médical professionnel reste seul habilité à confirmer
 * l'aptitude au don : ce message doit accompagner tout résultat affiché.
 */

export const MIN_AGE = 18;
export const MAX_AGE = 65;
export const MIN_WEIGHT_KG = 50;

/** Délai minimal entre deux dons, en mois. */
export const DELAY_MONTHS: Record<Sex, number> = {
  homme: 3,
  femme: 4,
};

export type Sex = "homme" | "femme";

export interface EligibilityInput {
  /** Date de naissance. */
  birthDate: Date;
  /** Poids en kilogrammes. */
  weightKg: number;
  sex: Sex;
  /** Date du dernier don, ou `null` si le donneur n'a jamais donné. */
  lastDonationDate: Date | null;
  /** Date de référence du calcul. Injectable pour rendre la fonction testable. */
  referenceDate?: Date;
}

export type EligibilityReasonCode =
  "age-too-low" | "age-too-high" | "weight-too-low" | "delay-not-elapsed";

export interface EligibilityReason {
  code: EligibilityReasonCode;
  /** Message explicite indiquant le critère bloquant. */
  message: string;
}

export type EligibilityResult =
  | {
      status: "eligible";
      age: number;
    }
  | {
      status: "not-eligible";
      age: number;
      reasons: EligibilityReason[];
    }
  | {
      status: "eligible-later";
      age: number;
      /** Date à partir de laquelle le don redevient possible. */
      nextEligibleDate: Date;
      reasons: EligibilityReason[];
    };

/** Âge révolu à la date de référence. */
export function getAge(birthDate: Date, referenceDate: Date): number {
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
  const dayDiff = referenceDate.getDate() - birthDate.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }
  return age;
}

/**
 * Date de naissance produisant exactement `age` à la date de référence.
 *
 * Le domaine raisonne sur une date de naissance, mais l'interface demande
 * l'âge (§16 : « Quel âge avez-vous ? ») — un champ numérique plutôt qu'un
 * sélecteur de date, c'est une friction en moins sur mobile. Cette fonction
 * fait le pont, sans introduire un second chemin de calcul.
 */
export function birthDateForAge(age: number, referenceDate: Date): Date {
  return new Date(
    referenceDate.getFullYear() - age,
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
}

/**
 * Ajoute `months` mois à une date en gérant les débordements de fin de mois
 * (31 janvier + 1 mois → 28/29 février, et non le 2 ou 3 mars).
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  const targetDay = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDayOfTargetMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();
  result.setDate(Math.min(targetDay, lastDayOfTargetMonth));
  return result;
}

/** Ramène une date à minuit, pour comparer des jours et non des instants. */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Évalue l'éligibilité d'un profil.
 *
 * - Aucun don antérieur → la condition de délai est considérée comme remplie.
 * - Délai non écoulé (et âge/poids valides) → statut `eligible-later` avec la
 *   date de prochaine éligibilité.
 * - Âge ou poids hors critères → statut `not-eligible` avec le ou les
 *   critères bloquants.
 */
export function checkEligibility(input: EligibilityInput): EligibilityResult {
  const referenceDate = startOfDay(input.referenceDate ?? new Date());
  const age = getAge(startOfDay(input.birthDate), referenceDate);

  const blockingReasons: EligibilityReason[] = [];

  if (age < MIN_AGE) {
    blockingReasons.push({
      code: "age-too-low",
      message: `Le don du sang est accessible à partir de ${MIN_AGE} ans. Vous avez ${age} ans.`,
    });
  } else if (age > MAX_AGE) {
    blockingReasons.push({
      code: "age-too-high",
      message: `Le don du sang est accessible jusqu'à ${MAX_AGE} ans révolus. Vous avez ${age} ans.`,
    });
  }

  if (input.weightKg < MIN_WEIGHT_KG) {
    blockingReasons.push({
      code: "weight-too-low",
      message: `Un poids minimum de ${MIN_WEIGHT_KG} kg est requis. Vous avez indiqué ${input.weightKg} kg.`,
    });
  }

  if (blockingReasons.length > 0) {
    return { status: "not-eligible", age, reasons: blockingReasons };
  }

  // Aucun don antérieur : la condition de délai est remplie.
  if (input.lastDonationDate === null) {
    return { status: "eligible", age };
  }

  const delayMonths = DELAY_MONTHS[input.sex];
  const nextEligibleDate = addMonths(
    startOfDay(input.lastDonationDate),
    delayMonths,
  );

  if (nextEligibleDate.getTime() > referenceDate.getTime()) {
    return {
      status: "eligible-later",
      age,
      nextEligibleDate,
      reasons: [
        {
          code: "delay-not-elapsed",
          message: `Un délai de ${delayMonths} mois est requis entre deux dons. Vous pourrez donner à nouveau à partir du ${formatDate(nextEligibleDate)}.`,
        },
      ],
    };
  }

  return { status: "eligible", age };
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
