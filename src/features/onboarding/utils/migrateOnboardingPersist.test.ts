import { getOnboardingStepIndex, ONBOARDING_STEPS } from '../data/onboardingSteps';
import {
  migrateOnboardingPersist,
  ONBOARDING_STEP_IDS_V1,
  resolveOnboardingStepIndex,
} from './migrateOnboardingPersist';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

check('active flow has 25 screens', ONBOARDING_STEPS.length === 25);
check('welcome is dest 1', getOnboardingStepIndex('welcome') === 0);
check('carryingStory is dest 5', getOnboardingStepIndex('carryingStory') === 4);
check('noticingStory is dest 9', getOnboardingStepIndex('noticingStory') === 8);
check('newLifeStory is dest 12', getOnboardingStepIndex('newLifeStory') === 11);
check('buildingResetLoading is dest 19', getOnboardingStepIndex('buildingResetLoading') === 18);
check('companionStory is dest 24', getOnboardingStepIndex('companionStory') === 23);
check('paywall is dest 25', getOnboardingStepIndex('paywall') === 24);
check('removed recurringThought is absent', getOnboardingStepIndex('recurringThought') === -1);
check(
  'removed thirtyDayCommitment is absent',
  getOnboardingStepIndex('thirtyDayCommitment') === -1,
);

check(
  'removed recurringThought maps to carryingStory',
  resolveOnboardingStepIndex('recurringThought') === getOnboardingStepIndex('carryingStory'),
);
check(
  'removed selfTalkAfterSlip maps to consistencyStage',
  resolveOnboardingStepIndex('selfTalkAfterSlip') === getOnboardingStepIndex('consistencyStage'),
);
check(
  'removed desiredFeelings maps to desiredIdentity',
  resolveOnboardingStepIndex('desiredFeelings') === getOnboardingStepIndex('desiredIdentity'),
);
check(
  'removed thirtyDayCommitment maps to buildingResetLoading',
  resolveOnboardingStepIndex('thirtyDayCommitment') ===
    getOnboardingStepIndex('buildingResetLoading'),
);

const fromOldIndex = migrateOnboardingPersist(
  { currentStepIndex: ONBOARDING_STEP_IDS_V1.indexOf('recurringThought'), answers: {} },
  0,
);
check(
  'v1 index for recurringThought resumes on carryingStory',
  fromOldIndex.currentStepId === 'carryingStory' &&
    fromOldIndex.currentStepIndex === getOnboardingStepIndex('carryingStory'),
);

const fromStepId = migrateOnboardingPersist(
  { currentStepIndex: 99, currentStepId: 'supportStyle', answers: {} },
  2,
);
check(
  'stored step id wins over a stale index',
  fromStepId.currentStepId === 'supportStyle' &&
    fromStepId.currentStepIndex === getOnboardingStepIndex('supportStyle'),
);

const overflow = migrateOnboardingPersist({ currentStepIndex: 80, answers: {} }, 0);
const overflowIndex = overflow.currentStepIndex ?? -1;
check(
  'out-of-range index is clamped',
  overflowIndex === 0 || overflowIndex < ONBOARDING_STEPS.length,
);
check('out-of-range incomplete starts at welcome', overflowIndex === 0);

const completed = migrateOnboardingPersist(
  { currentStepIndex: 80, hasCompletedOnboarding: true, answers: {} },
  0,
);
check(
  'completed overflow lands on paywall',
  completed.currentStepId === 'paywall' &&
    completed.currentStepIndex === getOnboardingStepIndex('paywall'),
);

if (failed > 0) {
  throw new Error(`${failed} onboarding persist check(s) failed`);
}

console.log('\nall onboarding persist checks passed');
