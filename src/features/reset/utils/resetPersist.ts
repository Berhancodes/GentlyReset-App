import type { ResetSnapshot } from '../types';

/** One local persist key. Phase 2C repository writes through this store only. */
export const RESET_PERSIST_KEY = 'gently-reset-daily';
export const RESET_PERSIST_VERSION = 1;

export type ResetPersistedSlice = Pick<
  ResetSnapshot,
  | 'currentDay'
  | 'completedDays'
  | 'todayCompleted'
  | 'todayStarted'
  | 'todayTask'
  | 'resetStartedOn'
  | 'lastSeenOn'
  | 'lastCompletedOn'
  | 'streak'
  | 'missedYesterday'
  | 'resetTypeId'
  | 'profileAccuracy'
  | 'personalization'
  | 'reflections'
>;

/**
 * Existing v1 migrate. Fills missing reflections and keeps a string
 * profileAccuracy. Does not reclassify resetTypeId or rewrite plan progress.
 */
export function migrateResetPersistState(persistedState: unknown): Partial<ResetSnapshot> {
  const state = persistedState as Partial<ResetSnapshot>;
  return {
    ...state,
    reflections: state.reflections ?? [],
    profileAccuracy: typeof state.profileAccuracy === 'string' ? state.profileAccuracy : undefined,
  };
}

export function partializeResetState(state: ResetSnapshot): ResetPersistedSlice {
  return {
    currentDay: state.currentDay,
    completedDays: state.completedDays,
    todayCompleted: state.todayCompleted,
    todayStarted: state.todayStarted,
    todayTask: state.todayTask,
    resetStartedOn: state.resetStartedOn,
    lastSeenOn: state.lastSeenOn,
    lastCompletedOn: state.lastCompletedOn,
    streak: state.streak,
    missedYesterday: state.missedYesterday,
    resetTypeId: state.resetTypeId,
    profileAccuracy: state.profileAccuracy,
    personalization: state.personalization,
    reflections: state.reflections ?? [],
  };
}
