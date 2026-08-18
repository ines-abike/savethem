# Savethem

Landing page informative sur le don de sang, réalisée dans le cadre du **Figma to Code Challenge — Édition 4** (« Un sujet, une IA, votre instinct »).

L'objectif : qu'un visiteur qui n'a jamais donné reparte avec trois certitudes — **son éligibilité**, **où aller**, et **comment ça se passe**.

> 🇧🇯 Le site s'adresse au **Bénin**. Les villes, quartiers et départements sont réels ; les établissements, horaires et contacts sont des **données d'illustration**, créées pour la démonstration.

## Stack

| Choix                | Version | Pourquoi                                                                     |
| -------------------- | ------- | ---------------------------------------------------------------------------- |
| Next.js (App Router) | 16      | Rendu statique, bon SEO pour une page informative, DX solide                 |
| React                | 19      | —                                                                            |
| TypeScript           | 5       | `strict` activé, types métier centralisés dans `src/types`                   |
| Tailwind CSS         | 4       | Design tokens en CSS natif (`@theme`), identité visuelle 100 % custom        |
| GSAP + ScrollTrigger | 3.15    | Révélations au défilement, pilotées par attributs (voir plus bas)            |
| Vitest               | 4       | Tests de la logique métier, sans dépendance à React                          |
| ESLint 9 + jsx-a11y  | —       | Flat config, règles d'accessibilité (navigation clavier exigée par le brief) |
| Prettier             | 3       | Formatage unique, tri automatique des classes Tailwind                       |
| Husky + lint-staged  | —       | Le code ne part pas cassé : lint + format au commit, typecheck au push       |

Pas de backend : toutes les données (centres, réserves, FAQ) sont statiques et locales.

## Démarrer

```bash
pnpm install
pnpm dev
```

Le site tourne sur http://localhost:3000.

## Scripts

| Commande            | Effet                                                |
| ------------------- | ---------------------------------------------------- |
| `pnpm dev`          | Serveur de développement (Turbopack)                 |
| `pnpm build`        | Build de production                                  |
| `pnpm start`        | Sert le build de production                          |
| `pnpm lint`         | ESLint                                               |
| `pnpm lint:fix`     | ESLint avec correction automatique                   |
| `pnpm format`       | Prettier en écriture                                 |
| `pnpm format:check` | Prettier en vérification                             |
| `pnpm typecheck`    | `tsc --noEmit`                                       |
| `pnpm test`         | Tests unitaires (Vitest)                             |
| `pnpm check`        | Typecheck + lint + format + tests (la porte qualité) |

## Structure

```
src/
├── app/                  # App Router : layout, page, styles globaux
├── components/
│   ├── ui/               # Primitives réutilisables (bouton, carte, accordéon…)
│   ├── layout/           # Header, footer, navigation
│   ├── motion/           # Révélations au défilement (armement + contrôleur)
│   ├── illustrations/    # Formes décoratives en SVG inline
│   └── sections/         # Sections de la landing page (C1 → C8)
├── data/                 # Données statiques : centres, réserves, FAQ, étapes
├── hooks/                # Hooks React partagés
├── lib/                  # Logique métier pure
│   ├── eligibility.ts    # Simulateur d'éligibilité (C3)
│   ├── centers.ts        # Recherche et filtrage du répertoire (C6)
│   ├── opening-hours.ts  # Statut ouvert / fermé à l'instant présent
│   └── utils.ts          # Helper `cn` (clsx + tailwind-merge)
└── types/                # Types métier partagés
```

