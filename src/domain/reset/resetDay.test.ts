import { getResetCycleFromSnapshot, getResetCycleId } from './resetCycle';
import { getResetDay } from './resetDay';
import { getResetPlan, getTaskForDay } from './resetPlan';
import type { ResetCycle, ResetPersonalization, ResetSnapshotSource } from './types';

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
    dailyCommitment: 'five',
    primaryObstacle: 'afraid-wont-stick',
    ...overrides,
  };
}

function snapshot(overrides: Partial<ResetSnapshotSource> = {}): ResetSnapshotSource {
  return {
    currentDay: 1,
    completedDays: [],
    todayStarted: false,
    resetStartedOn: '2026-09-20',
    resetTypeId: 'soft-restarter',
    personalization: personalization(),
    ...overrides,
  };
}

const plan = getResetPlan('foundation-reset', 1);
const cycle1 = getResetCycleFromSnapshot(
  snapshot({
    currentDay: 1,
    todayStarted: true,
  }),
);

const day1 = getResetDay(cycle1, plan, 1);
const expectedDay1Task = getTaskForDay(1, cycle1.personalization, cycle1.resetTypeId);

check('C1 D1 cycleId matches cycle', day1.cycleId === cycle1.id);
check('C1 D1 local dayNumber is 1', day1.dayNumber === 1);
check('C1 D1 overallDayNumber is 1', day1.overallDayNumber === 1);
check('C1 D1 status is current', day1.status === 'current');
check('C1 D1 started maps to todayStarted', day1.started === true);
check(
  'C1 D1 task is the canonical resolver',
  day1.task.title === expectedDay1Task.title &&
    day1.task.minutes === expectedDay1Task.minutes &&
    day1.task.description === expectedDay1Task.description &&
    day1.task.day === 1,
);

const futureDay2 = getResetDay(cycle1, plan, 2);
check('C1 D2 from day-1 cycle is future', futureDay2.status === 'future');
check('C1 D2 does not include started', futureDay2.started === undefined);

const cycle1Day30 = getResetCycleFromSnapshot(
  snapshot({
    currentDay: 30,
    completedDays: Array.from({ length: 29 }, (_, index) => index + 1),
    todayStarted: false,
  }),
);
const day30 = getResetDay(cycle1Day30, plan, 30);
check('C1 D30 local dayNumber is 30', day30.dayNumber === 30);
check('C1 D30 overallDayNumber is 30', day30.overallDayNumber === 30);
check('C1 D30 status is current', day30.status === 'current');
check('C1 D30 started is false when todayStarted is false', day30.started === false);
check('C1 D30 task is local day 30', day30.task.day === 30 && day30.task.id === 'day-30');
check(
  'C1 D30 completed day 1 is completed',
  getResetDay(cycle1Day30, plan, 1).status === 'completed',
);
check(
  'C1 D30 completed days do not carry started',
  getResetDay(cycle1Day30, plan, 1).started === undefined,
);

const cycle2MathOnly: ResetCycle = {
  id: getResetCycleId(2),
  sequence: 2,
  planId: plan.id,
  planVersion: plan.version,
  currentDay: 17,
  completedDays: [1, 2],
  resetTypeId: 'fading-flame',
  startedAt: null,
  completedAt: null,
  status: 'active',
  personalization: personalization({ dailyCommitment: 'twenty' }),
  todayStarted: false,
};
const day17c2 = getResetDay(cycle2MathOnly, plan, 17);
check('C2 D17 math-only overallDayNumber is 47', day17c2.overallDayNumber === 47);
check('C2 D17 local dayNumber stays 17', day17c2.dayNumber === 17);
check('C2 D17 task is still the local day-17 resolver', day17c2.task.day === 17);
check(
  'C2 D17 task minutes follow cycle personalization',
  day17c2.task.minutes === 15 &&
    day17c2.task.title ===
      getTaskForDay(17, cycle2MathOnly.personalization, cycle2MathOnly.resetTypeId).title,
);
check('C2 D17 status is current', day17c2.status === 'current');
check('C2 D17 is not persisted on the snapshot adapter', cycle1.sequence === 1);

if (failed > 0) {
  throw new Error(`${failed} domain resetDay C check(s) failed`);
}

console.log('\nall domain resetDay C checks passed');
