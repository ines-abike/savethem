# Savethem

Landing page informative sur le don de sang, réalisée dans le cadre du **Figma to Code Challenge — Édition 4** (« Un sujet, une IA, votre instinct »).

L'objectif : qu'un visiteur qui n'a jamais donné reparte avec trois certitudes — **son éligibilité**, **où aller**, et **comment ça se passe**.

> ⚕️ Les règles d'éligibilité implémentées sont simplifiées pour les besoins du challenge. Seul un entretien médical professionnel peut confirmer l'aptitude au don.

## Stack

| Choix                | Version | Pourquoi                                                                     |
| -------------------- | ------- | ---------------------------------------------------------------------------- |
| Next.js (App Router) | 16      | Rendu statique, bon SEO pour une page informative, DX solide                 |
| React                | 19      | —                                                                            |
| TypeScript           | 5       | `strict` activé, types métier centralisés dans `src/types`                   |
| Tailwind CSS         | 4       | Design tokens en CSS natif (`@theme`), identité visuelle 100 % custom        |
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

| Commande            | Effet                                              |
| ------------------- | -------------------------------------------------- |
| `pnpm dev`          | Serveur de développement (Turbopack)               |
| `pnpm build`        | Build de production                                |
| `pnpm start`        | Sert le build de production                        |
| `pnpm lint`         | ESLint                                             |
| `pnpm lint:fix`     | ESLint avec correction automatique                 |
| `pnpm format`       | Prettier en écriture                               |
| `pnpm format:check` | Prettier en vérification                           |
| `pnpm typecheck`    | `tsc --noEmit`                                     |
| `pnpm check`        | Typecheck + lint + format check (la porte qualité) |

## Structure

```
src/
├── app/                  # App Router : layout, page, styles globaux
├── components/
│   ├── ui/               # Primitives réutilisables (bouton, carte, accordéon…)
│   ├── layout/           # Header, footer, navigation
│   └── sections/         # Sections de la landing page (C1 → C8)
├── data/                 # Données statiques : centres, réserves, FAQ, étapes
├── hooks/                # Hooks React partagés
├── lib/                  # Logique métier pure
│   ├── eligibility.ts    # Simulateur d'éligibilité (C3)
│   └── utils.ts          # Helper `cn` (clsx + tailwind-merge)
└── types/                # Types métier partagés
```

La logique métier (éligibilité, filtrage des centres, calcul des horaires d'ouverture) vit dans `src/lib` sous forme de fonctions pures, sans dépendance à React — elle reste ainsi lisible et testable indépendamment de l'UI.

## Qualité du code

Deux hooks Git protègent la branche :

- **pre-commit** → `lint-staged` : ESLint `--fix --max-warnings=0` puis Prettier sur les fichiers stagés.
- **pre-push** → `pnpm typecheck` : aucun push avec une erreur de types.

## Contenus couverts

| Réf. | Section            | Statut                  |
| ---- | ------------------ | ----------------------- |
| C1   | Pourquoi donner    | À venir                 |
| C2   | Qui peut donner    | À venir                 |
| C3   | Test d'éligibilité | Logique métier en place |
| C4   | Déroulement du don | À venir                 |
| C5   | Préparation au don | À venir                 |
| C6   | Où donner          | À venir                 |
| C7   | État des réserves  | À venir                 |
| C8   | FAQ & idées reçues | À venir                 |

## Méthodologie IA

Le détail des prompts, des arbitrages et des ajustements manuels est documenté dans [PROMPTS.md](PROMPTS.md).
