import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "success" | "warning" | "error" | "onDark";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface text-ink-secondary border-border",
  primary: "bg-primary-soft text-primary border-primary-soft",
  success: "bg-success-soft text-success border-success-soft",
  warning: "bg-warning-soft text-warning border-warning-soft",
  error: "bg-error-soft text-error border-error-soft",
  onDark: "bg-background/15 text-background border-background/25",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1",
        "text-xs font-medium whitespace-nowrap",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
