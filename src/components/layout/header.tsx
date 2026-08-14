import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { Logo } from "./logo";

const NAV_LINKS = [
  { href: "#pourquoi-donner", label: "Pourquoi donner" },
  { href: "#deroulement", label: "Déroulement" },
  { href: "#ou-donner", label: "Où donner" },
  { href: "#questions", label: "Questions" },
];

/**
 * En-tête collant.
 *
 * Pas de menu burger sur mobile, à dessein : la page est unique, chaque
 * section se termine par une étape suivante, et les deux tâches réelles
 * (vérifier, trouver un centre) restent accessibles — l'une par le bouton
 * ci-dessous, l'autre depuis le résultat du simulateur. Un burger n'aurait
 * fait que dupliquer le défilement en ajoutant du JavaScript.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-4">
        <a href="#top" aria-label="Savethem, retour en haut de page">
          <Logo />
        </a>

        <nav aria-label="Sections de la page" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-ink-secondary transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/*
          Libellé raccourci sous `sm` : à 390 px, « Vérifier mon éligibilité »
          et le logo se disputent la largeur. Le libellé complet reste dans le
          DOM pour les lecteurs d'écran.
        */}
        <ButtonLink href="#puis-je-donner" className="shrink-0">
          <span aria-hidden="true" className="sm:hidden">
            Vérifier
          </span>
          <span className="max-sm:sr-only">Vérifier mon éligibilité</span>
        </ButtonLink>
      </Container>
    </header>
  );
}
