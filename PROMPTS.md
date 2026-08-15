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
Brief complet du projet transmis à l'IA, suivi de : initialiser le projet en TypeScript / Next.js / Tailwind CSS, mettre en place ESLint, Husky, Prettier et les outils permettant de contrôler la qualité du code avant de pousser ; organiser le projet ; initialiser un dépôt GitHub ; vérifier que tout fonctionne.

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

### 3 — Cadrage produit et design system

**Prompt (résumé)**
Fourniture d'un document de cadrage produit/UX complet (benchmark EFS, Red Cross, Lifeblood, NHS ; principes UX ; architecture narrative ; palette ; typographie), déposé dans `CLAUDE.md` pour être chargé à chaque session. Consigne : en prendre connaissance et l'enregistrer.

**Arbitrage de méthode**
Le document a été placé dans `CLAUDE.md` plutôt que dans une mémoire de l'assistant, précisément parce que `CLAUDE.md` est versionné et rechargé automatiquement : une copie en mémoire aurait divergé silencieusement. `CLAUDE.md` fait donc foi.

**Incohérences détectées dans le document et corrigées**

Le document demandait explicitement (§20) de challenger les décisions avant de les valider. Six points ont été relevés :

1. **Nom résiduel.** Le document parlait encore de « HemoLink », le nom-exemple du brief. Renommé en Savethem (15 occurrences). Effet de bord non trivial : la piste conceptuelle du §9 reposait sur le mot _Link_ — elle ne tenait plus. Remplacée par le concept de **trajectoire** (« une poche de sang est le début d'un trajet qui va jusqu'à quelqu'un »), qui découle du nouveau nom et reste fidèle à l'intention d'origine : éviter un univers centré sur le sang.
2. **Simulateur incohérent avec lui-même.** §26.4 listait 4 entrées obligatoires (âge, poids, sexe, dernier don) mais §16 n'affichait que 3 étapes, sans le sexe — or c'est lui qui détermine le délai (3 mois / 4 mois). Résolu sans ajouter d'étape : le sexe n'est demandé **que si la personne a déjà donné**, puisqu'il est inutile sinon. Cohérent avec la consigne « ne pas demander des informations inutiles ».
3. **Contraste de bordure insuffisant.** Les ratios WCAG de toute la palette ont été calculés, pas estimés. Tout passe AA (ink 17.72:1, primary 5.62:1, success 5.02:1, muted 4.83:1). Une seule exception : `border #E4E4E7` à **1.27:1**, sous le seuil de 3:1 exigé par WCAG 1.4.11 dès qu'une bordure délimite un composant — et le simulateur est un formulaire. Ajout d'un token `border-strong #8E8E96` (3.25:1 sur blanc, 3.06:1 sur `surface`) réservé aux champs et contrôles.
4. **Statut ouvert/fermé et rendu statique.** Le statut d'un centre dépend de l'heure courante ; le calculer au rendu serveur produirait une valeur figée au build et un _hydration mismatch_ côté client. Décidé : calcul après montage client, avec un état intermédiaire explicite plutôt qu'un faux « fermé ».
5. **Dark mode non tranché.** Le design system ne définit qu'une palette claire, mais le scaffolding Next.js embarquait un bloc `prefers-color-scheme: dark` — une page à moitié cassée pour un visiteur en thème sombre. Décision : thème clair uniquement, bloc retiré.
6. **Deux candidates pour la section rouge pleine.** §26.4 proposait « Pourquoi donner » _ou_ « État des réserves », §26.6 plafonnant le rouge à ~10 %. Les deux auraient dilué l'impact. Retenu : « Pourquoi donner ». Les réserves restent sur fond blanc — le rouge y basculerait vers l'anxiogène que l'insight 06 cherche justement à éviter.

**Décisions prises par le porteur du projet**

- **Illustrations en SVG codés à la main**, aucun asset externe. Garantit l'originalité exigée par le brief, au prix assumé de renoncer aux figures humaines détaillées : l'humain passera par la copie et le rythme.
- **Pas de dark mode.**
- **Section rouge = « Pourquoi donner ».**

**Ajustements manuels sur la production de l'IA**

- Le document fourni avait écrasé le `CLAUDE.md` d'origine, qui importait `AGENTS.md` (conventions Next.js 16, générées par `next dev` et différentes des données d'entraînement du modèle). Import restauré en fin de fichier.
- Le focus visible utilisait initialement `currentColor`, ce qui l'aurait rendu invisible sur les grandes surfaces rouges. Remplacé par un ancrage sur `ink`, avec inversion explicite sur fond primaire.

**Limites rencontrées**

- Le document de cadrage était cohérent sur le fond mais contenait plusieurs contradictions internes qu'une lecture rapide aurait laissé passer — et qu'une IA qui se contente d'exécuter n'aurait pas relevées. Le simulateur aurait notamment été construit à 3 entrées, donc avec un calcul de délai faux.

---

_(Sections suivantes à compléter : contenus rédactionnels, sections C1→C8, répertoire des centres, accessibilité, responsive.)_
