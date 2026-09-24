import {
  DEFAULT_CYCLE_LENGTH,
  FOUNDATION_PLAN_ID,
  FOUNDATION_PLAN_VERSION,
  getPlanDayTitle,
  getResetPlan,
  getTaskForDay,
  PLAN_DAY_COUNT,
  PLAN_DAY_TITLES,
  thirtyDayPlan,
} from './resetPlan';
import type { ResetPersonalization } from './types';

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

const plan = getResetPlan('foundation-reset', 1);

check('B plan id is foundation-reset', plan.id === 'foundation-reset');
check('B plan version is 1', plan.version === 1);
check('B plan length is 30', plan.length === 30);
check(
  'B thirtyDayPlan is the same foundation identity',
  thirtyDayPlan.planId === FOUNDATION_PLAN_ID &&
    thirtyDayPlan.version === FOUNDATION_PLAN_VERSION &&
    thirtyDayPlan.length === DEFAULT_CYCLE_LENGTH &&
    plan.id === thirtyDayPlan.planId &&
    plan.version === thirtyDayPlan.version &&
    plan.length === thirtyDayPlan.length,
);
check('B PLAN_DAY_COUNT aliases DEFAULT_CYCLE_LENGTH', PLAN_DAY_COUNT === DEFAULT_CYCLE_LENGTH);
check('B there are 30 canonical titles', PLAN_DAY_TITLES.length === 30);
check(
  'B day 1 title matches onboarding companion preview',
  getPlanDayTitle(1) === 'Start smaller than usual',
);
check(
  'B day 3 title matches onboarding companion preview',
  getPlanDayTitle(3) === 'Build one repeatable win',
);

const defaultTask = getTaskForDay(1, personalization());
const twenty = getTaskForDay(4, personalization({ dailyCommitment: 'twenty' }));
const tooMuch = getTaskForDay(2, personalization({ primaryObstacle: 'too-much' }));

check('B getTaskForDay uses local day', defaultTask.day === 1 && defaultTask.id === 'day-1');
check('B getTaskForDay title is the plan title', defaultTask.title === getPlanDayTitle(1));
check('B getTaskForDay minutes come from commitment', twenty.minutes === 20);
check(
  'B getTaskForDay description uses obstacle',
  tooMuch.description === 'Smaller than you think. Then stop.',
);
check(
  'B getTaskForDay clamps above 30 to the same day-30 task',
  getTaskForDay(31, personalization()).day === 30 &&
    getTaskForDay(31, personalization()).title === getPlanDayTitle(30),
);

let unknownPlanFailed = false;
try {
  getResetPlan('other-plan', 1);
} catch {
  unknownPlanFailed = true;
}
check('B unknown plan id is rejected', unknownPlanFailed);

if (failed > 0) {
  throw new Error(`${failed} domain resetPlan B check(s) failed`);
}

console.log('\nall domain resetPlan B checks passed');
