import type { OnboardingAnswer } from '../types/onboarding';
import { getSingleChoiceId } from './answerReaders';

const TIME_LABEL: Record<string, string> = {
  five: '5 minutes/day',
  ten: '10 minutes/day',
  twenty: '20 minutes/day',
  'thirty-plus': '30+ minutes/day',
};

const SUPPORT_LABEL: Record<string, string> = {
  'be-gentle': 'gentle support',
  'remind-what-matters': 'reminders of what matters',
  'something-small': 'small next steps',
  accountable: 'gentle accountability',
  'need-to-hear': 'honest prompts',
  depends: 'support that flexes with the day',
};

export type ResetApproachSummary = {
  time?: string;
  support?: string;
  length: string;
};

export function deriveResetApproach(
  answers: Record<string, OnboardingAnswer>,
): ResetApproachSummary {
  const timeId = getSingleChoiceId(answers, 'dailyCommitment');
  const supportId = getSingleChoiceId(answers, 'supportStyle');

  return {
    time: timeId ? TIME_LABEL[timeId] : undefined,
    support: supportId ? SUPPORT_LABEL[supportId] : undefined,
    length: '30 days',
  };
}
