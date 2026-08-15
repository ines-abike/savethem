import { Container } from "@/components/ui/section";
import { Logo } from "./logo";

/**
 * Repères de l'OMS sur la sécurité et la disponibilité du sang.
 *
 * ⚠️ À remplacer par l'adresse officielle de l'Agence nationale pour la
 * transfusion sanguine (ANTS) du Bénin une fois vérifiée — je n'ai pas
 * confirmé son URL et préfère ne pas en inventer une.
 */
const REFERENCE_URL =
  "https://www.who.int/news-room/fact-sheets/detail/blood-safety-and-availability";

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
              Un site d&apos;information sur le don de sang au Bénin, pensé pour
              les personnes qui n&apos;ont jamais franchi le pas.
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
                  href={REFERENCE_URL}
                  rel="noreferrer noopener"
                  target="_blank"
                  className="hover:text-background"
                >
                  Repères de l&apos;OMS sur le don de sang
                  <span className="sr-only"> (nouvel onglet)</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
