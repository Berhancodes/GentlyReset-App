import type { OnboardingAnswer, OnboardingStep } from '@/features/onboarding/types/onboarding';

export function canProceed(step: OnboardingStep, answer: OnboardingAnswer | undefined): boolean {
  if (!step.required) {
    return true;
  }

  switch (step.type) {
    case 'welcome':
    case 'story':
    case 'loading':
    case 'result':
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
    case 'scale':
      return answer?.type === 'scale' && answer.value >= step.min && answer.value <= step.max;
    case 'textInput':
      return answer?.type === 'textInput' && answer.value.trim().length > 0;
    default: {
      const exhaustive: never = step;
      return exhaustive;
    }
  }
}
