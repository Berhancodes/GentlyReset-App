import { getOptionIconSource } from '@/features/onboarding/data/onboardingAssets';
import type { MultiChoiceStep, SingleChoiceStep } from '@/features/onboarding/types/onboarding';

const SHORT_LABEL_LIMIT = 36;

/**
 * Page 2-style 2-column illustrated cards when answers are short and have art.
 * Longer sentence answers stay as horizontal cards.
 */
export function shouldUseIllustratedGrid(step: MultiChoiceStep | SingleChoiceStep): boolean {
  if (step.id === 'reason') {
    return true;
  }

  const { options } = step;
  if (options.length < 4 || options.length > 8) {
    return false;
  }

  if (options.some((option) => option.description)) {
    return false;
  }

  if (options.some((option) => option.label.length > SHORT_LABEL_LIMIT)) {
    return false;
  }

  return options.every((option) => Boolean(getOptionIconSource(option.id)));
}
