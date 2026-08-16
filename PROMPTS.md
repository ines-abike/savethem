# Méthodologie IA

Ce document retrace la façon dont l'IA a été utilisée sur Savethem : les prompts significatifs, ce qui a été repris tel quel, ce qui a été corrigé à la main, et les limites rencontrées.

L'objectif est l'honnêteté intellectuelle plutôt que l'exhaustivité : les échanges anodins ne sont pas consignés.

## Outils sollicités

| Outil                                  | Phase                            | Usage                                                                                                       |
| -------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| ChatGPT (interface web)                | Amont, avant toute ligne de code | Cadrage produit, benchmark UX, direction artistique, rédaction itérative de `CLAUDE.md`, génération du logo |
| Claude Code (Opus 5), extension VSCode | Exécution                        | Initialisation du projet, outillage qualité, logique métier, design system, sections, rédaction             |

### Ce que ce découpage a produit

Le cadrage a été écrit dans un outil, exécuté dans un autre. Conséquence
observée : le document de cadrage est arrivé chez le modèle qui allait le
mettre en œuvre comme un texte **externe**, pas comme sa propre production.

C'est ce qui a rendu la relecture critique possible. Six contradictions
internes ont été relevées à la lecture (section 5), dont une qui aurait
faussé le simulateur d'éligibilité — un modèle qui relit un document qu'il
vient lui-même d'écrire n'a aucune raison d'en contester les prémisses.

Cet effet n'est pas revendiqué comme une stratégie décidée à l'avance : il est
constaté après coup, et c'est à ce titre qu'il est consigné ici.

---

## Séquence des prompts

### 1 — Cadrage produit, benchmark et direction artistique (ChatGPT)

Toute la phase de réflexion précède l'ouverture de l'éditeur. Aucun code
n'est écrit à ce stade.

**Prompt (résumé)**
Discussion ouverte sur le sujet : que doit être une landing page de don du
sang qui ne ressemble pas à une landing page de don du sang. Puis benchmark
des références du domaine (EFS, American Red Cross, Australian Red Cross
Lifeblood, NHS Blood and Transplant), puis direction artistique — palette,
typographie, registre visuel, ce qu'il faut éviter.

**Méthode du benchmark**
Mixte : les sites ont été ouverts et regardés de première main, ChatGPT
servant à structurer la comparaison et à en extraire des patterns
réutilisables plutôt qu'à décrire des sites qu'il n'avait pas sous les yeux.
Cette précaution laisse une trace dans le document final, qui interdit
explicitement d'attribuer un score à une référence « sans observation
vérifiée de la version consultée » (§5).

**Ce que l'échange a produit**

- Les 7 insights UX (§6), dont celui qui structure tout le reste :
  l'utilisateur ne cherche pas à donner, il cherche d'abord à savoir **s'il
  peut** donner.
- L'architecture narrative ordonnée par les questions mentales du
  primo-donneur plutôt que par les sections du brief (§27).
- La palette complète avec tokens nommés et usages (§26.2), la règle
  sémantique « White apaise. Ink informe. Red fait agir. Green rassure. Gray
  structure. » (§26.3), et la règle de rythme visuel des grandes surfaces
  rouges (§26.4).
- La décision de ne pas mettre de témoignages (§28) — dans un contexte de
  santé, la réassurance passe par la transparence, pas par une promesse
  d'expérience parfaite.

**Rédaction de `CLAUDE.md`**
Co-écrit par itérations, section par section : orientation donnée, rédaction
proposée, correction, passage à la suivante. Le document fait environ
40 000 caractères à la remise et constitue le cadrage produit du projet.

**Arbitrage de méthode**
Le fichier est nommé `CLAUDE.md` et versionné, plutôt que collé dans une
mémoire d'assistant : il est ainsi rechargé à chaque session, relisible par
un humain, et son historique est traçable dans git. Une copie en mémoire
aurait divergé silencieusement du texte de référence.

**Limites rencontrées**

- Le modèle qui rédige un cadrage ne le contredit pas. Les six incohérences
  relevées en section 5 étaient toutes présentes dans le document livré à la
  fin de cette phase, et aucune n'a été signalée pendant sa rédaction.
