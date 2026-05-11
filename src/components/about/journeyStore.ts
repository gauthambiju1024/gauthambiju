import { useSyncExternalStore } from "react";

let selectedId: string | null = null;
const listeners = new Set<() => void>();

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => selectedId;

export const setSelected = (id: string | null) => {
  selectedId = selectedId === id ? null : id;
  listeners.forEach((l) => l());
};

export const useSelectedJourneyId = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
