import type { ResetSnapshot } from '../../features/reset/types';

/**
 * Persistence port for the local daily reset.
 *
 * Lives in application (not `src/data`) so use cases depend on a contract
 * and adapters implement it. The interface must not mention Zustand,
 * AsyncStorage, or React — only ResetSnapshot.
 *
 * What this stores: the legacy-compatible ResetSnapshot.
 * ResetCycle is a domain projection and is never persisted here.
 *
 * Reflections stay on ResetSnapshot. A dedicated JournalRepository is
 * deferred until journal persistence is independent of the daily snapshot.
 *
 * Hydration: `getSnapshot()` before Zustand persist rehydrates returns
 * in-memory defaults. Implementations must not write those defaults to
 * persist on construction. `usePersistedStoresHydrated` gates the UI so
 * `saveSnapshot` runs only after `gently-reset-daily` v1 is loaded.
 */
export type ResetRepository = {
  getSnapshot(): ResetSnapshot;
  saveSnapshot(snapshot: ResetSnapshot): void;
};

/**
 * Snapshot fields only — strips store actions if a Zustand state object
 * is passed in. Callers persist this, not ResetCycle.
 */
export function pickResetSnapshot(state: ResetSnapshot): ResetSnapshot {
  return {
    currentDay: state.currentDay,
    completedDays: [...state.completedDays],
    todayCompleted: state.todayCompleted,
    todayStarted: state.todayStarted,
    todayTask: { ...state.todayTask },
    resetStartedOn: state.resetStartedOn,
    lastSeenOn: state.lastSeenOn,
    lastCompletedOn: state.lastCompletedOn,
    streak: state.streak,
    missedYesterday: state.missedYesterday,
    resetTypeId: state.resetTypeId,
    profileAccuracy: state.profileAccuracy,
    personalization: {
      ...state.personalization,
      desiredFeelings: [...state.personalization.desiredFeelings],
    },
    reflections: (state.reflections ?? []).map((entry) => ({ ...entry })),
  };
}

/** Bind get/save accessors. Used by the Zustand store bridge and tests. */
export function createResetRepositoryFromAccessors(
  getSnapshot: () => ResetSnapshot,
  saveSnapshot: (snapshot: ResetSnapshot) => void,
): ResetRepository {
  return {
    getSnapshot: () => pickResetSnapshot(getSnapshot()),
    saveSnapshot: (snapshot) => {
      saveSnapshot(pickResetSnapshot(snapshot));
    },
  };
}