- La cohérence locale d'une section masque l'incohérence globale : §26.4
  listait quatre entrées obligatoires pour le simulateur, §16 n'en affichait
  que trois. Chaque section, prise isolément, était défendable.

---

### 2 — Génération du logo (ChatGPT)

**Hors plan initial.** Aucun logo n'était prévu : le brief n'en demande pas,
et le cadrage n'en parle pas. L'idée est venue en fin de phase amont.

**Prompt (résumé)**
Description d'un symbole formant la lettre **S** à partir de deux bras en
rotation de 180°, chacun terminé par une main tendue vers l'autre — le lien
entre deux personnes et le sens du geste. Rouge de la marque, mot-signe
« avethem » à la suite. Registre humain, pas de croix médicale, pas de
goutte de sang, pas de seringue.

**Deux itérations** ont été nécessaires pour obtenir la version retenue.

**Ce que l'IA a produit**
Deux fichiers PNG : une version à mot-signe noir pour les fonds clairs, une
version à mot-signe blanc pour les fonds sombres, le symbole restant rouge
dans les deux cas.

**Ajustements manuels / arbitrages**

- **Retour au PNG après un essai de vectorisation.** Le passage en SVG a été
  demandé au modèle, précisément pour les bénéfices listés plus bas. Le
  résultat était inutilisable : formes déformées, courbes du symbole
  méconnaissables. Le PNG validé a donc été conservé, et il fait foi —
  décision documentée dans [logo.tsx](src/components/layout/logo.tsx).
- **Deux images plutôt qu'un filtre CSS.** Le mot-signe bascule du noir au
  blanc pendant que le symbole garde son rouge : aucun filtre ne produit
  cette double règle proprement.
- **Marges transparentes inégales.** Les deux fichiers ne portent pas le même
  vide à gauche (20 px contre 38 px). Sans correction, la marque du pied de
  page se serait décalée d'environ 7 px par rapport au paragraphe qu'elle
  surplombe. L'inset est annulé au rendu, variante par variante.

**Limites rencontrées**

- **Sortie raster, pas vectorielle.** Un logo généré est une image : il ne se
  recolore pas par token, ne s'anime pas, et pèse une centaine de kilo-octets
  là où un SVG équivalent en pèserait quelques-uns.
- **La conversion en SVG demandée au modèle a échoué.** Un modèle qui génère
  une image ne dispose pas du tracé qui l'a produite : il ne convertit pas, il
  redessine de mémoire. Sur une forme construite — deux bras en rotation de
  180° dont les courbes doivent se répondre exactement — la moindre dérive se
  voit, et elle s'est vue. Un vectoriseur dédié ou un redessin manuel dans un
  outil de dessin auraient été les bons instruments ; demander la conversion
  au générateur ne l'était pas.
- La contrainte raster est donc subie, pas choisie. Elle est absorbée côté
  rendu (deux fichiers, insets compensés, `next/image`) plutôt que contournée.
- Le concept de trajectoire (§9) ne passe donc pas par la marque, mais par
  les illustrations et les formes de la page.

---

### 3 — Initialisation et outillage

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

### 4 — Logique d'éligibilité

**Arbitrages sur l'algorithme de l'annexe**

- `checkEligibility` accepte une `referenceDate` injectable plutôt que d'appeler `new Date()` en dur : la fonction devient déterministe et testable.
- `addMonths` gère explicitement les débordements de fin de mois (un don le 31 janvier + 3 mois donne le 30 avril, pas le 1er mai). Le comportement natif de `Date.setMonth` était faux pour ce cas.
- Les dates sont ramenées à minuit avant comparaison : on raisonne en jours, pas en instants, sinon un don « du jour même » à 14 h donnerait un résultat différent d'un don à 9 h.
- Âge et poids peuvent être bloquants **simultanément** : le résultat renvoie une liste de motifs, pas un seul, pour éviter les corrections en cascade côté utilisateur.
- Trois statuts distincts (`eligible`, `not-eligible`, `eligible-later`) plutôt qu'un booléen : « revenez le 12 mars » n'est pas un refus, et le ton de l'interface doit pouvoir en tenir compte.

---

### 5 — Transmission du cadrage et design system

