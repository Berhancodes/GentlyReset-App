import type { OnboardingAnswer } from '../../features/onboarding/types/onboarding';
import type { ResetSnapshot } from '../../features/reset/types';
import {
  applyEnsureSeeded,
  createSeededResetState,
} from '../../features/reset/utils/seedResetState';

/**
 * `startReset` and `ensureSeeded` are different commands.
 *
 * `startReset` — begin a reset from onboarding answers only when none is
 * active (`resetStartedOn` is null). If a reset is already active, return
 * the current snapshot unchanged. Never overwrite progress, type, streak,
 * or journal. Does not reclassify. Used by onboarding seed.
 *
 * `ensureSeeded` — seed if idle (same `createSeededResetState` path). If a
 * reset already exists, keep progress and only roll the calendar / repair
 * a missing or invalid `resetTypeId`. Never reclassify a valid stored type.
 * Used by tab sync.
 *
 * Neither command changes onboarding answers or classification rules.
 *
 * ResetRepository is not the onboarding store. Seeding still uses these
 * snapshot transitions (or `createResetApplication(repo).startReset`).
 */
export function startReset(
  state: ResetSnapshot,
  answers: Record<string, OnboardingAnswer>,
  now: Date = new Date(),
): ResetSnapshot {
  if (state.resetStartedOn) {
    return state;
  }

  return createSeededResetState(answers, now);
}

export function ensureSeeded(
  state: ResetSnapshot,
  answers: Record<string, OnboardingAnswer>,
  now: Date = new Date(),
): ResetSnapshot {
  return applyEnsureSeeded(state, answers, now);
}
