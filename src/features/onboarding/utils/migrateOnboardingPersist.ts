import { getOnboardingStepIndex, ONBOARDING_STEPS } from '../data/onboardingSteps';

export const ONBOARDING_PERSIST_VERSION = 2;

/**
 * Step order before the 25-screen restructure. Used only to map an old
 * numeric index onto a step id.
 */
export const ONBOARDING_STEP_IDS_V1 = [
  'welcome',
  'reason',
  'outOfBalance',
  'recentFeeling',
  'recurringThought',
  'carryingStory',
  'primaryObstacle',
  'changePattern',
  'selfTalkAfterSlip',
  'consistencyStage',
  'noticingStory',
  'thirtyDayOutcome',
  'desiredFeelings',
  'desiredDailyLife',
  'desiredIdentity',
  'successStatement',
  'newLifeStory',
  'beforeAfterSummary',
  'dailyCommitment',
  'supportTiming',
  'supportStyle',
  'missedDayResponse',
  'churnRisk',
  'readiness',
  'resetReason',
  'thirtyDayCommitment',
  'buildingResetLoading',
  'resetReveal',
  'noticedDetails',
  'profileAccuracy',
  'sharePreview',
  'companionStory',
  'paywall',
] as const;

const REMOVED_STEP_SUCCESSOR: Record<string, string> = {
  recurringThought: 'carryingStory',
  selfTalkAfterSlip: 'consistencyStage',
  desiredFeelings: 'desiredIdentity',
  desiredDailyLife: 'desiredIdentity',
  successStatement: 'newLifeStory',
  beforeAfterSummary: 'dailyCommitment',
  churnRisk: 'resetReason',
  readiness: 'resetReason',
  thirtyDayCommitment: 'buildingResetLoading',
};

export type OnboardingPersistedSlice = {
  currentStepIndex?: number;
  currentStepId?: string;
  answers?: Record<string, unknown>;
  hasCompletedOnboarding?: boolean;
};

function clampStepIndex(index: number): number {
  return Math.min(ONBOARDING_STEPS.length - 1, Math.max(0, index));
}

function indexForStepId(stepId: string): number | undefined {
  const index = getOnboardingStepIndex(stepId);
  return index >= 0 ? index : undefined;
}

export function resolveOnboardingStepIndex(stepId: string | undefined): number | undefined {
  if (!stepId) {
    return undefined;
  }

  const direct = indexForStepId(stepId);
  if (direct !== undefined) {
    return direct;
  }

  const successor = REMOVED_STEP_SUCCESSOR[stepId];
  return successor ? indexForStepId(successor) : undefined;
}

export function migrateOnboardingPersist(
  persistedState: unknown,
  fromVersion: number,
): OnboardingPersistedSlice {
  const state = (persistedState ?? {}) as OnboardingPersistedSlice;
  const completed = Boolean(state.hasCompletedOnboarding);

  let resolvedIndex = resolveOnboardingStepIndex(state.currentStepId);

  if (resolvedIndex === undefined && fromVersion < 2) {
    const legacyId =
      typeof state.currentStepIndex === 'number'
        ? ONBOARDING_STEP_IDS_V1[state.currentStepIndex]
        : undefined;
    resolvedIndex = resolveOnboardingStepIndex(legacyId);
  }

  if (resolvedIndex === undefined) {
    resolvedIndex = completed ? ONBOARDING_STEPS.length - 1 : 0;
  }

  const currentStepIndex = clampStepIndex(resolvedIndex);
  const currentStep = ONBOARDING_STEPS[currentStepIndex];

  return {
    currentStepIndex,
    currentStepId: currentStep?.id,
    answers: state.answers ?? {},
    hasCompletedOnboarding: completed,
  };
}
