import { getCompanionState, isCompanionMilestoneDay } from './companionState';
import type { CompanionStateSource } from './companionState';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

function source(overrides: Partial<CompanionStateSource> = {}): CompanionStateSource {
  return {
    resetStartedOn: '2026-09-20',
    currentDay: 1,
    completedDays: [],
    todayStarted: false,
    todayCompleted: false,
    missedYesterday: false,
    ...overrides,
  };
}

check(
  'new user when the reset has not been seeded',
  getCompanionState(source({ resetStartedOn: null })) === 'new_user',
);

check(
  'new user wins over leftover completion flags',
  getCompanionState(
    source({
      resetStartedOn: null,
      todayCompleted: true,
      currentDay: 30,
      missedYesterday: true,
      todayStarted: true,
    }),
  ) === 'new_user',
);

check('Day 1 ready before the task starts', getCompanionState(source()) === 'ready');

check('task started', getCompanionState(source({ todayStarted: true })) === 'started');

check(
  'ordinary completion',
  getCompanionState(
    source({
      currentDay: 3,
      completedDays: [1, 2, 3],
      todayStarted: true,
      todayCompleted: true,
    }),
  ) === 'completed',
);

check(
  'missed-day return before starting today',
  getCompanionState(source({ currentDay: 4, missedYesterday: true })) === 'returned_after_miss',
);

check(
  'started wins over a missed-day return',
  getCompanionState(source({ missedYesterday: true, todayStarted: true })) === 'started',
);

check(
  'ordinary milestone on day 7',
  getCompanionState(
    source({
      currentDay: 7,
      completedDays: [1, 2, 3, 4, 5, 6, 7],
      todayStarted: true,
      todayCompleted: true,
    }),
  ) === 'milestone',
);

check(
  'day 14 and 21 are also ordinary milestones',
  getCompanionState(source({ currentDay: 14, todayCompleted: true })) === 'milestone' &&
    getCompanionState(source({ currentDay: 21, todayCompleted: true })) === 'milestone' &&
    isCompanionMilestoneDay(7) &&
    !isCompanionMilestoneDay(30),
);

check(
  'Day 30 completed is cycle_complete, not ordinary completed or milestone',
  getCompanionState(
    source({
      currentDay: 30,
      completedDays: Array.from({ length: 30 }, (_, index) => index + 1),
      todayStarted: true,
      todayCompleted: true,
      missedYesterday: true,
    }),
  ) === 'cycle_complete',
);

check(
  'Day 30 ready is not cycle_complete',
  getCompanionState(
    source({ currentDay: 30, completedDays: Array.from({ length: 29 }, (_, index) => index + 1) }),
  ) === 'ready',
);

check(
  'completed wins over a missed-day return',
  getCompanionState(
    source({
      currentDay: 5,
      todayCompleted: true,
      missedYesterday: true,
    }),
  ) === 'completed',
);

if (failed > 0) {
  throw new Error(`${failed} companion state check(s) failed`);
}

console.log('\nall companion state checks passed');
