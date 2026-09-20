import { useResetStore } from '@/features/reset/store/useResetStore';

import { createLocalResetRepository } from './createLocalResetRepository';

/**
 * Production adapter over the existing Zustand persist store.
 *
 * Persist key remains `gently-reset-daily` version 1. This module never
 * opens AsyncStorage and never introduces a second persist key.
 * `saveSnapshot` calls `useResetStore.setState`; persist middleware
 * flushes the same key the store already uses.
 *
 * Hydration: constructing this object does not write. `getSnapshot()`
 * before `useResetStore.persist.hasHydrated()` returns in-memory
 * defaults. The root layout waits on `usePersistedStoresHydrated`
 * before any screen can call a mutation.
 */
export const localResetRepository = createLocalResetRepository({
  getState: () => useResetStore.getState(),
  setState: (snapshot) => {
    useResetStore.setState(snapshot);
  },
});
