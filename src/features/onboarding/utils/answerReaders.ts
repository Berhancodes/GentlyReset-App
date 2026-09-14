import type { OnboardingAnswer } from '@/features/onboarding/types/onboarding';

export function getSingleChoiceId(
  answers: Record<string, OnboardingAnswer>,
  stepId: string,
): string | undefined {
  const answer = answers[stepId];
  return answer?.type === 'singleChoice' ? answer.optionId : undefined;
}

export function getMultiChoiceIds(
  answers: Record<string, OnboardingAnswer>,
  stepId: string,
): readonly string[] {
  const answer = answers[stepId];
  return answer?.type === 'multiChoice' ? answer.optionIds : [];
}

export function getTextInputValue(
  answers: Record<string, OnboardingAnswer>,
  stepId: string,
): string | undefined {
  const answer = answers[stepId];
  if (answer?.type !== 'textInput') {
    return undefined;
  }

  const trimmed = answer.value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function joinNatural(items: readonly string[]): string {
  if (items.length === 0) {
    return '';
  }
  if (items.length === 1) {
    return items[0] ?? '';
  }
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  const rest = items.slice(0, -1).join(', ');
  const last = items[items.length - 1];
  return `${rest}, and ${last}`;
}
