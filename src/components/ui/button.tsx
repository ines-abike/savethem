import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  // Le rouge est la couleur d'action de la marque (§26.3), pas du danger.
  primary: "bg-primary text-background hover:bg-primary-hover",
  secondary:
    "bg-background text-ink border border-border-strong hover:bg-surface",
  ghost: "text-primary hover:bg-primary-soft",
};

const SIZES: Record<Size, string> = {
  // 44 px de haut minimum : cible tactile confortable au doigt (§18).
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-13 px-7 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "transition-colors duration-150 disabled:pointer-events-none " +
  "disabled:opacity-50 cursor-pointer";

export function buttonStyles(variant: Variant = "primary", size: Size = "md") {
  return cn(BASE, VARIANTS[variant], SIZES[size]);
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      // Sans type explicite, un bouton dans un formulaire le soumet : c'est
      // la source de bug la plus banale du simulateur.
      type={type}
      className={cn(buttonStyles(variant, size), className)}
      {...props}
    >
      {children}
    </button>
  );
}

/** Même apparence, mais c'est un lien : navigation, pas action. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<"a"> & { variant?: Variant; size?: Size }) {
  return (
    <a className={cn(buttonStyles(variant, size), className)} {...props}>
      {children}
    </a>
  );
}
