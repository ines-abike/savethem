/**
 * Armement des révélations au défilement.
 *
 * Le piège classique de ce genre d'effet est de poser `opacity: 0` en CSS et
 * de compter sur le JS pour remonter à 1 : si le script ne s'exécute pas —
 * JS coupé, erreur réseau sur le bundle, navigateur ancien — la page reste
 * **vide**. Sur un site dont la fonction est d'informer quelqu'un sur sa
 * santé, c'est un défaut inacceptable.
 *
 * D'où l'inversion : rien n'est masqué par défaut. Ce script pose
 * `data-motion="armed"` sur `<html>`, et c'est **cet attribut** qui active
 * les états initiaux dans `globals.css`. Il n'apparaît donc que là où le JS
 * tourne et où le mouvement est accepté.
 *
 * Reste le cas où le script d'armement passe mais où GSAP ne charge jamais.
 * Le minuteur ci-dessous désarme alors tout seul : au pire, le visiteur voit
 * la page sans animation, jamais une page blanche.
 */

/** Délai au-delà duquel on considère que le contrôleur ne viendra pas. */
const FALLBACK_MS = 2500;

/** Nom de la variable globale portant le minuteur, partagé avec le contrôleur. */
export const FALLBACK_TIMER_KEY = "__savethemMotionFallback";

/*
 * Écrit en ES5 et sans dépendance : il s'exécute avant toute hydratation.
 * `try/catch` parce qu'un échec ici ne doit jamais empêcher la page de
 * s'afficher — c'est exactement ce que le garde-fou cherche à éviter.
 */
const SCRIPT = `(function(){try{
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var r=document.documentElement;r.dataset.motion='armed';
window.${FALLBACK_TIMER_KEY}=setTimeout(function(){r.removeAttribute('data-motion')},${FALLBACK_MS});
}catch(e){}})();`;

export function RevealGate() {
  /*
   * Inline et synchrone, en tête de `<body>` : il doit avoir posé l'attribut
   * avant la première peinture. Un script différé afficherait le contenu
   * puis le ferait disparaître — pire que pas d'animation du tout.
   */
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
