import type { ResetTypeId } from '../types';
import type { TaskTime } from './areaMoves';
import type { FocusAreaId } from './focusAreas';

/**
 * How a reset type leans, without a separate task library per type:
 * - `lighter`: the day's lighter version is offered under the steps.
 * - `start`: in week 1, scaling tasks start at half the minutes ("just start").
 * - `standard`: the plan as written.
 */
type Lean = 'lighter' | 'start' | 'standard';

const LEAN_BY_TYPE: Record<ResetTypeId, Lean> = {
  'quiet-drain': 'lighter',
  'all-in-heart': 'lighter',
  'soft-restarter': 'lighter',
  'almost-starter': 'start',
  'fading-flame': 'start',
  'quiet-stranger': 'lighter',
  'overloaded-dreamer': 'standard',
  'soft-scatter': 'standard',
  'drifting-compass': 'standard',
};

const WEEK_1_LAST_DAY = 7;
/** Quiet Stranger gets the lighter version only where it means less social pressure. */
const QUIET_STRANGER_LIGHTER_AREAS: readonly FocusAreaId[] = ['relationships', 'confidence'];
const MIN_START_MINUTES = 2;

/** Whether to offer the day's lighter version. */
export function offersLighter(typeId: ResetTypeId, focusAreaId: FocusAreaId, day: number): boolean {
  if (LEAN_BY_TYPE[typeId] !== 'lighter') {
    return false;
  }
  if (typeId === 'soft-restarter') {
    return day <= WEEK_1_LAST_DAY;
  }
  if (typeId === 'quiet-stranger') {
    return QUIET_STRANGER_LIGHTER_AREAS.includes(focusAreaId);
  }
  return true;
}

/**
 * The task's own minutes: a fixed task takes its own time, a scaling task takes
 * the user's ramped minutes up to its cap, and a "during" task takes 0 (done
 * inside something else; the label says so).
 */
export function minutesForTask(
  time: TaskTime,
  rampedMinutes: number,
  typeId: ResetTypeId,
  day: number,
): number {
  switch (time.kind) {
    case 'fixed':
      return time.minutes;
    case 'during':
      return 0;
    case 'scales': {
      const capped = Math.min(rampedMinutes, time.max);
      if (LEAN_BY_TYPE[typeId] === 'start' && day <= WEEK_1_LAST_DAY) {
        return Math.max(MIN_START_MINUTES, Math.round(capped / 2));
      }
      return capped;
    }
  }
}
