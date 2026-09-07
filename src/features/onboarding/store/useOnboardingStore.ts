import { create } from 'zustand';

import { ONBOARDING_STEPS } from '@/features/onboarding/data/onboardingSteps';
import type { OnboardingAnswer, OnboardingStep } from '@/features/onboarding/types/onboarding';
import { canProceed } from '@/features/onboarding/utils/canProceed';
import { toggleMultiSelection } from '@/features/onboarding/utils/toggleMultiSelection';

const LAST_STEP_INDEX = ONBOARDING_STEPS.length - 1;

function clampStepIndex(index: number): number {
  return Math.min(LAST_STEP_INDEX, Math.max(0, index));
}

type OnboardingState = {
  currentStepIndex: number;
  answers: Record<string, OnboardingAnswer>;
  hasCompletedOnboarding: boolean;
};

type OnboardingActions = {
  setAnswer: (stepId: string, answer: OnboardingAnswer) => void;
  toggleMultiAnswer: (stepId: string, optionId: string, maxSelections?: number) => void;
  next: () => void;
  back: () => void;
  goToStep: (index: number) => void;
  canContinue: (step: OnboardingStep) => boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

const initialState: OnboardingState = {
  currentStepIndex: 0,
  answers: {},
  hasCompletedOnboarding: false,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>((set, get) => ({
  ...initialState,
  setAnswer: (stepId, answer) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [stepId]: answer,
      },
    })),
  toggleMultiAnswer: (stepId, optionId, maxSelections) =>
    set((state) => {
      const current = state.answers[stepId];
      const selectedIds = current?.type === 'multiChoice' ? current.optionIds : [];

      return {
        answers: {
          ...state.answers,
          [stepId]: {
            type: 'multiChoice',
            optionIds: toggleMultiSelection(selectedIds, optionId, maxSelections),
          },
        },
      };
    }),
  next: () =>
    set((state) => ({
      currentStepIndex: clampStepIndex(state.currentStepIndex + 1),
    })),
  back: () =>
    set((state) => ({
      currentStepIndex: clampStepIndex(state.currentStepIndex - 1),
    })),
  goToStep: (index) => set({ currentStepIndex: clampStepIndex(index) }),
  canContinue: (step) => canProceed(step, get().answers[step.id]),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  resetOnboarding: () => set(initialState),
}));
