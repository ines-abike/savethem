import type { FaqEntry } from "@/types";

/**
 * FAQ et idées reçues (C8).
 *
 * Les questions sont formulées comme les pensées réelles d'un primo-donneur,
 * à la première personne quand c'est naturel — pas comme une FAQ
 * institutionnelle. Le cadrage §8 est explicite là-dessus.
 *
 * Règle de fond : aucune réponse ne présente une information médicale comme
 * un fait certain qui relèverait de l'entretien avec un professionnel.
 */

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: "douleur",
    category: "idee-recue",
    question: "Est-ce que ça fait mal ?",
    answer:
      "La piqûre se sent, comme une prise de sang, et elle dure une seconde. " +
      "Pendant le prélèvement lui-même, la plupart des donneurs ne ressentent " +
      "rien de particulier. Ce n'est pas la douleur qui rebute le plus " +
      "souvent, c'est l'appréhension de l'aiguille — et pour ça, vous pouvez " +
      "simplement ne pas regarder.",
  },
  {
    id: "materiel",
    category: "idee-recue",
    question: "Est-ce que je risque d'attraper quelque chose en donnant ?",
    answer:
      "Les dispositifs utilisés pour le prélèvement sont stériles et à usage " +
      "unique. Ils ne sont pas réutilisés d'un donneur à l'autre. " +
      "Vous pouvez d'ailleurs demander à voir l'emballage être ouvert devant " +
      "vous : c'est une demande légitime, et personne ne s'en formalisera.",
  },
  {
    id: "duree",
    category: "deroulement",
    question: "Combien de temps ça prend, vraiment ?",
    answer:
      "Comptez une heure sur place. Le prélèvement occupe 8 à 10 minutes ; " +
      "le reste, c'est l'accueil, l'entretien médical et les 20 minutes de " +
      "repos obligatoires. Ce sont ces 20 minutes que les gens oublient de " +
      "prévoir, et c'est ce qui les met en retard.",
  },
  {
    id: "malaise",
    category: "deroulement",
    question: "Et si je fais un malaise ?",
    answer:
      "C'est possible, et l'équipe y est préparée : c'est exactement pour ça " +
      "que vous êtes allongé et que vous restez sur place après. Un malaise " +
      "se manifeste d'abord par une sensation de chaleur ou de vertige — " +
      "dites-le dès que vous la sentez, on vous allonge, ça passe en quelques " +
      "minutes. Venir en ayant mangé et bu réduit nettement le risque.",
  },
  {
    id: "premiere-fois",
    category: "eligibilite",
    question: "Je n'ai jamais donné. Est-ce que je peux quand même venir ?",
    answer:
      "Oui. Ne jamais avoir donné n'est pas un obstacle, et il n'y a aucune " +
      "démarche préalable à faire. Vous pouvez vérifier les critères " +
      "principaux avec le simulateur de cette page, puis vous présenter dans " +
      "un centre — l'entretien médical fera le reste.",
  },
  {
    id: "don-familial",
    category: "idee-recue",
    question:
      "On m'a demandé de donner pour un proche hospitalisé. C'est la même chose ?",
    answer:
      "Le geste est le même, le moment ne l'est pas. Là, on donne dans " +
      "l'urgence, pour quelqu'un de précis, souvent en catastrophe. Le don " +
      "bénévole, lui, se fait à l'avance : le sang est déjà disponible quand " +
      "le besoin arrive, et personne n'a eu à courir. Les deux comptent — " +
      "mais c'est le second qui évite le premier.",
  },
  {
    id: "tatouage",
    category: "eligibilite",
    question: "J'ai un tatouage ou un piercing récent, ça bloque ?",
    answer:
      "Ce n'est pas un refus définitif, mais un délai d'attente s'applique " +
      "après un tatouage, un piercing ou un acte comportant une effraction " +
      "cutanée. La durée dépend de l'acte et de la date : c'est précisément " +
      "le genre de situation que l'entretien médical est là pour trancher. " +
      "Ne vous auto-excluez pas sur cette base.",
  },
  {
    id: "medicaments",
    category: "eligibilite",
    question: "Je prends un traitement. Est-ce que ça m'exclut ?",
    answer:
      "Pas systématiquement — beaucoup de traitements courants sont " +
      "compatibles avec le don. D'autres imposent un délai ou une " +
      "contre-indication. Venez avec le nom de votre traitement : c'est le " +
      "professionnel de santé qui évaluera, pas un formulaire.",
  },
  {
    id: "manger-avant",
    category: "eligibilite",
    question: "Que dois-je manger avant ?",
    answer:
      "Rien de particulier, mais surtout ne venez pas à jeun. Un repas " +
      "normal, plutôt léger et peu gras, dans les heures qui précèdent. " +
      "Et buvez plus d'eau que d'habitude.",
  },
  {
    id: "apres-don",
    category: "apres-don",
    question: "Je peux reprendre ma journée normalement après ?",
    answer:
      "Oui, dans la très grande majorité des cas. Évitez simplement l'effort " +
      "physique intense, le port de charges lourdes et la plongée dans la " +
      "journée. Certaines personnes ressentent de la fatigue ou un " +
      "étourdissement passager : ce n'est pas anormal, et ça s'estompe en " +
      "buvant et en se reposant.",
  },
  {
    id: "frequence",
    category: "apres-don",
    question: "Au bout de combien de temps puis-je redonner ?",
    answer:
      "Pour un don de sang total, le délai minimal retenu ici est de 3 mois " +
      "pour un homme et 4 mois pour une femme. Les délais réels varient " +
      "aussi selon le type de don (plasma et plaquettes ont des règles " +
      "différentes) et selon votre situation.",
  },
  {
    id: "quantite",
    category: "idee-recue",
    question: "On me prend beaucoup de sang ?",
    answer:
      "Entre 400 et 480 ml pour un don de sang total, soit environ 8 % du " +
      "volume sanguin d'un adulte — c'est aussi pour ça que le poids minimum " +
      "de 50 kg existe. Le volume liquide est reconstitué en quelques " +
      "heures, les globules rouges en quelques semaines.",
  },
  {
    id: "utilite",
    category: "idee-recue",
    question: "Mon groupe est courant, est-ce que mon don sert vraiment ?",
    answer:
      "Oui — et c'est même l'inverse de l'intuition. Un groupe courant est " +
      "beaucoup demandé parce que beaucoup de patients le portent. Les " +
      "réserves des groupes fréquents se vident donc aussi vite qu'elles se " +
      "remplissent.",
  },
  {
    id: "rendez-vous",
    category: "deroulement",
    question: "Faut-il prendre rendez-vous ?",
    answer:
      "Cela dépend du centre : certains fonctionnent uniquement sur " +
      "rendez-vous, d'autres accueillent sans. L'information figure sur " +
      "chaque fiche dans la section « Où donner ». En cas de doute, le " +
      "rendez-vous reste le moyen le plus sûr de ne pas attendre.",
  },
];
