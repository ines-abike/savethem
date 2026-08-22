import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { MobileNav, type NavLink } from "./mobile-nav";

const NAV_LINKS: NavLink[] = [
  { href: "#pourquoi-donner", label: "Pourquoi donner" },
  { href: "#deroulement", label: "Déroulement" },
  { href: "#ou-donner", label: "Où donner" },
  { href: "#questions", label: "Questions" },
];

/**
 * En-tête collant.
 *
 * Une seule liste de liens alimente les deux navigations : la barre au-delà
 * de `lg`, le panneau déroulant en deçà. Elles ne coexistent jamais dans
 * l'arbre d'accessibilité — chacune est en `display: none` à la largeur de
 * l'autre — d'où deux `<nav>` sans conflit d'étiquette.
 *
 * Le composant reste rendu côté serveur : seule la bascule du menu est un
 * îlot client (cf. `MobileNav`).
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Le lien porte déjà le nom accessible, d'où l'`alt` vide. */}
        <Link href="#top" aria-label="Savethem, retour en haut de page">
          {/*
            Fichier 600 × 230 rendu à 40 px de haut, soit 104 px de large. Le
            PNG porte 20 px de marge transparente à gauche — ~3,5 px à cette
            échelle — que la marge négative annule pour que le symbole
            affleure le bord du contenu.

            En-tête dans le premier écran : pas de chargement paresseux.
            `priority` étant déprécié depuis Next 16, loading/fetchPriority le
            remplacent.
          */}
          <Image
            src="/logos/logo-light.png"
            alt=""
            width={104}
            height={40}
            loading="eager"
            fetchPriority="high"
            className="-ml-[3.5px] select-none"
          />
        </Link>

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
          Le CTA n'apparaît qu'à partir de `lg`, où il ne dispute la largeur à
          personne : en deçà, il vit dans le menu, avec « Trouver un centre ».
          Plus besoin d'un libellé raccourci — il n'est plus jamais affiché à
          une largeur où il ne tient pas.
        */}
        <ButtonLink
          href="#puis-je-donner"
          className="hidden shrink-0 lg:inline-flex"
        >
          Vérifier mon éligibilité
        </ButtonLink>

        <MobileNav links={NAV_LINKS} />
      </Container>
    </header>
  );
}
