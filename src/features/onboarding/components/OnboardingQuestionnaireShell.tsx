import { createContext, useContext, type ReactNode } from 'react';

const OnboardingQuestionnaireShellContext = createContext(false);

export function OnboardingQuestionnaireShellProvider({ children }: { children: ReactNode }) {
  return (
    <OnboardingQuestionnaireShellContext.Provider value={true}>
      {children}
    </OnboardingQuestionnaireShellContext.Provider>
  );
}

export function useOnboardingQuestionnaireShell(): boolean {
  return useContext(OnboardingQuestionnaireShellContext);
}
