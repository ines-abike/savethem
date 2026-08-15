import { ArrowRight, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { Halo } from "@/components/illustrations/shapes";

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
      <Halo className="absolute -top-32 -right-40 h-[560px] w-[560px] text-primary-subtle" />
      <Halo className="absolute -bottom-28 -left-28 h-[360px] w-[360px] text-primary-subtle" />

      <Container className="relative py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold text-balance text-ink sm:text-5xl lg:text-6xl">
            Vous hésitez parce que vous ne savez pas. Réglons ça.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-ink-secondary sm:text-xl">
            Savoir si vous pouvez donner, où aller, et ce qui se passe
            exactement une fois sur place. Trois questions, trois réponses
            claires — sans compte à créer, sans rendez-vous à prendre ici.
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
      </Container>
    </section>
  );
}
