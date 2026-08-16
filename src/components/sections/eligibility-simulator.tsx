"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  birthDateForAge,
  checkEligibility,
  DELAY_MONTHS,
  MAX_AGE,
  MIN_AGE,
  MIN_WEIGHT_KG,
  type EligibilityResult,
  type Sex,
} from "@/lib/eligibility";
import { useClientNow } from "@/hooks/use-client-now";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { RadioGroup } from "@/components/ui/radio-group";
import { Stepper } from "@/components/ui/stepper";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { TrajectoryArc } from "@/components/illustrations/shapes";
import { EligibilityResultPanel } from "./eligibility-result";

/**
 * Simulateur d'éligibilité (C3 / §16).
 *
 * Trois étapes, et le sexe demandé **uniquement** si la personne a déjà
 * donné — il ne sert qu'à choisir entre 3 et 4 mois de délai. Le demander
 * systématiquement reviendrait à collecter une donnée sans usage, ce que
 * §16 proscrit explicitement.
 *
 * Le calcul lui-même vit dans `lib/eligibility.ts` : ce composant ne fait
 * que collecter, valider et présenter.
 */

const TOTAL_STEPS = 3;

/**
 * Synthèse des critères généraux (C2), affichée **avant** le test.
 *
 * Le brief liste « qui peut donner » comme un contenu à part entière, distinct
 * du simulateur : quelqu'un doit pouvoir connaître les critères sans avoir à
 * saisir quoi que ce soit. Les valeurs sont lues sur les constantes du
 * domaine, donc l'affichage ne peut pas diverger du calcul.
 */
const CRITERIA = [
  {
    label: "Âge",
    value: `De ${MIN_AGE} à ${MAX_AGE} ans révolus`,
    detail: "C'est le seul critère qui ne peut pas être contourné.",
  },
  {
    label: "Poids",
    value: `${MIN_WEIGHT_KG} kg minimum`,
    detail: "Le volume prélevé est proportionnel au volume sanguin.",
  },
  {
    label: "Délai depuis le dernier don",
    value: `${DELAY_MONTHS.homme} mois pour un homme, ${DELAY_MONTHS.femme} pour une femme`,
    detail: "Aucun délai ne s'applique si vous n'avez jamais donné.",
  },
];

type HasDonated = "oui" | "non";

interface Errors {
  age?: string;
  weight?: string;
  hasDonated?: string;
  lastDonation?: string;
  sex?: string;
}

