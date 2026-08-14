import { ArrowRight, MapPin } from "lucide-react";
import { TOTAL_DURATION_MINUTES } from "@/data/donation-journey";
import { DONATION_CENTERS } from "@/data/centers";
import { MAX_AGE, MIN_AGE, MIN_WEIGHT_KG } from "@/lib/eligibility";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { FlowLines, Halo } from "@/components/illustrations/shapes";
import { listCities } from "@/lib/centers";

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
  const cityCount = listCities(DONATION_CENTERS).length;

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Composition de fond : halo teinté + flux, contenu au premier plan. */}
      <Halo className="absolute -top-32 -right-40 h-[560px] w-[560px] text-primary-subtle" />
      <FlowLines className="absolute inset-x-0 top-24 h-[420px] w-full text-primary/20" />

      <Container className="relative py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Don de sang · Information
          </p>

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

          {/*
            Les trois critères sont annoncés dès le hero : c'est ce qui permet
            à quelqu'un de s'auto-évaluer en deux secondes, avant même
            d'ouvrir le simulateur (§Principe 1).
          */}
          <dl className="mt-14 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted">Âge requis</dt>
              <dd className="text-lg font-semibold text-ink">
                {MIN_AGE} à {MAX_AGE} ans
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted">Poids minimum</dt>
              <dd className="text-lg font-semibold text-ink">
                {MIN_WEIGHT_KG} kg
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted">Temps sur place</dt>
              <dd className="text-lg font-semibold text-ink">
                environ {Math.round(TOTAL_DURATION_MINUTES / 5) * 5} min
              </dd>
            </div>
          </dl>

          <p className="mt-6 text-sm text-muted">
            {DONATION_CENTERS.length} centres référencés dans {cityCount}{" "}
            villes.
          </p>
        </div>
      </Container>
    </section>
  );
}
