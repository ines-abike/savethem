"use client";

import { useSyncExternalStore } from "react";

/**
 * Heure courante, connue uniquement côté client (CLAUDE.md §30.4).
 *
 * L'horloge est une source de vérité *externe* à React : c'est exactement
 * le cas d'usage de `useSyncExternalStore`, qui sait distinguer le snapshot
 * serveur du snapshot client. Le rendu serveur voit `null`, l'hydratation
 * aussi, puis la vraie heure arrive après l'abonnement — sans écart
 * d'hydratation et sans `setState` en cascade dans un effet.
 *
 * Les consommateurs doivent traiter `null` comme un état à part entière
 * (« horaires en cours de vérification »), jamais comme « fermé ».
 */

const REFRESH_MS = 60_000;

/**
 * Snapshot partagé. Il doit être référentiellement stable entre deux appels
 * de `getSnapshot`, sinon React boucle : on ne remplace donc l'objet `Date`
 * que dans le tick du minuteur.
 */
let snapshot: Date | null = null;

const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  // Premier abonné : on démarre l'horloge. React relit `getSnapshot` juste
  // après `subscribe`, ce qui suffit à propager cette première valeur.
  if (listeners.size === 1) {
    snapshot = new Date();
    timer = setInterval(() => {
      snapshot = new Date();
      for (const notify of listeners) notify();
    }, REFRESH_MS);
  }

  return () => {
    listeners.delete(listener);

    // Sans abonné, le minuteur n'a plus de raison de tourner. On conserve en
    // revanche le dernier snapshot : le remettre à `null` ferait clignoter
    // les statuts au remontage.
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

function getSnapshot(): Date | null {
  return snapshot;
}

function getServerSnapshot(): Date | null {
  return null;
}

export function useClientNow(): Date | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
