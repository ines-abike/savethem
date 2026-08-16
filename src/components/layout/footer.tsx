import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/section";

/**
 * Agence nationale pour la transfusion sanguine (ANTS) — l'autorité de
 * référence pour le don du sang au Bénin.
 *
 * C'est la seule sortie externe de la page, et elle a une raison d'être
 * précise : les centres affichés ici sont fictifs. Quelqu'un qui veut
 * réellement donner doit pouvoir atterrir sur une adresse vraie, dans son
 * pays. Une fiche institutionnelle internationale — la version précédente
 * pointait vers l'OMS — ne remplissait pas ce rôle : bonne source, mauvaise
 * destination pour un primo-donneur béninois.
 */
const REFERENCE_URL = "https://antsbenin.org/";

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
            <Image
              src="/logos/logo-dark.png"
              alt="Savethem"
              width={108}
              height={40}
              className="-ml-[6.5px] select-none"
            />
            <p className="text-sm leading-relaxed text-pretty">
              Un site d&apos;information sur le don de sang au Bénin, pensé pour
              les personnes qui n&apos;ont jamais franchi le pas.
            </p>
          </div>

          <nav aria-label="Pied de page">
            <ul className="flex flex-col gap-2 text-sm lg:text-right">
              <li>
                <Link href="#puis-je-donner" className="hover:text-background">
                  Vérifier mon éligibilité
                </Link>
              </li>
              <li>
                <Link href="#ou-donner" className="hover:text-background">
                  Trouver un centre
                </Link>
              </li>
              <li>
                <Link href="#questions" className="hover:text-background">
                  Questions fréquentes
                </Link>
              </li>
              <li>
                <Link
                  href={REFERENCE_URL}
                  rel="noreferrer noopener"
                  target="_blank"
                  className="hover:text-background"
                >
                  Agence nationale pour la transfusion sanguine
                  <span className="sr-only"> (nouvel onglet)</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/*
          Les deux mentions qui engagent la crédibilité du site. Elles vivent
          ici parce que le pied de page est le seul endroit traversé par tout
          le monde : le rappel médical n'existait auparavant que dans le
          résultat du simulateur, donc invisible pour qui ne fait pas le test.
        */}
        <div className="flex flex-col gap-3 border-t border-background/20 pt-8 text-xs leading-relaxed text-background/70">
          <p>
            <strong className="font-semibold text-background">
              Information, pas avis médical.
            </strong>{" "}
            Les critères présentés sur ce site sont simplifiés. Seul un
            entretien médical avec un professionnel de santé peut confirmer
            votre aptitude au don.
          </p>
        </div>
      </Container>
    </footer>
  );
}
