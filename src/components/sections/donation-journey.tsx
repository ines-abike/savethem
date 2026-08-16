import Image from "next/image";
import { Clock } from "lucide-react";
import {
  DONATION_STEPS,
  TOTAL_DURATION_MINUTES,
} from "@/data/donation-journey";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";

/**
 * Le déroulement du don (C4).
 *
 * Objectif unique : rendre l'expérience prévisible. La peur vient de
 * l'inconnu (insight 02), donc chaque étape dit ce qu'on fait et combien de
 * temps ça prend — pas ce qu'on est censé ressentir.
 *
 * La durée totale est calculée à partir des étapes plutôt que saisie à la
 * main : les deux ne peuvent pas diverger.
 */
export function DonationJourney() {
  return (
    <Section id="deroulement" tone="surface">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
          <div>
            <SectionHeader
              eyebrow="Première fois ?"
              title="On vous explique tout, minute par minute"
              lead="Le prélèvement lui-même dure une dizaine de minutes. C'est tout le reste — l'accueil, l'entretien, le repos — qui compose l'heure sur place."
            />

            <div className="mt-6">
              <Badge tone="primary">
                <Clock aria-hidden="true" className="size-3.5" />
                Comptez environ {TOTAL_DURATION_MINUTES} minutes sur place
              </Badge>
            </div>
          </div>

          <Image
            src="/illustrations/blood-donation-amico.svg"
            alt=""
            width={500}
            height={500}
            className="mx-auto h-auto w-full max-w-sm lg:max-w-none"
          />
        </div>

        {/*
          Liste ordonnée : la séquence est porteuse de sens, un lecteur
          d'écran doit l'entendre comme « 1 sur 4 », pas comme une liste à
          puces indifférenciée.
        */}
        {/*
          Cartes indépendantes plutôt qu'une bande continue : à deux colonnes
          (sm), arrondir « le premier à gauche, le dernier à droite » produit
          une grille 2×2 bancale. La séquence est portée par les numéros, qui
          fonctionnent à toutes les largeurs.
        */}
        <ol className="mt-12 grid gap-4 sm:grid-cols-2">
          {DONATION_STEPS.map((step, index) => (
            <li
              key={step.id}
              className="relative flex flex-col gap-3 rounded-3xl border border-border bg-background p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-background">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-muted">
                  {step.durationMinutes} min
                </span>
              </div>

              <h3 className="text-base font-bold text-balance text-ink">
                {step.title}
              </h3>

              <p className="text-sm leading-relaxed text-pretty text-ink-secondary">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
