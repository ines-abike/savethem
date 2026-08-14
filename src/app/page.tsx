import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";
import { Hero } from "@/components/sections/hero";
import { WhyDonate } from "@/components/sections/why-donate";
import { DonationJourney } from "@/components/sections/donation-journey";
import { EligibilitySimulator } from "@/components/sections/eligibility-simulator";
import { Preparation } from "@/components/sections/preparation";
import { DonationCenters } from "@/components/sections/donation-centers";
import { BloodReserve } from "@/components/sections/blood-reserve";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";

/**
 * Landing page Savethem.
 *
 * L'ordre suit les questions mentales du primo-donneur (CLAUDE.md §27), et
 * non la numérotation C1→C8 du brief :
 *
 *   pourquoi j'irais → à quoi m'attendre → puis-je donner → comment me
 *   préparer → où aller → est-ce utile maintenant → et mes doutes ?
 *
 * Le déroulement (C4) passe volontairement **avant** le simulateur : savoir
 * ce qui va se passer désamorce l'appréhension avant qu'on demande à
 * quelqu'un de saisir son âge et son poids.
 *
 * Seuls le simulateur, la recherche de centres et la FAQ sont des composants
 * client : tout le reste est rendu statiquement.
 */
export default function HomePage() {
  return (
    <>
      <SkipLink />
      <Header />

      <main id="contenu" className="flex-1">
        <Hero />
        <WhyDonate />
        <DonationJourney />
        <EligibilitySimulator />
        <Preparation />
        <DonationCenters />
        <BloodReserve />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
