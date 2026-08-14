"use client";

import { useEffect, useState } from "react";

/**
 * Valeur retardée, et indicateur d'attente associé.
 *
 * `isPending` vaut `true` entre la frappe et la prise en compte : c'est la
 * seule latence réelle de la recherche de centres, les données étant
 * locales. C'est donc celle-là qu'on signale à l'utilisateur — plutôt que
 * de simuler un chargement qui n'existe pas.
 */
export function useDebouncedValue<T>(value: T, delayMs = 250): [T, boolean] {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return [debounced, debounced !== value];
}
