/** Types métier partagés par toute l'application Savethem. */

export type BloodGroup =
  "O-" | "O+" | "A-" | "A+" | "B-" | "B+" | "AB-" | "AB+";

/** Types de dons acceptés par un centre (C6). */
export type DonationType = "sang-total" | "plasma" | "plaquettes";

/** Modalités d'accueil d'un centre (C6). */
export type AppointmentMode =
  "sur-rendez-vous" | "sans-rendez-vous" | "les-deux";

export type EstablishmentKind =
  "etablissement-fixe" | "maison-du-don" | "collecte-mobile" | "hopital";

/** Jour de la semaine, indexé comme `Date.getDay()` (0 = dimanche). */
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Créneau d'ouverture, heures au format "HH:mm" (heure locale). */
export interface OpeningSlot {
  day: WeekDay;
  opensAt: string;
  closesAt: string;
}

/** Un centre de transfusion (C6). */
export interface DonationCenter {
  id: string;
  name: string;
  kind: EstablishmentKind;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  contact: {
    phone: string;
    email?: string;
    website?: string;
  };
  openingHours: OpeningSlot[];
  donationTypes: DonationType[];
  appointmentMode: AppointmentMode;
}

/** Niveau de tension d'une réserve par groupe sanguin (C7). */
export type StockLevel = "critique" | "faible" | "satisfaisant";

export interface BloodStock {
  group: BloodGroup;
  /** Pourcentage de remplissage de la réserve, de 0 à 100. */
  fillRate: number;
  level: StockLevel;
}

/** Question de la FAQ / idée reçue à déconstruire (C8). */
export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  category: "eligibilite" | "deroulement" | "apres-don" | "idee-recue";
}

/** Étape du parcours de don (C4). */
export interface DonationStep {
  id: string;
  title: string;
  description: string;
  /** Durée indicative de l'étape, en minutes. */
  durationMinutes: number;
}

/** Moment auquel se rapporte un conseil de préparation (C5). */
export type PreparationPhase = "avant" | "pendant" | "apres";

export interface PreparationTip {
  id: string;
  phase: PreparationPhase;
  title: string;
  description: string;
}

/** Chiffre d'impact mis en avant dans la section « Pourquoi donner » (C1). */
export interface ImpactStat {
  id: string;
  value: string;
  label: string;
  detail: string;
}
