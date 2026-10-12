import type { OnboardingAnswer, ResetProfile } from '@/features/onboarding/types/onboarding';
import { getOnboardingOptionLabel } from '@/features/onboarding/utils/getOnboardingOptionLabel';

import { getSingleChoiceId } from './answerReaders';

export type PlanReadyRow = {
  id: 'workingToward' | 'eachDay' | 'helps';
  label: string;
  value: string;
};

export type PlanReady = {
  rows: readonly PlanReadyRow[];
  /** "Day 1 can start today…" under the rows. */
  note: string;
};

function optionLabel(answers: Record<string, OnboardingAnswer>, stepId: string) {
  const optionId = getSingleChoiceId(answers, stepId);
  return optionId ? getOnboardingOptionLabel(stepId, optionId) : undefined;
}

/** Their answers handed back as a plan, so the paywall follows something that feels like theirs. */
export function getPlanReady(
  answers: Record<string, OnboardingAnswer>,
  profile: ResetProfile,
): PlanReady {
  const becoming = optionLabel(answers, 'desiredIdentity');
  const minutes = optionLabel(answers, 'dailyCommitment');
  const rows: PlanReadyRow[] = [];

  if (becoming) {
    rows.push({ id: 'workingToward', label: 'working toward', value: becoming });
  }
  rows.push({
    id: 'eachDay',
    label: 'each day',
    value: `${minutes ?? 'a few minutes'}, at your pace`,
  });
  rows.push({ id: 'helps', label: 'what helps you', value: profile.whatUsuallyHelps });

  return {
    rows,
    note: minutes
      ? `Day 1 can start today. Your first step takes about ${minutes.replace('+', '')}.`
      : 'Day 1 can start today. Your first step only takes a few minutes.',
  };
}
