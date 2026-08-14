"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Boîte de dialogue bâtie sur l'élément `<dialog>` natif.
 *
 * `showModal()` fournit gratuitement et correctement ce qu'une
 * réimplémentation rate presque toujours : le piège au clavier, la
 * fermeture par Échap, l'inertie du reste de la page et le retour du focus
 * à l'élément déclencheur. Aucune dépendance ajoutée pour autant.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  /** Titre accessible ; sert aussi d'étiquette au dialogue. */
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    // Échap déclenche `close` sans passer par notre bouton : on resynchronise
    // l'état React, sinon le dialogue ne pourrait plus être rouvert.
    const handleClose = () => onClose();

    // Clic sur le fond : l'événement atteint le `<dialog>` lui-même et jamais
    // son contenu, ce qui suffit à distinguer les deux cas.
    //
    // L'écouteur est posé ici plutôt qu'en prop JSX à dessein : un `onClick`
    // sur un élément non interactif imposerait un équivalent clavier, or
    // `showModal()` fournit déjà Échap. Passer par `addEventListener` évite
    // d'ajouter un gestionnaire clavier redondant.
    const handleClick = (event: MouseEvent) => {
      if (event.target === dialog) onClose();
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("click", handleClick);

    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleClick);
    };
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    // `showModal` ne fige pas le défilement de la page en arrière-plan.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-lg rounded-3xl p-0",
        "bg-background text-ink backdrop:bg-ink/50",
        "open:animate-none",
        className,
      )}
    >
      <div className="max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 flex items-start justify-between gap-4 bg-background px-6 pt-6 pb-2">
          <h2 className="text-xl font-bold text-balance text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "-mt-1 shrink-0 text-muted hover:bg-surface hover:text-ink",
              "cursor-pointer rounded-full p-2 transition-colors",
            )}
          >
            <X aria-hidden="true" className="size-5" />
            <span className="sr-only">Fermer</span>
          </button>
        </div>

        <div className="px-6 pt-2 pb-6">{children}</div>
      </div>
    </dialog>
  );
}