**Prompt (résumé)**
Le document issu de la section 1 est déposé dans `CLAUDE.md` pour être chargé à chaque session. Consigne : en prendre connaissance et l'enregistrer.

Le document arrive donc chez un modèle qui n'en est pas l'auteur, avec une consigne explicite héritée du cadrage lui-même (§20) : challenger les décisions avant de les valider.

**Incohérences détectées dans le document et corrigées**

Six points ont été relevés :

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

- Le document de cadrage était cohérent sur le fond mais contenait plusieurs contradictions internes qu'une lecture rapide aurait laissé passer. Le simulateur aurait notamment été construit à 3 entrées, donc avec un calcul de délai faux. Voir section 1 sur ce que le changement d'outil a rendu possible ici.
- Le passage d'un outil à l'autre a un coût : tout ce qui n'était pas dans le document écrit s'est perdu. Les raisons non consignées d'un arbitrage — pourquoi telle piste a été écartée pendant la phase amont — n'existent plus que dans la tête du porteur du projet.

---

### 6 — Données statiques et logique métier des centres

**Prompt (résumé)**
Produire les données statiques du site — centres, réserves, FAQ, parcours du
don, préparation, chiffres d'impact — et la logique de recherche et de statut
d'ouverture qui va avec.

**Ce que l'IA a produit**

- `opening-hours.ts` : statut ouvert / fermé, créneaux multiples par jour
  (pause déjeuner), prochaine ouverture sur sept jours glissants.
- `centers.ts` : recherche libre insensible aux accents, filtres cumulables.
- 59 tests Vitest sur les bornes d'âge, le débordement de fin de mois, la
  pause déjeuner et les combinaisons de filtres.

**Ajustements manuels / arbitrages**

- **`now` injecté partout**, jamais lu depuis l'horloge système à
  l'intérieur d'une fonction. C'est ce qui rend « ouvert maintenant » aussi
  testable que le reste — un filtre dépendant de l'heure serait sinon le seul
  comportement du site à ne pas être vérifiable.
- **Établissements volontairement fictifs.** Rattacher de faux horaires au nom
  d'un vrai centre de transfusion pourrait envoyer quelqu'un devant une porte
  close. Sur un sujet de santé, c'est le risque qu'on refuse de prendre. Deux
  tests verrouillent les garde-fous : domaines en `.example` (réservés par la
  RFC 2606) et numéros hors plage réelle.

**Limites rencontrées**

- La première version des numéros de téléphone était présentée comme
  appartenant à « la plage ARCEP réservée à la fiction ». L'affirmation était
  fausse une fois le site ancré au Bénin, où l'ARCEP française ne s'applique
  pas. Corrigée en documentant honnêtement le gabarit comme **une convention
  interne, pas une plage officiellement réservée**. Une justification
  plausible et bien formulée n'est pas une justification vérifiée.

---

### 7 — Vocabulaire visuel et primitives d'interface

**Prompt (résumé)**
Traduire le concept de trajectoire (§9) en formes réutilisables, puis
construire les primitives d'interface nécessaires aux sections.

**Ce que l'IA a produit**
Cinq formes SVG (arc, flux, confluence, halo, jalon), toutes en
`currentColor` et `aria-hidden`, et dix primitives : Button, Section, Badge,
StatusIndicator, Callout, Field, RadioGroup, Accordion, Dialog, Stepper.

**Arbitrages structurants**

- **`<dialog>` natif** pour la fiche centre : piège clavier, `Échap` et
  retour du focus obtenus gratuitement, zéro dépendance. Une modale
  réimplémentée à la main aurait coûté plus cher et fonctionné moins bien.
- **Radios natifs** sous le `RadioGroup` : la navigation aux flèches est
  offerte par le navigateur. L'apparence est refaite, le comportement non.
- **`StatusIndicator` porte toujours un libellé texte**, jamais la couleur
  seule (§12).
- **`Field` centralise le câblage `aria-describedby` / `aria-invalid`** : un
  champ correctement associé à son erreur ne dépend plus de la vigilance de
  celui qui l'écrit.
- **`useClientNow` via `useSyncExternalStore`** plutôt qu'un `setState` dans
  un effet : l'horloge est une source externe, avec un snapshot serveur
  distinct — c'est exactement ce que cette API décrit.

