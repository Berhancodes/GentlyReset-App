import type { OnboardingAnswer, OnboardingStep } from '@/features/onboarding/types/onboarding';

export function canProceed(step: OnboardingStep, answer: OnboardingAnswer | undefined): boolean {
  if (!step.required) {
    if (step.type === 'textInput') {
      return answer?.type === 'textInput' && answer.value.trim().length > 0;
    }
    return true;
  }

  switch (step.type) {
    case 'welcome':
    case 'mascotIntro':
    case 'story':
    case 'beforeAfter':
    case 'loading':
    case 'result':
    case 'resultDetails':
    case 'sharePreview':
    case 'final':
    case 'paywall':
      return true;
    case 'singleChoice':
      return answer?.type === 'singleChoice' && Boolean(answer.optionId);
    case 'multiChoice': {
      if (answer?.type !== 'multiChoice') {
        return false;
      }
      const minSelections = step.minSelections ?? 1;
      const maxSelections = step.maxSelections ?? answer.optionIds.length;
      return answer.optionIds.length >= minSelections && answer.optionIds.length <= maxSelections;
    }
    case 'scale': {
      if (answer?.type !== 'scale') {
        return false;
      }
      return step.points.some((point) => point.value === answer.value);
    }
    case 'textInput':
      return answer?.type === 'textInput' && answer.value.trim().length > 0;
    default: {
      const exhaustive: never = step;
      return exhaustive;
    }
  }
}
