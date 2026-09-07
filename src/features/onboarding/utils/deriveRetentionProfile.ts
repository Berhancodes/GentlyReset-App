import { getSingleChoiceId } from '@/features/onboarding/utils/answerReaders';
import type { OnboardingAnswer } from '@/features/onboarding/types/onboarding';

export type RetentionProfile = {
  churnRisk?: string;
  consistencyStage?: string;
  missedDayResponse?: string;
  supportStyle?: string;
  dailyCommitment?: string;
};

/**
 * Extracts retention-related onboarding answers for later use.
 * Does not change app behavior yet.
 */
export function deriveRetentionProfile(
  answers: Record<string, OnboardingAnswer>,
): RetentionProfile {
  return {
    churnRisk: getSingleChoiceId(answers, 'churnRisk'),
    consistencyStage: getSingleChoiceId(answers, 'consistencyStage'),
    missedDayResponse: getSingleChoiceId(answers, 'missedDayResponse'),
    supportStyle: getSingleChoiceId(answers, 'supportStyle'),
    dailyCommitment: getSingleChoiceId(answers, 'dailyCommitment'),
  };
}
