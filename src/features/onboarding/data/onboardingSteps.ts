import type { OnboardingStep } from '@/features/onboarding/types/onboarding';

/**
 * Sample onboarding only. The production questionnaire will replace this list
 * without changing screen components.
 */
export const ONBOARDING_STEPS = [
  {
    id: 'what-brought-you',
    type: 'singleChoice',
    chapter: 'arrival',
    title: 'what brought you here today?',
    subtitle: 'There is no wrong answer. Choose the one that feels closest.',
    required: true,
    options: [
      { id: 'stuck', label: 'I feel stuck' },
      { id: 'overwhelmed', label: "I'm overwhelmed" },
      { id: 'feel-better', label: 'I want to feel better' },
      { id: 'grow', label: 'I want to grow' },
    ],
  },
  {
    id: 'what-to-hold',
    type: 'multiChoice',
    chapter: 'arrival',
    title: 'what would you like help holding?',
    subtitle: 'Choose as many as you like. You can change this later.',
    required: true,
    minSelections: 1,
    maxSelections: 4,
    options: [
      { id: 'rest', label: 'Rest' },
      { id: 'clarity', label: 'Clarity' },
      { id: 'kindness', label: 'Kindness toward myself' },
      { id: 'momentum', label: 'Gentle momentum' },
    ],
  },
  {
    id: 'how-heavy',
    type: 'scale',
    chapter: 'check-in',
    title: 'how heavy does today feel?',
    subtitle: 'A quiet check-in. Nothing to fix.',
    required: true,
    min: 1,
    max: 5,
    minLabel: 'Very heavy',
    maxLabel: 'Manageable',
  },
  {
    id: 'you-are-not-behind',
    type: 'story',
    chapter: 'pause',
    title: 'you are not behind.',
    body: 'Gently Reset is a small, warm place to come back to yourself. We will move slowly, and we will not ask you to become someone else.',
    ctaLabel: 'I am ready',
    required: false,
  },
  {
    id: 'settling-in',
    type: 'loading',
    chapter: 'weaving',
    title: 'settling your space…',
    subtitle: 'This only takes a moment.',
    required: false,
    durationMs: 1800,
  },
] as const satisfies readonly OnboardingStep[];

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]['id'];
