"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FALLBACK_TIMER_KEY } from "./reveal-gate";

gsap.registerPlugin(ScrollTrigger);

/*
 * Réglages du mouvement.
 *
 * 16 px et 0,55 s : assez pour que l'œil enregistre une arrivée, trop peu
 * pour qu'on ait à attendre la fin. Une page qui doit se lire vite ne peut
 * pas faire patienter son lecteur à chaque bloc.
 *
 * `top 88%` déclenche quand le bloc a franchi le bas de l'écran d'environ un
 * huitième : le mouvement est terminé quand le regard arrive dessus, au lieu
 * de commencer sous ses yeux.
 */
const DISTANCE = 16;
const DURATION = 0.55;
const STAGGER = 0.08;
const EASE = "power2.out";
const START = "top 88%";

/*
 * Remplissage des jauges.
 *
 * Plus long qu'une arrivée de bloc : ici le mouvement **est** l'information —
 * on doit voir la barre s'arrêter à sa hauteur, et comparer les huit groupes
 * entre eux. Le retard laisse la carte se poser avant que sa jauge parte,
 * sans quoi les deux mouvements se superposent et aucun ne se lit.
 */
const BAR_DURATION = 0.9;
const BAR_DELAY = 0.15;

/**
 * Contrôleur unique des révélations au défilement.
 *
 * Un seul composant client monté dans le layout, plutôt qu'un wrapper autour
 * de chaque section : les sections restent des composants serveur et
 * n'importent jamais GSAP. Elles se contentent de deux attributs déclaratifs.
 *
 *   `data-reveal`        — l'élément apparaît d'un bloc
 *   `data-reveal-group`  — ses enfants directs apparaissent en cascade
 *   `data-reveal-bar`    — la barre se remplit depuis la gauche
 *
 * Corollaire : ne **pas** imbriquer un `data-reveal` dans un groupe. Les deux
 * sélecteurs ci-dessous doivent rester le miroir exact de ceux de
 * `globals.css` — un élément masqué là-bas que GSAP ne cible pas ici
 * resterait invisible pour de bon.
 *
 * À réserver au contenu éditorial statique. Le poser sur du contenu qui
 * apparaît après coup — résultats filtrés, résultat du simulateur — le
 * masquerait sans que rien ne vienne jamais le révéler.
 */
export function RevealController() {
  useEffect(() => {
    const root = document.documentElement;

    // Le contrôleur a pris la main : le garde-fou n'a plus lieu d'être.
    clearTimeout(
      (window as unknown as Record<string, number>)[FALLBACK_TIMER_KEY],
    );

    /*
     * Non armé signifie soit mouvement refusé, soit garde-fou déjà déclenché.
     * Dans les deux cas le contenu est visible : l'animer maintenant le
     * ferait disparaître pour le faire revenir.
     */
    if (root.dataset.motion !== "armed") return;

    const mm = gsap.matchMedia();

    /*
     * `matchMedia` plutôt qu'un test ponctuel : si la préférence système
     * change en cours de session, GSAP défait ses propres animations.
     */
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const reveal = (
        targets: HTMLElement | HTMLElement[],
        trigger: HTMLElement,
        stagger = 0,
      ) =>
        /*
         * `fromTo` et non `from` : `from` prend la valeur **courante** comme
         * état d'arrivée, or le CSS a déjà mis ces éléments à `opacity: 0`.
         * L'animation irait donc de 0 vers 0 et rien ne réapparaîtrait. Ici
         * l'arrivée est déclarée, et les styles en ligne posés par GSAP
         * l'emportent ensuite sur la règle CSS.
         */
        gsap.fromTo(
          targets,
          { opacity: 0, y: DISTANCE },
          {
            opacity: 1,
            y: 0,
            duration: DURATION,
            ease: EASE,
            stagger,
            // `once` : on ne rejoue pas en remontant. Une page qu'on relit ne
            // doit pas se remettre à bouger.
            scrollTrigger: { trigger, start: START, once: true },
          },
        );

      gsap.utils
        .toArray<HTMLElement>("[data-reveal]")
        .forEach((el) => reveal(el, el));

      gsap.utils
        .toArray<HTMLElement>("[data-reveal-group]")
        .forEach((group) =>
          reveal(
            gsap.utils.toArray<HTMLElement>(group.children),
            group,
            STAGGER,
          ),
        );

      /*
       * Remplissage des jauges.
       *
       * Chaque barre reçoit sa propre animation, y compris quand plusieurs
       * partagent un déclencheur. Un `stagger` collectif supposerait de les
       * regrouper d'abord, et une barre oubliée par ce regroupement resterait
       * à `scaleX(0)` — donc invisible pour de bon. Ici, aucune barre ne peut
       * être orpheline.
       */
      const rank = new Map<Element, number>();

      gsap.utils.toArray<HTMLElement>("[data-reveal-bar]").forEach((bar) => {
        /*
         * Le groupe déclenche quand il y en a un : les huit jauges partent
         * ensemble, ce qui les rend comparables. Déclenchée chacune à son
         * propre passage, la dernière ligne se remplirait bien après que le
         * regard a quitté la première.
         */
        const trigger = bar.closest<HTMLElement>("[data-reveal-group]") ?? bar;
        const index = rank.get(trigger) ?? 0;
        rank.set(trigger, index + 1);

        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration: BAR_DURATION,
            ease: EASE,
            delay: BAR_DELAY + index * STAGGER,
            scrollTrigger: { trigger, start: START, once: true },
          },
        );
      });
    });

    /*
     * ScrollTrigger fige les positions de déclenchement au calcul. Or la page
     * change de hauteur en cours de route : accordéon de la FAQ, filtres du
     * répertoire qui allongent ou raccourcissent la liste des centres.
     *
     * Sans recalcul, un bloc situé plus bas peut voir son point de
     * déclenchement passer sous le bas du document — il ne se déclenche alors
     * jamais et **reste invisible**. C'est le seul scénario où ces animations
     * pourraient masquer de l'information pour de bon, d'où l'observateur.
     *
     * Le recalcul est différé plutôt qu'immédiat : `refresh()` peut lui-même
     * modifier la mise en page, ce qui redéclencherait l'observateur en
     * boucle. Le report casse le cycle et regroupe au passage les
     * redimensionnements rapprochés.
     */
    let pending: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      clearTimeout(pending);
      pending = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    observer.observe(document.body);

    return () => {
      clearTimeout(pending);
      observer.disconnect();
      mm.revert();
    };
  }, []);

  return null;
}
