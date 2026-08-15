import type { DonationCenter, OpeningSlot, WeekDay } from "@/types";

/**
 * Répertoire des centres de don au Bénin (C6).
 *
 * ⚠️ DONNÉES D'ILLUSTRATION. Ces établissements sont fictifs.
 *
 * Les villes, quartiers et départements sont réels ; les noms
 * d'établissement, adresses, horaires et contacts sont inventés pour les
 * besoins du challenge. Rattacher de faux horaires au nom d'un vrai centre de
 * transfusion pourrait envoyer quelqu'un devant une porte close — sur un
 * sujet de santé, c'est exactement ce qu'on veut éviter.
 *
 * **Un centre par département**, soit les douze départements du Bénin. Le
 * maillage administratif du pays devient ainsi la structure du répertoire :
 * personne ne se retrouve sans point d'entrée dans sa région, et le filtre
 * par ville recouvre exactement le filtre par département.
 *
 * Les adresses suivent l'usage béninois : on se repère au quartier et à un
 * point de référence, pas à un code postal.
 *
 * Les domaines en `.example` sont réservés par la RFC 2606 et ne résolvent
 * pas. Les numéros utilisent le format béninois à dix chiffres (`01 XX XX XX
 * XX`) sur un bloc `00 00` qui se lit comme un gabarit — c'est une convention
 * interne, pas une plage officiellement réservée à la fiction : la mention
 * « données d'illustration » affichée dans la section reste la garantie
 * principale.
 */

/** Construit des créneaux identiques sur une série de jours. */
function slots(
  days: WeekDay[],
  opensAt: string,
  closesAt: string,
): OpeningSlot[] {
  return days.map((day) => ({ day, opensAt, closesAt }));
}

const MON_TO_FRI: WeekDay[] = [1, 2, 3, 4, 5];

