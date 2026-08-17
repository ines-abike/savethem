import { ArrowRight, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { Halo } from "@/components/illustrations/shapes";
import Image from "next/image";

/**
 * Hero (§01).
 *
 * Deux chemins, pas un : « vérifier mon éligibilité » en primaire parce que
 * c'est la première question réelle du visiteur (insight 01), « trouver un
 * centre » en secondaire pour ceux qui savent déjà.
 *
 * Aucune injonction, aucune dramatisation : le hero doit être rassurant et
 * non anxiogène (§01).
 */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/*
        Dérive lente et désynchronisée des deux halos. `motion-safe:` plutôt
        que de compter sur la neutralisation globale de `globals.css` : ici le
        mouvement ne se déclenche jamais chez qui le refuse, au lieu d'être
        joué en 0,01 ms puis figé sur son état d'arrivée.
      */}
      <Halo className="absolute -top-32 -right-40 h-[560px] w-[560px] text-primary-subtle motion-safe:animate-drift" />
      <Halo className="absolute -bottom-28 -left-28 h-[360px] w-[360px] text-primary-subtle motion-safe:animate-drift-slow" />

      <Container className="relative flex items-center justify-between py-20 sm:py-28 lg:py-20">
        <div data-reveal className="max-w-3xl lg:max-w-2xl">
          <h1 className="text-4xl font-bold text-balance text-ink sm:text-5xl lg:text-6xl">
            Comprendre le don de sang, c&apos;est le premier pas pour donner.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-ink-secondary sm:text-xl">
            Savoir si vous pouvez donner, où aller, et ce qui se passe
            exactement une fois sur place. Trois réponses claires, sans
            rendez-vous à prendre ici.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="#puis-je-donner" size="lg">
              Vérifier mon éligibilité
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>

            <ButtonLink href="#ou-donner" variant="secondary" size="lg">
              <MapPin aria-hidden="true" className="size-4" />
              Trouver un centre
            </ButtonLink>
          </div>
        </div>
        {/*
          `alt` vide : l'illustration ne porte aucune information que le titre
          et le chapô ne donnent déjà. « Hero » annoncé par un lecteur d'écran
          ne décrit rien et ajoute du bruit.

          Chargement empressé parce qu'elle est dans le premier écran : en
          paresseux, la révélation animerait un cadre encore vide. `priority`
          étant déprécié depuis Next 16, loading/fetchPriority le remplacent.
        */}
        <Image
          data-reveal
          src="/illustrations/blood-donation.svg"
          alt=""
          width={500}
          height={500}
          loading="eager"
          fetchPriority="high"
          className="mx-auto hidden h-auto w-full max-w-sm lg:block lg:max-w-none"
        />
      </Container>
    </section>
  );
}
