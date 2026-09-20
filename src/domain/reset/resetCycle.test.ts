import {
  getActiveCycleSequence,
  getOverallDayNumber,
  getResetCycleFromSnapshot,
  getResetCycleId,
  mapSnapshotToResetCycle,
} from './resetCycle';
import { DEFAULT_CYCLE_LENGTH, FOUNDATION_PLAN_ID, FOUNDATION_PLAN_VERSION } from './resetPlan';
import type { ResetPersonalization, ResetSnapshotSource } from './types';

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
    desiredFeelings: ['calm'],
    dailyCommitment: 'ten',
    ...overrides,
  };
}

function snapshot(overrides: Partial<ResetSnapshotSource> = {}): ResetSnapshotSource {
  return {
    currentDay: 17,
    completedDays: [1, 2],
    todayStarted: false,
    resetStartedOn: '2026-09-01',
    resetTypeId: 'soft-restarter',
    personalization: personalization(),
    ...overrides,
  };
}

check('A cycle 1 day 1 → overall 1', getOverallDayNumber(1, 1) === 1);
check('A cycle 1 day 17 → overall 17', getOverallDayNumber(1, 17) === 17);
check('A cycle 1 day 30 → overall 30', getOverallDayNumber(1, 30) === 30);
check('A cycle 2 day 17 → overall 47', getOverallDayNumber(2, 17) === 47);
check('A getActiveCycleSequence is 1', getActiveCycleSequence(snapshot()) === 1);

const source = snapshot({
  currentDay: 12,
  completedDays: [1, 3, 3],
  todayStarted: true,
  resetStartedOn: '2026-09-04',
  resetTypeId: 'almost-starter',
});
const frozenDays = Object.freeze([...source.completedDays]);
const frozenSource: ResetSnapshotSource = {
  ...source,
  completedDays: frozenDays,
  personalization: Object.freeze({
    ...source.personalization,
    desiredFeelings: Object.freeze([...source.personalization.desiredFeelings]),
  }),
};
const cycle = mapSnapshotToResetCycle(frozenSource);
const viaAlias = getResetCycleFromSnapshot(frozenSource);

check('A sequence is 1', cycle.sequence === 1);
check('A cycle id is foundation-reset:1', cycle.id === getResetCycleId(1));
check('A planId is foundation-reset', cycle.planId === FOUNDATION_PLAN_ID);
check('A planVersion is 1', cycle.planVersion === FOUNDATION_PLAN_VERSION);
check('A currentDay stays local', cycle.currentDay === 12);
check('A completedDays copied locally', cycle.completedDays.join(',') === '1,3,3');
check('A resetTypeId preserved', cycle.resetTypeId === 'almost-starter');
check('A startedAt is resetStartedOn', cycle.startedAt === '2026-09-04');
check('A completedAt is not fabricated', cycle.completedAt === null);
check('A status is active', cycle.status === 'active');
check('A todayStarted mapped', cycle.todayStarted === true);
check(
  'A getResetCycleFromSnapshot matches mapSnapshotToResetCycle',
  viaAlias.id === cycle.id &&
    viaAlias.sequence === cycle.sequence &&
    viaAlias.currentDay === cycle.currentDay &&
    viaAlias.startedAt === cycle.startedAt,
);

const day30 = mapSnapshotToResetCycle(
  snapshot({
    currentDay: 30,
    completedDays: Array.from({ length: 30 }, (_, index) => index + 1),
    todayStarted: true,
  }),
);
check(
  'A Day 30 snapshot stays active — completeResetCycle does not exist',
  day30.status === 'active' && day30.completedAt === null && day30.sequence === 1,
);

const mutableDays = [1, 2];
const mutableFeelings = ['calm'];
const mutableSnapshot = snapshot({
  completedDays: mutableDays,
  personalization: personalization({ desiredFeelings: mutableFeelings }),
});
const mapped = mapSnapshotToResetCycle(mutableSnapshot);
(mapped.completedDays as number[]).push(99);
(mapped.personalization.desiredFeelings as string[]).push('invented');
check('A adapter does not mutate snapshot completedDays', mutableDays.join(',') === '1,2');
check('A adapter does not mutate snapshot personalization', mutableFeelings.join(',') === 'calm');
check('A default cycle length is 30', DEFAULT_CYCLE_LENGTH === 30);

if (failed > 0) {
  throw new Error(`${failed} domain resetCycle A check(s) failed`);
}

console.log('\nall domain resetCycle A checks passed');
