import {
  getMultiChoiceIds,
  getSingleChoiceId,
  joinNatural,
} from '@/features/onboarding/utils/answerReaders';
import type { OnboardingAnswer } from '@/features/onboarding/types/onboarding';

const OUT_OF_BALANCE_PHRASES: Record<string, string> = {
  mind: 'mind',
  energy: 'energy',
  habits: 'habits',
  confidence: 'confidence',
  relationships: 'relationships',
  direction: 'direction',
  routine: 'routine',
};

const CARRYING_FALLBACK = 'especially when more than one part of life feels off at once.';

export function deriveCarryingSubtitle(answers: Record<string, OnboardingAnswer>): string {
  const selectedIds = getMultiChoiceIds(answers, 'outOfBalance');
  const phrases = selectedIds
    .filter((id) => id !== 'everything')
    .map((id) => OUT_OF_BALANCE_PHRASES[id])
    .filter((phrase): phrase is string => Boolean(phrase));

  if (phrases.length === 0) {
    return CARRYING_FALLBACK;
  }

  if (phrases.length === 1) {
    const onlyPhrase = phrases[0];
    if (!onlyPhrase) {
      return CARRYING_FALLBACK;
    }
    return `especially when your ${onlyPhrase} feels off.`;
  }

  if (phrases.length === 2) {
    return `especially when your ${joinNatural(phrases)} feel off at once.`;
  }

  return `especially when your ${joinNatural(phrases)} all feel off at once.`;
}

const CONSISTENCY_INSIGHT: Record<string, string> = {
  starting: 'you seem to spend more time preparing to change than actually starting.',
  'staying-consistent': 'you can start — keeping momentum is what gets difficult.',
  restarting: "the hardest part isn't slipping. it's finding your way back.",
};

const CONSISTENCY_FALLBACK = 'the pattern matters more than the bad day.';

export function deriveConsistencyInsight(answers: Record<string, OnboardingAnswer>): string {
  const stage = getSingleChoiceId(answers, 'consistencyStage');
  if (!stage) {
    return CONSISTENCY_FALLBACK;
  }

  return CONSISTENCY_INSIGHT[stage] ?? CONSISTENCY_FALLBACK;
}
