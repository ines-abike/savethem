"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, MapPin, Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NavLink {
  href: string;
  label: string;
}

/** Ce qui peut recevoir le focus à l'intérieur du panneau. */
const FOCUSABLE = "a[href], button:not([disabled])";

/**
 * Menu de navigation mobile, en plein écran.
 *
 * Seul îlot client de l'en-tête : le logo, la navigation desktop et le CTA
 * restent rendus statiquement. Isoler l'interactivité ici évite de faire
 * basculer tout l'en-tête côté client pour quatre ancres.
 *
 * Le panneau part du bas de l'en-tête plutôt que du haut de la fenêtre. Le
 * recouvrir entièrement obligerait à dupliquer un bouton de fermeture à
 * l'intérieur ; en laissant la barre visible, c'est le même bouton qui ouvre
 * et ferme, et son icône qui pivote de l'un à l'autre.
 *
 * Monté en permanence plutôt que rendu conditionnellement. Un
 * `{open && <div/>}` disparaît du DOM à la fermeture : la transition de
 * sortie n'a jamais lieu, et il faudrait retarder le démontage à la main. Ici
 * c'est `visibility` qui fait le travail — animable, elle reste `visible`
 * pendant toute la durée du fondu sortant, puis bascule d'un coup.
 *
 * Contrepartie : les liens existent dans le DOM même fermés, d'où `inert`,
 * qui les retire de l'ordre de tabulation et de l'arbre d'accessibilité.
 */
