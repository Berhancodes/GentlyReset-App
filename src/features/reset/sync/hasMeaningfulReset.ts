import type { ResetSnapshot } from '../types';

/**
 * Local defaults (Day 1, empty type, no dates, no completions) are not
 * meaningful. Used so a fresh install cannot overwrite real cloud progress.
 */
export function hasMeaningfulReset(snapshot: ResetSnapshot): boolean {
  if (snapshot.resetTypeId.trim().length > 0) {
    return true;
  }
  if (snapshot.resetStartedOn) {
    return true;
  }
  if (snapshot.completedDays.length > 0) {
    return true;
  }
  if (snapshot.currentDay > 1) {
    return true;
  }
  if (snapshot.todayStarted || snapshot.todayCompleted) {
    return true;
  }
  return false;
}
