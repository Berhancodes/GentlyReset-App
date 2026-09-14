import type { ResetPersonalization } from '@/features/reset/types';

const IDLE_BY_SUPPORT: Record<string, string> = {
  'be-gentle': 'small is enough today.',
  'remind-what-matters': 'this is the promise you made yourself.',
  'something-small': 'we only need one little win.',
  accountable: 'one reset. then you are done.',
  'need-to-hear': "you don't have to fix everything today.",
  depends: 'meet yourself where you are.',
};

const MISSED_BY_RESPONSE: Record<string, string> = {
  continue: 'we can just pick it back up.',
  'easier-day': 'nothing to catch up on. just today.',
  'remind-why': 'remember why you started. then begin small.',
  'ask-what-happened': 'no story needed. just today.',
  'little-push': 'one small reset. that is all.',
};

export type CompanionMoment = 'idle' | 'started' | 'completed' | 'missed';

export function getCompanionMessage(
  moment: CompanionMoment,
  personalization: ResetPersonalization,
  minutes: number,
): string {
  if (moment === 'completed') {
    return "that's a real day. I'm proud of you.";
  }

  if (moment === 'missed') {
    const missed = personalization.missedDayResponse
      ? MISSED_BY_RESPONSE[personalization.missedDayResponse]
      : undefined;
    return missed ?? 'nothing to catch up on. just today.';
  }

  if (moment === 'started') {
    return 'take it slowly. I will be right here.';
  }

  if (minutes <= 5 && personalization.supportStyle !== 'accountable') {
    return "five minutes. that's it.";
  }

  const support = personalization.supportStyle
    ? IDLE_BY_SUPPORT[personalization.supportStyle]
    : undefined;
  return support ?? 'small is enough today.';
}
