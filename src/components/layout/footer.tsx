import { Container } from "@/components/ui/section";
import { Logo } from "./logo";

const EFS_URL = "https://dondesang.efs.sante.fr/";

/**
 * Pied de page.
 *
 * Porte les deux mentions qui engagent la crédibilité du site : le rappel
 * que seul un entretien médical fait foi, et le fait que les données
 * affichées sont fictives. Les deux sont non négociables — la première est
 * exigée par le brief, la seconde par honnêteté.
 */
export function Footer() {
  return (
    <footer className="bg-ink text-background/70">
      <Container className="flex flex-col gap-10 py-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-md flex-col gap-3">
            <Logo onDark />
            <p className="text-sm leading-relaxed text-pretty">
              Un site d&apos;information sur le don de sang, pensé pour les
              personnes qui n&apos;ont jamais franchi le pas.
            </p>
          </div>

          <nav aria-label="Pied de page">
            <ul className="flex flex-col gap-2 text-sm lg:text-right">
              <li>
                <a href="#puis-je-donner" className="hover:text-background">
                  Vérifier mon éligibilité
                </a>
              </li>
              <li>
                <a href="#ou-donner" className="hover:text-background">
                  Trouver un centre
                </a>
              </li>
              <li>
                <a href="#questions" className="hover:text-background">
                  Questions fréquentes
                </a>
              </li>
              <li>
                <a
                  href={EFS_URL}
                  rel="noreferrer noopener"
                  target="_blank"
                  className="hover:text-background"
                >
                  Établissement français du sang
                  <span className="sr-only"> (nouvel onglet)</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-background/15 pt-8 text-xs leading-relaxed">
          <p>
            <strong className="font-semibold text-background">
              Information, pas avis médical.
            </strong>{" "}
            Les critères d&apos;éligibilité présentés ici sont simplifiés. Seul
            un entretien avec un professionnel de santé, réalisé sur place avant
            chaque don, peut confirmer votre aptitude.
          </p>

          <p>
            <strong className="font-semibold text-background">
              Données fictives.
            </strong>{" "}
            Les centres, horaires, coordonnées et niveaux de réserve présentés
            sur ce site ont été inventés pour une démonstration technique. Ils
            ne correspondent à aucun établissement réel — pour trouver un vrai
            point de collecte, consultez l&apos;Établissement français du sang.
          </p>

          <p className="text-background/50">
            Savethem — projet réalisé dans le cadre du Figma to Code Challenge.
          </p>
        </div>
      </Container>
    </footer>
  );
}
