import { PLAN_DAY_COUNT } from './resetPlan';

/**
 * Derived Home companion mood. Not persisted. Read from the reset snapshot
 * only — no second progress store, no rollover of its own.
 */
export type CompanionState =
  | 'new_user'
  | 'ready'
  | 'started'
  | 'completed'
  | 'returned_after_miss'
  | 'milestone'
  | 'cycle_complete';

export type CompanionStateSource = {
  resetStartedOn: string | null;
  currentDay: number;
  completedDays: readonly number[];
  todayStarted: boolean;
  todayCompleted: boolean;
  missedYesterday: boolean;
};

/** Week markers. Day 30 is `cycle_complete`, not an ordinary milestone. */
export const COMPANION_MILESTONE_DAYS = [7, 14, 21] as const;

/**
 * Highest → lowest. The first matching rule wins so the mascot never
 * receives two states at once.
 *
 * 1. `new_user` — reset has not been seeded
 * 2. `cycle_complete` — Day 30 is complete today
 * 3. `milestone` — Day 7 / 14 / 21 is complete today
 * 4. `completed` — any other completed today
 * 5. `started` — today's reset is in progress
 * 6. `returned_after_miss` — rollover marked a miss, and today is not started
 * 7. `ready` — active reset, waiting to begin today
 */
export function getCompanionState(source: CompanionStateSource): CompanionState {
  if (source.resetStartedOn == null) {
    return 'new_user';
  }

  if (source.todayCompleted && source.currentDay >= PLAN_DAY_COUNT) {
    return 'cycle_complete';
  }

  if (source.todayCompleted && isCompanionMilestoneDay(source.currentDay)) {
    return 'milestone';
  }

  if (source.todayCompleted) {
    return 'completed';
  }

  if (source.todayStarted) {
    return 'started';
  }

  if (source.missedYesterday) {
    return 'returned_after_miss';
  }

  return 'ready';
}

export function isCompanionMilestoneDay(day: number): boolean {
  return (COMPANION_MILESTONE_DAYS as readonly number[]).includes(day);
}
