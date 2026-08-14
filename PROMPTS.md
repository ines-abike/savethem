# Méthodologie IA

Ce document retrace la façon dont l'IA a été utilisée sur Savethem : les prompts significatifs, ce qui a été repris tel quel, ce qui a été corrigé à la main, et les limites rencontrées.

L'objectif est l'honnêteté intellectuelle plutôt que l'exhaustivité : les échanges anodins ne sont pas consignés.

## Outils sollicités

| Outil                                  | Usage                                                                  |
| -------------------------------------- | ---------------------------------------------------------------------- |
| Claude Code (Opus 5), extension VSCode | Initialisation du projet, outillage qualité, logique métier, rédaction |

_(Compléter au fur et à mesure : outils de design, de génération d'illustrations, etc.)_

---

## Séquence des prompts

### 1 — Initialisation et outillage

**Prompt (résumé)**
Brief complet du challenge transmis à l'IA, suivi de : initialiser le projet en TypeScript / Next.js / Tailwind CSS, mettre en place ESLint, Husky, Prettier et les outils permettant de contrôler la qualité du code avant de pousser ; organiser le projet ; initialiser un dépôt GitHub ; vérifier que tout fonctionne.

**Ce que l'IA a produit**

- Scaffolding `create-next-app` (Next 16, React 19, Tailwind 4, App Router, `src/`, alias `@/*`).
- Configuration Prettier avec `prettier-plugin-tailwindcss` (tri automatique des classes).
- Flat config ESLint enrichie : `eslint-plugin-jsx-a11y`, `eslint-config-prettier` en dernier pour désactiver les règles en conflit, règles TypeScript (`consistent-type-imports`, `no-unused-vars` avec préfixe `_`).
- Hooks Husky : `pre-commit` → lint-staged, `pre-push` → `tsc --noEmit`.
- Arborescence `src/` séparant `app`, `components` (ui / layout / sections), `data`, `hooks`, `lib`, `types`.
- Types métier (`src/types/index.ts`) et simulateur d'éligibilité (`src/lib/eligibility.ts`).

**Ajustements manuels / arbitrages**

- **Périmètre de l'outillage réduit.** L'IA proposait aussi commitlint + convention de commits. Écarté : sur un projet solo et court, la charge rituelle dépassait le bénéfice. On garde Prettier, ESLint, Husky et lint-staged.
- **Nom du projet.** `create-next-app` refuse les majuscules dans le nom npm ; le dossier `Savethem` a donc été scaffoldé dans un sous-dossier `savethem` puis remonté d'un niveau.
- **Polices retirées du scaffolding.** Les imports `Geist` / `Geist_Mono` par défaut ont été supprimés : la typographie fait partie de l'identité visuelle à créer, pas d'un thème hérité.
- **`globals.css` remis à plat.** Tokens neutres en attendant la direction artistique, plus deux ajouts non négociables au vu du brief : `:focus-visible` toujours visible, et respect de `prefers-reduced-motion`.

**Limites rencontrées**

- L'IA a d'abord lancé le scaffolding directement dans un dossier au nom capitalisé, ce qui a échoué sur une contrainte de nommage npm. Correction en un tour, mais l'erreur n'était pas anticipée.

---

### 2 — Logique d'éligibilité

**Arbitrages sur l'algorithme de l'annexe**

- `checkEligibility` accepte une `referenceDate` injectable plutôt que d'appeler `new Date()` en dur : la fonction devient déterministe et testable.
- `addMonths` gère explicitement les débordements de fin de mois (un don le 31 janvier + 3 mois donne le 30 avril, pas le 1er mai). Le comportement natif de `Date.setMonth` était faux pour ce cas.
- Les dates sont ramenées à minuit avant comparaison : on raisonne en jours, pas en instants, sinon un don « du jour même » à 14 h donnerait un résultat différent d'un don à 9 h.
- Âge et poids peuvent être bloquants **simultanément** : le résultat renvoie une liste de motifs, pas un seul, pour éviter les corrections en cascade côté utilisateur.
- Trois statuts distincts (`eligible`, `not-eligible`, `eligible-later`) plutôt qu'un booléen : « revenez le 12 mars » n'est pas un refus, et le ton de l'interface doit pouvoir en tenir compte.

---

_(Sections suivantes à compléter : identité visuelle, contenus rédactionnels, sections C1→C8, répertoire des centres, accessibilité, responsive.)_