La logique métier (éligibilité, filtrage des centres, calcul des horaires d'ouverture) vit dans `src/lib` sous forme de fonctions pures, sans dépendance à React — elle reste ainsi lisible et testable indépendamment de l'UI.

## Qualité du code

Deux hooks Git protègent la branche :

- **pre-commit** → `lint-staged` : ESLint `--fix --max-warnings=0` puis Prettier sur les fichiers stagés.
- **pre-push** → `pnpm typecheck` : aucun push avec une erreur de types.

La logique métier est couverte par des tests unitaires ([eligibility](src/lib/eligibility.test.ts), [centers](src/lib/centers.test.ts), [opening-hours](src/lib/opening-hours.test.ts)) : ce sont les trois endroits où une erreur silencieuse enverrait quelqu'un devant une porte close ou lui dirait à tort qu'il ne peut pas donner.

## Contenus couverts

| Réf. | Section            | Où                                                                             | Traitement                                                                    |
| ---- | ------------------ | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| C1   | Pourquoi donner    | [why-donate.tsx](src/components/sections/why-donate.tsx)                       | Seule grande surface rouge de la page, message ancré sur le contexte béninois |
| C2   | Qui peut donner    | [eligibility-simulator.tsx](src/components/sections/eligibility-simulator.tsx) | Synthèse des trois critères **avant** le test, valeurs lues sur le domaine    |
| C3   | Test d'éligibilité | [lib/eligibility.ts](src/lib/eligibility.ts)                                   | 3 étapes, 3 statuts, motifs cumulables, logique pure et testée                |
| C4   | Déroulement du don | [donation-journey.tsx](src/components/sections/donation-journey.tsx)           | 4 étapes chronométrées, durée totale calculée à partir des étapes             |
| C5   | Préparation au don | [preparation.tsx](src/components/sections/preparation.tsx)                     | Avant / pendant / après, y compris les réactions possibles                    |
| C6   | Où donner          | [donation-centers.tsx](src/components/sections/donation-centers.tsx)           | 12 centres (un par département), recherche + 3 filtres, fiche détaillée       |
| C7   | État des réserves  | [blood-reserve.tsx](src/components/sections/blood-reserve.tsx)                 | Niveau porté par le libellé autant que par la couleur                         |
| C8   | FAQ & idées reçues | [faq.tsx](src/components/sections/faq.tsx)                                     | 14 questions formulées comme on se les pose, objections locales incluses      |

## Partis pris de conception

Le projet s'est d'abord appelé HemoLink, le nom proposé comme exemple dans le brief. Il évoque le sang et le lien, mais désigne surtout ce qui est donné, plutôt que la raison pour laquelle on donne.

Savethem — « sauvez-les » — prend le parti inverse : le nom exprime pourquoi le site existe. La page, elle, explique comment comprendre le don et prendre la décision de donner.

Le choix se prolonge dans l'identité visuelle : le S est formé de deux bras qui se tendent l'un vers l'autre. Le symbole évoque ainsi l'entraide et le geste humain, plutôt qu'une injonction à donner.

**L'ordre des sections suit les questions du visiteur, pas la numérotation du brief.**
Pourquoi j'irais → à quoi m'attendre → puis-je donner → comment me préparer → où aller → est-ce utile maintenant → et mes doutes. Le déroulement du don passe volontairement **avant** le simulateur : savoir ce qui va se passer désamorce l'appréhension avant qu'on demande à quelqu'un son âge et son poids.

**Le simulateur ne demande jamais une information inutile.**
Trois étapes, et le sexe uniquement si la personne a déjà donné — il ne sert qu'à choisir entre 3 et 4 mois de délai. Trois statuts distincts plutôt qu'un booléen : « revenez le 12 mars » n'est pas un refus, et le ton de l'interface en tient compte.

**Trouver un centre est traité comme une tâche, pas comme un contenu à lire.**
Recherche libre, filtre ville, type de don, ouverture immédiate ; compteur de résultats dans une région `aria-live` ; état vide avec une sortie. Le répertoire suit le maillage administratif du Bénin — un centre par département — pour que personne ne soit sans point d'entrée. Pas de code postal : ici on se repère au quartier et à un point de référence.

**Une seule grande surface rouge.**
Le rouge est la couleur de l'identité et de l'action, pas du danger. Il est attribué à « Pourquoi donner », section émotionnelle. Les réserves restent sur fond blanc : le rouge y basculerait vers l'anxiogène. Un résultat d'éligibilité positif est vert, un blocage est neutre, une attente est ambrée.

**Le statut ouvert / fermé est calculé côté client.**
Il dépend de l'heure courante : le calculer au rendu serveur le figerait au moment du build. Un état intermédiaire explicite couvre le premier rendu, plutôt qu'un faux « fermé ».

**Rassurer sans nier.**
Le site ne promet pas qu'il ne se passera rien après le don. Il nomme les réactions possibles et la conduite à tenir, et rappelle que seul l'entretien médical fait foi. Pas de témoignages : dans un contexte de santé, la réassurance passe par la transparence, pas par une promesse d'expérience parfaite.

**Les animations ne rendent jamais le contenu tributaire du JavaScript.**
Le réflexe habituel — masquer en CSS, révéler au scroll — laisse une page blanche si le script ne s'exécute pas. Sur un site dont la fonction est d'informer quelqu'un sur sa santé, c'est inacceptable. Le schéma est donc inversé : rien n'est masqué par défaut, un script inline pose `data-motion` sur `<html>` avant la première peinture, et lui seul active les états initiaux. Sans JS, la page reste intégralement lisible ; un minuteur désarme au bout de 2,5 s si GSAP ne charge jamais.

Les sections ne connaissent que trois attributs — `data-reveal`, `data-reveal-group`, `data-reveal-bar` — et n'importent jamais GSAP : elles restent des composants serveur, et la bibliothèque est remplaçable sans les toucher. Réservé au contenu éditorial statique ; les résultats filtrés et le résultat du simulateur en sont exclus, faute de déclencheur qui viendrait les révéler.

**Accessibilité traitée pendant, pas après.**
Focus déplacé entre les étapes du simulateur, résultats annoncés en `role="status"`, compteur de résultats en `aria-live`, niveaux de réserve jamais portés par la seule couleur, token `border-strong` (3.25:1) sur tous les champs pour satisfaire WCAG 1.4.11, et aucune opacité sous 90 % sur la surface rouge.


## Méthodologie IA

Le détail des prompts, des arbitrages et des ajustements manuels est documenté dans [PROMPTS.md](PROMPTS.md).
