import type { DonationCenter, OpeningSlot, WeekDay } from "@/types";

/**
 * Répertoire des centres de don (C6).
 *
 * ⚠️ DONNÉES D'ILLUSTRATION. Ces établissements sont fictifs.
 *
 * Les villes sont réelles, mais les noms, adresses, horaires et contacts sont
 * inventés pour les besoins du challenge. Rattacher de faux horaires au nom
 * d'un vrai centre EFS pourrait envoyer quelqu'un devant une porte close —
 * c'est précisément ce qu'on veut éviter sur un sujet de santé.
 *
 * Les numéros utilisent les plages `0X 99 00 XX XX` réservées par l'ARCEP à
 * la fiction : ils ne peuvent joindre personne. Les domaines en `.example`
 * sont réservés par la RFC 2606 et ne résolvent pas.
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
    id: "paris-rivoli",
    name: "Maison du don Rivoli",
    kind: "maison-du-don",
    address: {
      street: "148 rue de Rivoli",
      postalCode: "75001",
      city: "Paris",
      country: "France",
    },
    coordinates: { latitude: 48.8601, longitude: 2.3419 },
    contact: {
      phone: "01 99 00 14 20",
      email: "rivoli@savethem.example",
    },
    // Ouverture continue en semaine, plus le samedi matin.
    openingHours: [
      ...slots(MON_TO_FRI, "10:00", "19:30"),
      { day: 6, opensAt: "09:30", closesAt: "13:00" },
    ],
    donationTypes: ["sang-total", "plasma", "plaquettes"],
    appointmentMode: "les-deux",
  },
  {
    id: "paris-nord-hopital",
    name: "Centre de transfusion de l'hôpital Nord-Villette",
    kind: "hopital",
    address: {
      street: "5 avenue de la Porte de la Villette",
      postalCode: "75019",
      city: "Paris",
      country: "France",
    },
    coordinates: { latitude: 48.8975, longitude: 2.3866 },
    contact: {
      phone: "01 99 00 22 08",
      email: "don.nord-villette@savethem.example",
    },
    // Pause déjeuner : deux créneaux le même jour.
    openingHours: [
      ...slots(MON_TO_FRI, "08:30", "12:30"),
      ...slots(MON_TO_FRI, "13:30", "17:00"),
    ],
    donationTypes: ["sang-total", "plasma"],
    appointmentMode: "sur-rendez-vous",
  },
  {
    id: "lyon-guillotiere",
    name: "Maison du don Guillotière",
    kind: "maison-du-don",
    address: {
      street: "32 grande rue de la Guillotière",
      postalCode: "69007",
      city: "Lyon",
      country: "France",
    },
    coordinates: { latitude: 45.7503, longitude: 4.8422 },
    contact: {
      phone: "04 99 00 31 45",
      email: "guillotiere@savethem.example",
    },
    openingHours: [
      ...slots([2, 3, 4, 5], "10:00", "18:30"),
      { day: 6, opensAt: "09:00", closesAt: "14:00" },
    ],
    donationTypes: ["sang-total", "plasma", "plaquettes"],
    appointmentMode: "les-deux",
  },
  {
    id: "lyon-doua-mobile",
    name: "Collecte mobile Campus de la Doua",
    kind: "collecte-mobile",
    address: {
      street: "Esplanade du campus, 20 avenue Albert Einstein",
      postalCode: "69100",
      city: "Villeurbanne",
      country: "France",
    },
    coordinates: { latitude: 45.7817, longitude: 4.8697 },
    contact: {
      phone: "04 99 00 31 88",
    },
    // Collecte ponctuelle : deux après-midis par semaine.
    openingHours: [
      { day: 2, opensAt: "13:00", closesAt: "18:00" },
      { day: 4, opensAt: "13:00", closesAt: "18:00" },
    ],
    donationTypes: ["sang-total"],
    appointmentMode: "sans-rendez-vous",
  },
  {
    id: "marseille-vieux-port",
    name: "Établissement de transfusion Vieux-Port",
    kind: "etablissement-fixe",
    address: {
      street: "18 quai de Rive Neuve",
      postalCode: "13007",
      city: "Marseille",
      country: "France",
    },
    coordinates: { latitude: 43.2925, longitude: 5.3714 },
    contact: {
      phone: "04 99 00 45 12",
      email: "vieux-port@savethem.example",
    },
    openingHours: [
      ...slots(MON_TO_FRI, "08:00", "12:00"),
      ...slots([1, 3, 5], "14:00", "18:00"),
    ],
    donationTypes: ["sang-total", "plasma"],
    appointmentMode: "les-deux",
  },
  {
    id: "marseille-luminy-mobile",
    name: "Collecte mobile Université de Luminy",
    kind: "collecte-mobile",
    address: {
      street: "163 avenue de Luminy, hall central",
      postalCode: "13009",
      city: "Marseille",
      country: "France",
    },
    coordinates: { latitude: 43.2312, longitude: 5.4404 },
    contact: {
      phone: "04 99 00 45 60",
    },
    openingHours: [{ day: 3, opensAt: "11:00", closesAt: "17:30" }],
    donationTypes: ["sang-total", "plasma"],
    appointmentMode: "sans-rendez-vous",
  },
  {
    id: "bordeaux-chartrons",
    name: "Maison du don Chartrons",
    kind: "maison-du-don",
    address: {
      street: "74 cours du Médoc",
      postalCode: "33300",
      city: "Bordeaux",
      country: "France",
    },
    coordinates: { latitude: 44.8586, longitude: -0.5637 },
    contact: {
      phone: "05 99 00 52 77",
      email: "chartrons@savethem.example",
    },
    openingHours: [
      ...slots(MON_TO_FRI, "09:00", "17:00"),
      { day: 6, opensAt: "09:00", closesAt: "12:30" },
    ],
    donationTypes: ["sang-total", "plaquettes"],
    appointmentMode: "sur-rendez-vous",
  },
  {
    id: "lille-euralille",
    name: "Centre de transfusion Euralille",
    kind: "etablissement-fixe",
    address: {
      street: "12 avenue Le Corbusier",
      postalCode: "59777",
      city: "Lille",
      country: "France",
    },
    coordinates: { latitude: 50.6382, longitude: 3.0757 },
    contact: {
      phone: "03 99 00 61 04",
      email: "euralille@savethem.example",
      website: "https://euralille.savethem.example",
    },
    // Nocturne le jeudi : le seul centre ouvert après 20 h.
    openingHours: [
      ...slots([1, 2, 3, 5], "09:30", "18:00"),
      { day: 4, opensAt: "09:30", closesAt: "21:00" },
      { day: 6, opensAt: "10:00", closesAt: "16:00" },
    ],
    donationTypes: ["sang-total", "plasma", "plaquettes"],
    appointmentMode: "les-deux",
  },
  {
    id: "lille-wazemmes-mobile",
    name: "Collecte mobile Halle de Wazemmes",
    kind: "collecte-mobile",
    address: {
      street: "Place Nouvelle Aventure",
      postalCode: "59000",
      city: "Lille",
      country: "France",
    },
    coordinates: { latitude: 50.6252, longitude: 3.0508 },
    contact: {
      phone: "03 99 00 61 39",
    },
    openingHours: [
      { day: 0, opensAt: "09:00", closesAt: "13:00" },
      { day: 6, opensAt: "09:00", closesAt: "17:00" },
    ],
    donationTypes: ["sang-total"],
    appointmentMode: "sans-rendez-vous",
  },
  {
    id: "toulouse-capitole",
    name: "Maison du don Capitole",
    kind: "maison-du-don",
    address: {
      street: "9 rue du Poids de l'Huile",
      postalCode: "31000",
      city: "Toulouse",
      country: "France",
    },
    coordinates: { latitude: 43.6039, longitude: 1.4425 },
    contact: {
      phone: "05 99 00 73 21",
      email: "capitole@savethem.example",
    },
    openingHours: [
      ...slots([1, 2, 3, 4, 5], "10:00", "13:00"),
      ...slots([1, 2, 3, 4, 5], "14:00", "18:30"),
    ],
    donationTypes: ["sang-total", "plasma"],
    appointmentMode: "les-deux",
  },
  {
    id: "nantes-loire",
    name: "Établissement de transfusion Bord de Loire",
    kind: "etablissement-fixe",
    address: {
      street: "4 quai François Mitterrand",
      postalCode: "44200",
      city: "Nantes",
      country: "France",
    },
    coordinates: { latitude: 47.2049, longitude: -1.5645 },
    contact: {
      phone: "02 99 00 84 15",
      email: "bord-de-loire@savethem.example",
    },
    openingHours: slots(MON_TO_FRI, "08:30", "16:30"),
    donationTypes: ["sang-total", "plasma", "plaquettes"],
    appointmentMode: "sur-rendez-vous",
  },
  {
    id: "strasbourg-krutenau",
    name: "Maison du don Krutenau",
    kind: "maison-du-don",
    address: {
      street: "21 rue de Zurich",
      postalCode: "67000",
      city: "Strasbourg",
      country: "France",
    },
    coordinates: { latitude: 48.5798, longitude: 7.7574 },
    contact: {
      phone: "03 99 00 95 62",
      email: "krutenau@savethem.example",
    },
    openingHours: slots([1, 2, 4, 5], "11:00", "19:00"),
    donationTypes: ["sang-total"],
    appointmentMode: "sans-rendez-vous",
  },
];