export function MobileNav({ links }: { links: readonly NavLink[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    // Après Échap ou un clic sur le bouton, le focus doit revenir sur le
    // déclencheur. Après un clic sur un lien, non : le focus suit l'ancre.
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close(true);
        return;
      }

      /*
       * Piège au clavier.
       *
       * Le panneau masque la page sans la rendre inerte : sans ça, la
       * tabulation quitterait le menu pour parcourir un contenu invisible,
       * et le focus disparaîtrait de l'écran — §12 l'interdit explicitement.
       *
       * Le bouton de bascule fait partie du cycle : il est visible au-dessus
       * du panneau et sert de fermeture. L'ordre naturel du DOM le place
       * avant les liens, il ne reste donc que les deux extrémités à recoudre.
       */
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      const toggle = toggleRef.current;
      if (!panel || !toggle) return;

      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      const last = focusables.at(-1);
      if (!last) return;

      if (event.shiftKey && document.activeElement === toggle) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        toggle.focus();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      // Le bouton gère lui-même la bascule : l'intercepter ici le ferait
      // fermer puis rouvrir dans le même geste.
      if (toggleRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      close(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  // Le premier lien reçoit le focus à l'ouverture : sans ça, la tabulation
  // repartirait du bouton et traverserait la page avant d'atteindre le menu.
  useEffect(() => {
    if (open) firstLinkRef.current?.focus();
  }, [open]);

  /*
   * Repli vers la navigation desktop.
   *
   * Sans ça, agrandir la fenêtre menu ouvert laisserait un état vrai derrière
   * un panneau que `lg:hidden` a fait disparaître : le prochain appui sur le
   * bouton, une fois revenu en mobile, fermerait au lieu d'ouvrir.
   */
  useEffect(() => {
    const query = window.matchMedia("(min-width: 64rem)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        // 44 px : cible tactile confortable au doigt (§18).
        className={cn(
          "-mr-2 flex size-11 shrink-0 items-center justify-center lg:hidden",
          "cursor-pointer rounded-full text-ink transition-colors hover:bg-surface",
        )}
      >
        {/*
          Les deux icônes sont superposées et pivotent l'une vers l'autre.
          Un rendu conditionnel produirait une substitution sèche, en décalage
          avec l'ouverture du panneau.
        */}
        <span className="relative flex size-6 items-center justify-center">
          <Menu
            aria-hidden="true"
            className={cn(
              "absolute size-6 transition-[opacity,transform] duration-200 ease-out",
              open ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
            )}
          />
          <X
            aria-hidden="true"
            className={cn(
              "absolute size-6 transition-[opacity,transform] duration-200 ease-out",
              open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
            )}
          />
        </span>

        <span className="sr-only">{open ? "Fermer le menu" : "Menu"}</span>
      </button>

      <div
        ref={panelRef}
        id={panelId}
        inert={!open}
        data-open={open}
        className={cn(
          /*
           * `absolute`, pas `fixed`.
           *
           * L'en-tête porte `backdrop-blur-sm`, et un `backdrop-filter` fait
           * de l'élément le bloc conteneur de ses descendants en position
           * fixe. Un `fixed top-16 bottom-0` s'y résolvait contre une boîte
           * de 64 px de haut — hauteur finale nulle, panneau invisible.
           *
           * En `absolute`, la référence est la même (l'en-tête est
           * positionné), mais elle est assumée : `top-full` part sous la
           * barre et la hauteur est donnée explicitement. Le panneau suit
           * l'en-tête collant, ce qui est exactement le comportement voulu.
           */
          "group absolute inset-x-0 top-full z-40 h-[calc(100dvh-4rem)] lg:hidden",
          "bg-background",
          /*
           * Le défilement de la page n'est pas verrouillé, `overscroll-contain`
           * empêchant simplement le geste de se propager derrière le panneau.
           *
           * Un verrou sur `body` serait actif au moment précis du clic sur un
           * lien : le navigateur poserait le fragment dans l'URL mais ne
           * pourrait pas défiler, et l'ancre n'arriverait jamais. Cette
           * navigation-là est déjà réglée en CSS — `scroll-behavior: smooth`
           * et `scroll-mt-20` — et la réécrire en JavaScript pour contourner
           * un verrou dont on n'a pas besoin serait un mauvais échange.
           */
          "overflow-y-auto overscroll-contain",
          "transition-[opacity,visibility] duration-200 ease-out",
          "invisible opacity-0",
          "data-[open=true]:visible data-[open=true]:opacity-100",
        )}
      >
        <nav
          aria-label="Menu principal"
          className="flex min-h-full flex-col px-6 pt-6 pb-10"
        >
          {/*
            Le contenu monte légèrement pendant que le fond apparaît. Déplacer
            tout le panneau donnerait un mouvement lourd à pleine hauteur ;
            décaler l'intérieur suffit à donner une direction à l'ouverture.
          */}
          <ul
            className={cn(
              "flex flex-col divide-y divide-border",
              "translate-y-3 transition-transform duration-300 ease-out",
              "group-data-[open=true]:translate-y-0",
            )}
          >
            {links.map((link, index) => (
              <li key={link.href}>
                <a
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  onClick={() => close(false)}
                  className={cn(
                    "flex min-h-14 items-center text-xl font-semibold",
                    "text-ink transition-colors hover:text-primary",
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/*
            Les deux tâches principales (§18) sont réunies ici. « Vérifier »
            quitte la barre sur mobile, où le logo et un bouton pleine
            largeur ne tiennent pas côte à côte ; elle reste atteignable en
            un geste depuis le hero, qui est le premier écran.

            En bas du panneau (`mt-auto`) : c'est là que le pouce arrive.
          */}
          <div
            className={cn(
              "mt-auto flex flex-col gap-3 pt-10",
              "translate-y-3 transition-transform delay-75 duration-300 ease-out",
              "group-data-[open=true]:translate-y-0",
            )}
          >
            <ButtonLink
              href="#puis-je-donner"
              size="lg"
              onClick={() => close(false)}
              className="w-full"
            >
              Vérifier mon éligibilité
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>

            <ButtonLink
              href="#ou-donner"
              variant="secondary"
              size="lg"
              onClick={() => close(false)}
              className="w-full"
            >
              <MapPin aria-hidden="true" className="size-4" />
              Trouver un centre
            </ButtonLink>
          </div>
        </nav>
      </div>
    </>
  );
}
