import type { ResetPersonalization, ResetSnapshot } from '../types';
import {
  DEFAULT_CYCLE_LENGTH,
  FOUNDATION_PLAN_ID,
  FOUNDATION_PLAN_VERSION,
  PLAN_DAY_COUNT,
  thirtyDayPlan,
} from '../data/thirtyDayPlan';
import { getActiveCycleSequence, getOverallDayNumber } from './resetCycle';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

function personalization(overrides: Partial<ResetPersonalization> = {}): ResetPersonalization {
  return {
    desiredFeelings: [],
    ...overrides,
  };
}

function legacySnapshot(overrides: Partial<ResetSnapshot> = {}): ResetSnapshot {
  const currentDay = overrides.currentDay ?? 17;
  return {
    currentDay,
    completedDays: [1, 2],
    todayCompleted: false,
    todayStarted: false,
    todayTask: {
      id: `day-${currentDay}`,
      day: currentDay,
      title: 'legacy',
      description: 'legacy persisted task',
      minutes: 5,
      steps: [],
    },
    resetStartedOn: '2026-09-01',
    lastSeenOn: '2026-09-19',
    lastCompletedOn: null,
    streak: 0,
    missedYesterday: false,
    resetTypeId: 'soft-restarter',
    personalization: overrides.personalization ?? personalization(),
    reflections: [],
    ...overrides,
  };
}

check('cycle 1 day 1 → overall 1', getOverallDayNumber(1, 1) === 1);
check('cycle 1 day 17 → overall 17', getOverallDayNumber(1, 17) === 17);
check('cycle 1 day 30 → overall 30', getOverallDayNumber(1, 30) === 30);
check('cycle 2 day 1 → overall 31', getOverallDayNumber(2, 1) === 31);
check('cycle 2 day 17 → overall 47', getOverallDayNumber(2, 17) === 47);
check('cycle 2 day 30 → overall 60', getOverallDayNumber(2, 30) === 60);
check('cycle 3 day 1 → overall 61', getOverallDayNumber(3, 1) === 61);
check('cycle 3 day 30 → overall 90', getOverallDayNumber(3, 30) === 90);

check(
  'getActiveCycleSequence(legacy snapshot) → 1',
  getActiveCycleSequence(legacySnapshot()) === 1,
);

check(
  'foundation plan id is foundation-reset',
  thirtyDayPlan.planId === 'foundation-reset' && FOUNDATION_PLAN_ID === 'foundation-reset',
);
check('foundation plan version is 1', thirtyDayPlan.version === 1 && FOUNDATION_PLAN_VERSION === 1);
check(
  'foundation plan length is 30',
  thirtyDayPlan.length === 30 &&
    DEFAULT_CYCLE_LENGTH === 30 &&
    PLAN_DAY_COUNT === DEFAULT_CYCLE_LENGTH &&
    PLAN_DAY_COUNT === thirtyDayPlan.length,
);

if (failed > 0) {
  throw new Error(`${failed} reset-cycle check(s) failed`);
}

console.log('\nall reset-cycle checks passed');