export function EligibilitySimulator() {
  const now = useClientNow();

  const [step, setStep] = useState(1);
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [hasDonated, setHasDonated] = useState<HasDonated | "">("");
  const [lastDonation, setLastDonation] = useState("");
  const [sex, setSex] = useState<Sex | "">("");
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<EligibilityResult | null>(null);

  // Le titre de l'étape reçoit le focus à chaque transition : sans ça, un
  // utilisateur au clavier resterait sur un bouton qui vient de disparaître.
  const stepHeadingRef = useRef<HTMLParagraphElement>(null);

  function goToStep(next: number) {
    setStep(next);
    // Le focus est déplacé après la peinture du nouvel écran.
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  }

  function validateAge(): boolean {
    const value = Number(age);

    if (age.trim() === "") {
      setErrors({ age: "Indiquez votre âge pour continuer." });
      return false;
    }
    if (!Number.isInteger(value) || value <= 0 || value > 120) {
      setErrors({ age: "Saisissez un âge en années, par exemple 34." });
      return false;
    }

    setErrors({});
    return true;
  }

  function validateWeight(): boolean {
    const value = Number(weight);

    if (weight.trim() === "") {
      setErrors({ weight: "Indiquez votre poids pour continuer." });
      return false;
    }
    if (Number.isNaN(value) || value <= 0 || value > 400) {
      setErrors({
        weight: "Saisissez un poids en kilogrammes, par exemple 62.",
      });
      return false;
    }

    setErrors({});
    return true;
  }

  function validateHistory(): boolean {
    if (hasDonated === "") {
      setErrors({ hasDonated: "Indiquez si vous avez déjà donné." });
      return false;
    }

    if (hasDonated === "non") {
      setErrors({});
      return true;
    }

    const next: Errors = {};

    if (lastDonation === "") {
      next.lastDonation = "Indiquez la date de votre dernier don.";
    } else if (now && new Date(lastDonation) > now) {
      next.lastDonation = "Cette date est dans le futur.";
    }

    if (sex === "") {
      next.sex = "Cette information détermine le délai applicable.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validateHistory()) return;

    const referenceDate = now ?? new Date();

    setResult(
      checkEligibility({
        birthDate: birthDateForAge(Number(age), referenceDate),
        weightKg: Number(weight),
        sex: sex === "" ? "homme" : sex,
        lastDonationDate: hasDonated === "oui" ? new Date(lastDonation) : null,
        referenceDate,
      }),
    );
  }

  function reset() {
    setResult(null);
    setStep(1);
    setAge("");
    setWeight("");
    setHasDonated("");
    setLastDonation("");
    setSex("");
    setErrors({});
  }

  return (
    <Section id="puis-je-donner" tone="surface">
      <TrajectoryArc className="absolute inset-x-0 top-10 h-40 w-full text-primary/15" />

      <Container className="relative">
        <SectionHeader
          eyebrow="Vérifier"
          title="Est-ce que je peux donner ?"
          lead="Trois questions, moins d'une minute. Aucune de vos données n'est enregistrée ni envoyée. Tout est calculé dans votre navigateur."
        />

        {/*
          Composition ouverte plutôt que trois cartes de plus : la carte du
          formulaire, juste en dessous, doit rester l'objet saillant de la
          section.

          Les séparateurs sont verticaux et entre les colonnes : ils disent
          « trois critères de même rang » là où un encadrement horizontal
          n'aurait fait que délimiter un bloc de plus.
        */}
        <h3 className="mt-12 text-xl font-bold text-balance text-ink sm:text-2xl">
          Les trois critères généraux
        </h3>

        <ul className="mt-6 grid gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
          {CRITERIA.map((criterion) => (
            <li
              key={criterion.label}
              // Le padding symétrique place le trait au milieu de la
              // gouttière plutôt que collé à la colonne suivante.
              className="flex flex-col gap-1 sm:px-6 sm:first:pl-0 sm:last:pr-0 lg:px-8"
            >
              <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                {criterion.label}
              </p>
              <p className="text-base font-bold text-balance text-ink">
                {criterion.value}
              </p>
              <p className="text-sm leading-relaxed text-pretty text-ink-secondary">
                {criterion.detail}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-3xl border border-border bg-background p-6 sm:p-8 lg:p-10">
          {result ? (
            <EligibilityResultPanel result={result} onReset={reset} />
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (step === 1 && validateAge()) goToStep(2);
                else if (step === 2 && validateWeight()) goToStep(3);
                else if (step === 3) handleSubmit();
              }}
              className="flex flex-col gap-8"
            >
              <Stepper current={step} total={TOTAL_STEPS} />

              {/* tabIndex -1 : cible de focus programmatique, hors tabulation. */}
              <p
                ref={stepHeadingRef}
                tabIndex={-1}
                className="text-xl font-bold text-balance text-ink outline-none sm:text-2xl"
              >
                {step === 1 && "Quel âge avez-vous ?"}
                {step === 2 && "Quel est votre poids ?"}
                {step === 3 && "Avez-vous déjà donné votre sang ?"}
              </p>

              {step === 1 && (
                <Field label="Âge" error={errors.age}>
                  {(field) => (
                    <input
                      {...field}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={120}
                      value={age}
                      onChange={(event) => setAge(event.target.value)}
                      placeholder="34"
                      autoComplete="off"
                      className={`${field.className} max-w-40`}
                    />
                  )}
                </Field>
              )}

              {step === 2 && (
                <Field label="Poids en kilogrammes" error={errors.weight}>
                  {(field) => (
                    <input
                      {...field}
                      type="number"
                      inputMode="decimal"
                      min={1}
                      max={400}
                      value={weight}
                      onChange={(event) => setWeight(event.target.value)}
                      placeholder="62"
                      autoComplete="off"
                      className={`${field.className} max-w-40`}
                    />
                  )}
                </Field>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-6">
                  <RadioGroup
                    legend="Avez-vous déjà donné votre sang ?"
                    hideLegend
                    layout="cards"
                    options={[
                      {
                        value: "non",
                        label: "Non, jamais",
                        description: "Aucun délai ne s'applique.",
                      },
                      {
                        value: "oui",
                        label: "Oui, déjà",
                        description: "Un délai minimal sépare deux dons.",
                      },
                    ]}
                    value={hasDonated === "" ? ("" as HasDonated) : hasDonated}
                    onChange={(value) => {
                      setHasDonated(value);
                      setErrors({});
                    }}
                  />

                  {errors.hasDonated && (
                    <p className="-mt-3 text-sm font-medium text-error">
                      {errors.hasDonated}
                    </p>
                  )}

                  {/*
                    Le sexe n'apparaît qu'ici : il ne sert qu'à choisir entre
                    3 et 4 mois de délai, donc il est inutile à qui n'a jamais
                    donné.
                  */}
                  {hasDonated === "oui" && (
                    <div className="flex flex-col gap-6 border-t border-border pt-6">
                      <Field
                        label="Date de votre dernier don"
                        error={errors.lastDonation}
                      >
                        {(field) => (
                          <input
                            {...field}
                            type="date"
                            value={lastDonation}
                            max={
                              now ? now.toISOString().slice(0, 10) : undefined
                            }
                            onChange={(event) =>
                              setLastDonation(event.target.value)
                            }
                            className={`${field.className} max-w-60`}
                          />
                        )}
                      </Field>

                      <div className="flex flex-col gap-2">
                        <RadioGroup
                          legend="Délai applicable"
                          options={[
                            { value: "homme", label: "Homme — 3 mois" },
                            { value: "femme", label: "Femme — 4 mois" },
                          ]}
                          value={sex === "" ? ("" as Sex) : sex}
                          onChange={setSex}
                        />
                        {errors.sex && (
                          <p className="text-sm font-medium text-error">
                            {errors.sex}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
                {step > 1 && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setErrors({});
                      goToStep(step - 1);
                    }}
                  >
                    <ArrowLeft aria-hidden="true" className="size-4" />
                    Retour
                  </Button>
                )}

                <Button type="submit" className="ml-auto">
                  {step < TOTAL_STEPS ? "Continuer" : "Voir mon résultat"}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              </div>
            </form>
          )}
        </div>
      </Container>
    </Section>
  );
}
