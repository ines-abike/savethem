/**
 * Lien d'évitement (§12).
 *
 * Masqué visuellement tant qu'il n'a pas le focus, il apparaît à la première
 * tabulation — c'est ce qui évite à un utilisateur au clavier de traverser
 * la navigation à chaque visite.
 */
export function SkipLink() {
  return (
    <a
      href="#contenu"
      className="sr-only rounded-full bg-primary px-5 py-3 text-sm font-semibold text-background focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:ring-ink"
    >
      Aller au contenu principal
    </a>
  );
}