---

### 8 — Assemblage de la landing page

**Prompt (résumé)**
Assembler les neuf sections dans l'ordre narratif décidé au cadrage, en
traitant la recherche de centres comme une tâche et non comme un contenu.

**Ajustements manuels / arbitrages**

- **Le déroulement du don passe avant le simulateur.** Savoir ce qui va se
  passer désamorce l'appréhension avant qu'on demande à quelqu'un son âge et
  son poids. L'ordre du brief (C3 avant C4) est explicitement écarté.
- **Trois centres affichés d'entrée, pas douze.** Douze fiches d'un bloc
  noient la barre de filtres, qui est pourtant l'outil de la section.
- **Le compteur annonce « 12 trouvés, 3 affichés »**, jamais « 12 trouvés »
  seul : la seconde formulation est fausse pour qui ne voit pas la liste.
- **L'état vide est un écran à part entière**, avec un bouton de sortie.
  Sans lui, l'utilisateur reste devant une liste vide sans savoir quel filtre
  l'a produite.
- **Pas de menu burger.** La page est unique et chaque section se termine par
  une étape suivante ; un burger n'aurait dupliqué le défilement qu'au prix
  de JavaScript supplémentaire.

---

### 9 — Correctifs de contraste sur la surface rouge

Passe d'accessibilité menée après l'assemblage, sur la seule grande section
rouge.

**Ce qui a été trouvé**
`#C62828` ne contraste qu'à **5.62 : 1** avec le blanc pur. La marge au-dessus
du seuil AA est mince, et la transparence l'épuise vite :

```text
blanc/90 → 4.81:1  AA
blanc/85 → 4.43:1  échec
blanc/80 → 4.07:1  échec
blanc/60 → 2.86:1  échec
```

Trois éléments étaient sous le seuil : le surtitre (`/80`), le détail des
chiffres (`/75`) et la note de bas de section (`/60`).

**Ce que ça dit du réflexe corrigé**
Baisser l'opacité pour créer de la hiérarchie fonctionne sur un fond sombre —
`ink` tolère le blanc jusqu'à 50 %. Sur `primary`, le même geste casse
l'accessibilité. La règle a été inscrite dans `CLAUDE.md` §26.2 et
`SectionHeader` corrigé pour ne pas pouvoir réintroduire le défaut ailleurs.

**Corrigés dans la même passe**

- Un `<h2>` vide laissé par le `<dialog>` monté sans centre sélectionné.
- Une grille 2×2 bancale de la timeline au point de rupture `sm`.
- Le libellé du CTA d'en-tête, raccourci sous `sm` pour tenir à 390 px.

---

### 10 — Ancrage Bénin, marque et illustrations

**Prompt (résumé)**
Réancrer tout le contenu sur le Bénin, brancher les logos produits en phase 2,
et intégrer des illustrations.

**Ce que l'ancrage a changé**

- Un centre **par département**, soit les douze : le maillage administratif
  devient la structure du répertoire, personne n'est sans point d'entrée.
- Adresses au **quartier et au point de référence** (« carrefour Toyota, en
  face du stade ») plutôt qu'au code postal, qui n'existe pas ici.
- Message de la section rouge réécrit : quand le sang manque, c'est encore
  souvent à la famille du patient qu'on demande de trouver des donneurs. Plus
  juste, localement, que « votre don sauve des vies ».
