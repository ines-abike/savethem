"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * Accordéon de FAQ.
 *
 * Chaque en-tête est un vrai `<button>` : atteignable au clavier, activable
 * à Entrée comme à Espace, et annoncé avec son état par les lecteurs
 * d'écran via `aria-expanded`.
 *
 * Le panneau reste monté et masqué par `hidden` plutôt que démonté : le
 * lien entre `aria-controls` et l'élément contrôlé reste ainsi valide en
 * permanence.
 */
export function Accordion({
  items,
  className,
}: {
  items: AccordionItem[];
  className?: string;
}) {
  // Un seul panneau ouvert à la fois : ouvrir une question referme la
  // précédente. La liste reste ainsi courte et la position de chaque
  // question stable d'un clic à l'autre, plutôt que de s'allonger au fil
  // de la lecture. Recliquer sur l'en-tête ouvert le referme.
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <ul className={cn("divide-y divide-border border-y", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const headerId = `${baseId}-${item.id}-header`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <li key={item.id}>
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-4",
                  "py-5 text-left transition-colors",
                  "hover:text-primary",
                )}
              >
                <span className="text-base font-semibold text-pretty text-ink">
                  {item.question}
                </span>
                <Plus
                  aria-hidden="true"
                  className={cn(
                    "size-5 shrink-0 transition-transform duration-200",
                    isOpen ? "rotate-45 text-primary" : "text-muted",
                  )}
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className="pb-5"
            >
              <p className="max-w-3xl leading-relaxed text-pretty text-ink-secondary">
                {item.answer}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
