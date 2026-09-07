import { create } from 'zustand';

import type { OnboardingAnswer } from '@/features/onboarding/types/onboarding';

type OnboardingState = {
  currentStepIndex: number;
  answers: Record<string, OnboardingAnswer>;
  hasCompletedOnboarding: boolean;
};

type OnboardingActions = {
  setAnswer: (stepId: string, answer: OnboardingAnswer) => void;
  next: () => void;
  back: () => void;
  reset: () => void;
  completeOnboarding: () => void;
};

const initialState: OnboardingState = {
  currentStepIndex: 0,
  answers: {},
  hasCompletedOnboarding: false,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>((set) => ({
  ...initialState,
  setAnswer: (stepId, answer) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [stepId]: answer,
      },
    })),
  next: () =>
    set((state) => ({
      currentStepIndex: state.currentStepIndex + 1,
    })),
  back: () =>
    set((state) => ({
      currentStepIndex: Math.max(0, state.currentStepIndex - 1),
    })),
  reset: () => set(initialState),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
}));