- Indications de transfusion corrigées : enfants (anémie sévère liée au
  paludisme) et femmes (hémorragie de l'accouchement) plutôt que l'accident de
  la route, image trompeuse en Afrique de l'Ouest.
- FAQ complétée des objections réellement locales : matériel à usage unique,
  don familial de remplacement contre don bénévole, absence de rémunération
  comme mesure de sécurité transfusionnelle.

**Ce qu'on s'est interdit**
Aucune statistique nationale de collecte n'est avancée : faute de relevé daté
et sourçable pour le Bénin, fabriquer un chiffre de santé publique aurait
coûté plus en crédibilité qu'un cadrage assumé.

**Bugs trouvés et corrigés dans la même passe**

- `shapes.tsx` avait été placé dans `public/`, où un composant React n'est pas
  compilé et resterait téléchargeable en source. Les six imports visaient donc
  un chemin inexistant : **la page rendait une erreur 500**.
- `Section` passait `overflow-hidden`, qui crée un conteneur de défilement et
  neutralisait tout `position: sticky` en descendance — dont l'illustration de
  la FAQ. Remplacé par `overflow-clip`, qui découpe sans créer de scrollport.

**Illustrations : écart assumé par rapport au cadrage**
§30.1 décidait des SVG codés à la main, sans aucun asset externe. La page en
service utilise deux illustrations de banque (Storyset). L'écart est consigné
ici plutôt que passé sous silence : il donne des figures humaines qu'un tracé
manuel n'aurait pas produites, au prix d'un registre visuel que d'autres
projets peuvent utiliser aussi. **Arbitrage encore ouvert à la date de
rédaction** — soit remplacement par des formes propres, soit conservation avec
l'attribution qu'impose la licence.

---

### 11 — Relecture de conformité, page terminée

**Prompt (résumé)**
Reprendre le brief du challenge et confronter, point par point, ce qui est
réellement dans le dépôt : contenus obligatoires, fonctionnalités, livrables.

**Ce que la relecture a trouvé**

1. **Une mention obligatoire disparue par régression.** Le pied de page
   portait le rappel « seul un entretien médical fait foi » et la mention des
   données fictives. Une réécriture ultérieure a supprimé les deux **en
   laissant le commentaire qui affirmait les porter**. Le rappel n'existait
   donc plus que dans le résultat du simulateur : invisible pour qui ne fait
   pas le test, alors que le brief l'exige sur la page.
2. **C2 « Qui peut donner » n'existait pas comme contenu.** Les critères
   n'apparaissaient qu'en indication sous les champs du simulateur — donc
   jamais ensemble, et jamais avant de commencer. Ajout d'une synthèse en
   amont du test, dont les valeurs sont lues sur les constantes du domaine.
3. **Une durée de nouveau écrite en dur.** `TOTAL_DURATION_MINUTES` était
   calculée à partir des étapes pour qu'elles ne puissent pas diverger ; le
   badge affichait « environ une heure » en clair, et l'import était devenu
   mort. Le garde-fou existait, il n'était simplement plus branché.
4. **« Code postal » dans la recherche de centres**, plusieurs versions après
   la décision de n'en pas utiliser. Qui en saisissait un tombait sur l'état
   vide.
5. **README non tenu à jour** : le tableau des contenus annonçait encore huit
   sections « à venir » alors qu'elles étaient livrées.

**Ce que ça dit de la méthode**
Les cinq points ont un trait commun : ce sont des **écarts entre ce que le
code affirme et ce qu'il fait**. Aucun ne casse le build, aucun n'apparaît en
lisant un fichier isolé — trois d'entre eux sont même nés d'une réécriture
locale parfaitement correcte. Les commentaires d'intention, systématiques dans
ce projet, ont ici servi de détecteurs : c'est l'écart entre le commentaire et
le code en dessous qui a rendu la régression visible.

**Limite rencontrée**
Une relecture de conformité ne remplace pas un test manuel. Le rendu de 390 px
à 1440 px, la fluidité réelle de la navigation clavier et le comportement du
`<dialog>` sur mobile n'ont pas été vérifiés par cette passe et restent à
faire à l'œil, dans un navigateur.

---

## Ce que l'IA n'a pas fait

- **Les décisions produit.** L'ordre narratif, le refus des témoignages, le
  choix de la section rouge, l'ancrage béninois, le renoncement aux
  statistiques invérifiables : toutes ont été arbitrées par le porteur du
  projet, souvent contre une première proposition du modèle.
- **La vérification du réel.** Les sites du benchmark ont été ouverts et
  regardés ; les chiffres non sourçables ont été écartés à la main.
- **Le jugement sur ce qui manque.** Le modèle complète ce qu'on lui demande
  ; il ne signale pas spontanément qu'une section obligatoire du brief n'a
  jamais été écrite. Il a fallu lui redonner le brief et lui demander de
  confronter, ce qui est un acte de pilotage, pas une capacité de l'outil.
