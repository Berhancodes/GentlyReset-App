import { getMultiChoiceIds, getSingleChoiceId } from '@/features/onboarding/utils/answerReaders';
import type { OnboardingAnswer } from '@/features/onboarding/types/onboarding';

export type BeforeAfterSummary = {
  today: readonly string[];
  later: readonly string[];
};

const TODAY_FROM_FEELING: Record<string, string> = {
  drained: 'tired',
  overwhelmed: 'overwhelmed',
  disconnected: 'disconnected',
  'getting-through': 'getting through it',
  'mostly-okay': 'mostly okay',
  'pretty-good': 'pretty good',
};

const LATER_FROM_FEELING: Record<string, string> = {
  calm: 'calmer',
  confident: 'more confident',
  motivated: 'more motivated',
  proud: 'proud of yourself',
  energized: 'more energized',
  present: 'more present',
  hopeful: 'more hopeful',
  'in-control': 'more in control',
};

const LATER_FROM_OUTCOME: Record<string, string> = {
  'wake-up-better': 'waking up better',
  consistent: 'more consistent',
  'quieter-mind': 'a quieter mind',
  'trust-myself': 'trusting yourself',
  'more-energy': 'more energy',
  'taking-care': 'taking care of yourself',
  'working-toward': 'a clearer direction',
  'feel-like-me': 'like yourself again',
};

const FALLBACK: BeforeAfterSummary = {
  today: ['overwhelmed', 'inconsistent', 'tired'],
  later: ['calmer', 'more consistent', 'proud of yourself'],
};

function uniqueTake(values: readonly string[], limit: number): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    if (seen.has(value)) {
      continue;
    }
    seen.add(value);
    result.push(value);
    if (result.length >= limit) {
      break;
    }
  }
  return result;
}

export function deriveBeforeAfterSummary(
  answers: Record<string, OnboardingAnswer>,
): BeforeAfterSummary {
  const feeling = getSingleChoiceId(answers, 'recentFeeling');
  const todayFromFeeling = feeling ? TODAY_FROM_FEELING[feeling] : undefined;
  const today = uniqueTake(todayFromFeeling ? [todayFromFeeling] : [], 3);

  const later = uniqueTake(
    [
      ...getMultiChoiceIds(answers, 'desiredFeelings').map((id) => LATER_FROM_FEELING[id]),
      ...getMultiChoiceIds(answers, 'thirtyDayOutcome').map((id) => LATER_FROM_OUTCOME[id]),
    ].filter((value): value is string => Boolean(value)),
    3,
  );

  if (today.length === 0 && later.length === 0) {
    return FALLBACK;
  }

  return {
    today: today.length > 0 ? today : FALLBACK.today,
    later: later.length > 0 ? later : FALLBACK.later,
  };
}