export const DONATION_CENTERS: DonationCenter[] = [
  {
    id: "littoral-cotonou",
    name: "Maison du don de Cadjèhoun",
    kind: "maison-du-don",
    address: {
      street: "Carrefour Toyota, en face du stade",
      district: "Cadjèhoun",
      city: "Cotonou",
      department: "Littoral",
      country: "Bénin",
    },
    coordinates: { latitude: 6.3654, longitude: 2.3892 },
    contact: {
      phone: "+229 01 00 00 14 20",
      email: "cadjehoun@savethem.example",
    },
    // Journée continue en semaine, plus le samedi matin.
    openingHours: [
      ...slots(MON_TO_FRI, "08:00", "18:00"),
      { day: 6, opensAt: "08:30", closesAt: "13:00" },
    ],
    donationTypes: ["sang-total", "plasma", "plaquettes"],
    appointmentMode: "les-deux",
  },
  {
    id: "oueme-porto-novo",
    name: "Établissement de transfusion d'Ouando",
    kind: "etablissement-fixe",
    address: {
      street: "Route de Pobè, carrefour Ouando",
      district: "Ouando",
      city: "Porto-Novo",
      department: "Ouémé",
      country: "Bénin",
    },
    coordinates: { latitude: 6.4969, longitude: 2.6289 },
    contact: {
      phone: "+229 01 00 00 22 08",
      email: "ouando@savethem.example",
      website: "https://ouando.savethem.example",
    },
    // Nocturne le jeudi : le seul centre ouvert après 19 h.
    openingHours: [
      ...slots([1, 2, 3, 5], "08:00", "17:30"),
      { day: 4, opensAt: "08:00", closesAt: "20:00" },
      { day: 6, opensAt: "09:00", closesAt: "14:00" },
    ],
    donationTypes: ["sang-total", "plasma", "plaquettes"],
    appointmentMode: "les-deux",
  },
  {
    id: "atlantique-abomey-calavi",
    name: "Maison du don de Godomey",
    kind: "maison-du-don",
    address: {
      street: "Carrefour Godomey, immeuble en face du marché",
      district: "Godomey",
      city: "Abomey-Calavi",
      department: "Atlantique",
      country: "Bénin",
    },
    coordinates: { latitude: 6.3789, longitude: 2.3312 },
    contact: {
      phone: "+229 01 00 00 31 45",
      email: "godomey@savethem.example",
    },
    openingHours: [
      ...slots(MON_TO_FRI, "08:00", "17:00"),
      { day: 6, opensAt: "08:00", closesAt: "12:30" },
    ],
    donationTypes: ["sang-total", "plaquettes"],
    appointmentMode: "sur-rendez-vous",
  },
  {
    id: "borgou-parakou",
    name: "Établissement de transfusion de Banikanni",
    kind: "etablissement-fixe",
    address: {
      street: "Avenue de l'Indépendance, quartier Banikanni",
      district: "Banikanni",
      city: "Parakou",
      department: "Borgou",
      country: "Bénin",
    },
    coordinates: { latitude: 9.3372, longitude: 2.6303 },
    contact: {
      phone: "+229 01 00 00 45 12",
      email: "banikanni@savethem.example",
    },
    // Pause de la mi-journée : deux créneaux le même jour.
    openingHours: [
      ...slots(MON_TO_FRI, "08:00", "12:30"),
      ...slots(MON_TO_FRI, "15:00", "18:00"),
    ],
    donationTypes: ["sang-total", "plasma"],
    appointmentMode: "les-deux",
  },
  {
    id: "zou-abomey",
    name: "Antenne hospitalière de Djègbé",
    kind: "hopital",
    address: {
      street: "Route d'Abomey-Bohicon, quartier Djègbé",
      district: "Djègbé",
      city: "Abomey",
      department: "Zou",
      country: "Bénin",
    },
    coordinates: { latitude: 7.1826, longitude: 1.9912 },
    contact: {
      phone: "+229 01 00 00 52 77",
      email: "djegbe@savethem.example",
    },
    openingHours: [
      ...slots(MON_TO_FRI, "08:00", "12:30"),
      ...slots([1, 3, 5], "15:30", "18:00"),
    ],
    donationTypes: ["sang-total", "plasma"],
    appointmentMode: "sur-rendez-vous",
  },
  {
    id: "mono-lokossa",
    name: "Maison du don de Lokossa",
    kind: "maison-du-don",
    address: {
      street: "Esplanade de la mairie, centre-ville",
      district: "Centre-ville",
      city: "Lokossa",
      department: "Mono",
      country: "Bénin",
    },
    coordinates: { latitude: 6.6389, longitude: 1.7167 },
    contact: {
      phone: "+229 01 00 00 61 04",
      email: "lokossa@savethem.example",
    },
    openingHours: slots(MON_TO_FRI, "08:00", "16:00"),
    donationTypes: ["sang-total", "plasma"],
    appointmentMode: "les-deux",
  },
  {
    id: "atacora-natitingou",
    name: "Maison du don de Natitingou",
    kind: "maison-du-don",
    address: {
      street: "Route de l'Atacora, quartier Yimporima",
      district: "Yimporima",
      city: "Natitingou",
      department: "Atacora",
      country: "Bénin",
    },
    coordinates: { latitude: 10.3047, longitude: 1.3797 },
    contact: {
      phone: "+229 01 00 00 61 39",
      email: "natitingou@savethem.example",
    },
    openingHours: slots([1, 2, 4, 5], "08:30", "16:00"),
    donationTypes: ["sang-total"],
    appointmentMode: "sans-rendez-vous",
  },
  {
    id: "donga-djougou",
    name: "Antenne hospitalière de Djougou",
    kind: "hopital",
    address: {
      street: "Route de Parakou, quartier Zongo",
      district: "Zongo",
      city: "Djougou",
      department: "Donga",
      country: "Bénin",
    },
    coordinates: { latitude: 9.7085, longitude: 1.666 },
    contact: {
      phone: "+229 01 00 00 73 21",
      email: "djougou@savethem.example",
    },
    openingHours: slots(MON_TO_FRI, "07:30", "15:30"),
    donationTypes: ["sang-total"],
    appointmentMode: "sur-rendez-vous",
  },
  {
    id: "alibori-kandi",
    name: "Collecte mobile de Kandi",
    kind: "collecte-mobile",
    address: {
      street: "Place du marché, quartier administratif",
      district: "Quartier administratif",
      city: "Kandi",
      department: "Alibori",
      country: "Bénin",
    },
    coordinates: { latitude: 11.1342, longitude: 2.9386 },
    contact: {
      phone: "+229 01 00 00 84 15",
    },
    // Collecte hebdomadaire : un seul jour, d'où l'intérêt d'afficher la
    // prochaine ouverture plutôt qu'un simple « fermé ».
    openingHours: [{ day: 2, opensAt: "08:30", closesAt: "15:00" }],
    donationTypes: ["sang-total"],
    appointmentMode: "sans-rendez-vous",
  },
  {
    id: "collines-dassa-zoume",
    name: "Collecte mobile de Dassa-Zoumè",
    kind: "collecte-mobile",
    address: {
      street: "Esplanade du centre de santé, centre-ville",
      district: "Centre-ville",
      city: "Dassa-Zoumè",
      department: "Collines",
      country: "Bénin",
    },
    coordinates: { latitude: 7.75, longitude: 2.1833 },
    contact: {
      phone: "+229 01 00 00 95 62",
    },
    openingHours: [{ day: 3, opensAt: "09:00", closesAt: "16:30" }],
    donationTypes: ["sang-total", "plasma"],
    appointmentMode: "sans-rendez-vous",
  },
  {
    id: "couffo-aplahoue",
    name: "Collecte mobile d'Aplahoué",
    kind: "collecte-mobile",
    address: {
      street: "Sous les préaux du marché, centre-ville",
      district: "Centre-ville",
      city: "Aplahoué",
      department: "Couffo",
      country: "Bénin",
    },
    coordinates: { latitude: 6.9333, longitude: 1.6833 },
    contact: {
      phone: "+229 01 00 00 27 48",
    },
    // Le seul centre ouvert le week-end complet.
    openingHours: [
      { day: 0, opensAt: "09:00", closesAt: "13:00" },
      { day: 6, opensAt: "08:30", closesAt: "16:00" },
    ],
    donationTypes: ["sang-total"],
    appointmentMode: "sans-rendez-vous",
  },
  {
    id: "plateau-pobe",
    name: "Établissement de transfusion de Pobè",
    kind: "etablissement-fixe",
    address: {
      street: "Route de Kétou, quartier Zongo",
      district: "Zongo",
      city: "Pobè",
      department: "Plateau",
      country: "Bénin",
    },
    coordinates: { latitude: 6.98, longitude: 2.665 },
    contact: {
      phone: "+229 01 00 00 38 06",
      email: "pobe@savethem.example",
    },
    openingHours: slots([1, 3, 5], "08:00", "13:00"),
    donationTypes: ["sang-total", "plasma"],
    appointmentMode: "les-deux",
  },
];
