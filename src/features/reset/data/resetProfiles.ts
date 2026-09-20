import type { OnboardingAnswer, ResetProfile } from '@/features/onboarding/types/onboarding';
import { deriveResetType } from '@/features/reset/utils/deriveResetType';

import { getResetProfile } from '../../../domain/reset/resetProfile';

export { RESET_PROFILES, getResetProfile } from '../../../domain/reset/resetProfile';

/** Classify from current onboarding answers (used during reveal, before freeze). */
export function getResetProfileForAnswers(answers: Record<string, OnboardingAnswer>): ResetProfile {
  return getResetProfile(deriveResetType(answers).id);
}
