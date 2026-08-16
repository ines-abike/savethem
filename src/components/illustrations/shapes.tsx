import { cn } from "@/lib/utils";

/**
 * Vocabulaire visuel de Savethem — concept de trajectoire (CLAUDE.md §9).
 *
 * Un jeu restreint de formes réutilisées d'une section à l'autre, plutôt
 * qu'une illustration par bloc : c'est la répétition qui produit la
 * cohérence, pas l'abondance.
 *
 * Règles communes :
 * - aucune imagerie médicale (croix, goutte, seringue) — §9 et §Direction
 *   visuelle les proscrivent explicitement ;
 * - tout est en `currentColor`, donc piloté par les tokens de couleur ;
 * - tout est `aria-hidden` : aucune information ne dépend de ces formes.
 */

interface ShapeProps {
  className?: string;
}

/** Attributs partagés : jamais annoncé, jamais atteignable au clavier. */
const decorative = {
  "aria-hidden": true,
  focusable: "false",
  role: "presentation",
} as const;

/**
 * Arc de trajectoire — la forme principale.
 *
 * Une courbe ample qui entre par un bord et ressort par un autre : elle
 * suggère un trajet qui continue au-delà du cadre, ce qui est exactement le
 * propos (« le don va jusqu'à quelqu'un »).
 */
export function TrajectoryArc({ className }: ShapeProps) {
  return (
    <svg
      {...decorative}
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
      className={cn("pointer-events-none", className)}
    >
      <path
        d="M -20 168 C 84 168 118 44 232 44 C 322 44 352 104 420 76"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * Flux — plusieurs trajectoires parallèles décalées.
 *
 * Même courbe répétée avec un décalage vertical et une opacité dégressive :
 * l'idée de circulation, sans jamais figurer de sang.
 */
export function FlowLines({
  className,
  lines = 5,
}: ShapeProps & { lines?: number }) {
  return (
    <svg
      {...decorative}
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
      className={cn("pointer-events-none", className)}
    >
      {Array.from({ length: lines }, (_, index) => (
        <path
          key={index}
          d="M -20 150 C 90 150 120 60 230 60 C 320 60 350 100 420 84"
          transform={`translate(0 ${index * 14 - (lines - 1) * 7})`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity={0.5 - Math.abs(index - (lines - 1) / 2) * 0.09}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/**
 * Confluence — plusieurs trajets qui convergent vers un point.
 *
 * Traduit « des donneurs dispersés, un patient » : c'est la forme réservée
 * aux moments où la page parle de l'impact collectif.
 */
export function Confluence({ className }: ShapeProps) {
  return (
    <svg
      {...decorative}
      viewBox="0 0 300 200"
      className={cn("pointer-events-none", className)}
    >
      {[36, 76, 116, 156, 196].map((y, index) => (
        <path
          key={y}
          d={`M -10 ${y} C 90 ${y} 140 ${100 + (y - 116) * 0.18} 236 100`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity={0.25 + index * 0.06}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <circle cx="240" cy="100" r="4" fill="currentColor" />
    </svg>
  );
}

/**
 * Halo — masse organique douce, pour teinter un fond sans le charger.
 *
 * Volontairement asymétrique : un cercle parfait aurait un rendu
 * institutionnel, c'est l'irrégularité qui fait la chaleur.
 */
export function Halo({ className }: ShapeProps) {
  return (
    <svg
      {...decorative}
      viewBox="0 0 200 200"
      className={cn("pointer-events-none", className)}
    >
      <path
        d="M 98 6 C 152 2 192 42 196 98 C 200 154 158 192 100 196 C 44 200 8 156 5 100 C 2 48 44 10 98 6 Z"
        fill="currentColor"
      />
    </svg>
  );
}
