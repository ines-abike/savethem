import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Marque Savethem.
 *
 * Le symbole est un S formé de deux bras en rotation de 180°, chacun terminé
 * par une main tendue vers l'autre : le lien entre deux personnes et le flux
 * du don. Il n'est pas redessiné en SVG ici — les fichiers fournis font foi.
 *
 * Deux images plutôt qu'une seule recolorée : le mot-signe passe du noir au
 * blanc selon le fond alors que le symbole garde son rouge dans les deux cas.
 * Aucun filtre CSS ne produit cette bascule proprement.
 */
const VARIANTS = {
  light: { src: "/logos/logo-light.png", width: 600, inset: 20 },
  dark: { src: "/logos/logo-dark.png", width: 620, inset: 38 },
} as const;

/** Hauteur de toile commune aux deux fichiers. */
const CANVAS_HEIGHT = 230;

export function Logo({
  className,
  onDark = false,
  height = 40,
  alt = "Savethem",
}: {
  className?: string;
  /** Version à mot-signe blanc, pour les fonds sombres (pied de page). */
  onDark?: boolean;
  /** Hauteur de rendu en pixels, marges transparentes comprises. */
  height?: number;
  /**
   * Vide lorsque la marque est déjà nommée par son conteneur — typiquement un
   * lien porteur d'un `aria-label`, où un `alt` ferait doublon.
   */
  alt?: string;
}) {
  const variant = VARIANTS[onDark ? "dark" : "light"];
  const scale = height / CANVAS_HEIGHT;

  return (
    <Image
      src={variant.src}
      alt={alt}
      width={Math.round(variant.width * scale)}
      height={height}
      /*
       * Les deux fichiers portent des marges transparentes inégales à gauche
       * (20 px contre 38 px). Sans correction, le pied de page décalerait la
       * marque d'environ 7 px par rapport au paragraphe qu'elle surplombe. On
       * annule donc l'inset pour que le symbole affleure le bord du contenu.
       */
      style={{ marginLeft: -(variant.inset * scale) }}
      /*
       * L'en-tête est dans le premier écran : le chargement paresseux y ferait
       * apparaître la marque après coup. `priority` étant déprécié depuis
       * Next 16, la paire loading/fetchPriority le remplace.
       */
      loading={onDark ? "lazy" : "eager"}
      fetchPriority={onDark ? "auto" : "high"}
      className={cn("select-none", className)}
    />
  );
}
