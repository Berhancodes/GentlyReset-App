export type OnboardingStepType =
  | 'welcome'
  | 'singleChoice'
  | 'multiChoice'
  | 'scale'
  | 'textInput'
  | 'story'
  | 'loading'
  | 'result';

export type OnboardingOption = {
  id: string;
  label: string;
  description?: string;
};

type BaseOnboardingStep = {
  id: string;
  chapter: string;
  title: string;
  subtitle?: string;
  asset?: string;
  required: boolean;
};

export type WelcomeStep = BaseOnboardingStep & {
  type: 'welcome';
  ctaLabel: string;
};

export type SingleChoiceStep = BaseOnboardingStep & {
  type: 'singleChoice';
  options: readonly OnboardingOption[];
};

export type MultiChoiceStep = BaseOnboardingStep & {
  type: 'multiChoice';
  options: readonly OnboardingOption[];
  minSelections?: number;
  maxSelections?: number;
};

export type ScaleStep = BaseOnboardingStep & {
  type: 'scale';
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
};

export type TextInputStep = BaseOnboardingStep & {
  type: 'textInput';
  placeholder?: string;
  maxLength?: number;
};

export type StoryStep = BaseOnboardingStep & {
  type: 'story';
  body: string;
  ctaLabel?: string;
};

export type LoadingStep = BaseOnboardingStep & {
  type: 'loading';
  durationMs: number;
};

export type ResultStep = BaseOnboardingStep & {
  type: 'result';
  body: string;
  ctaLabel: string;
};

export type OnboardingStep =
  | WelcomeStep
  | SingleChoiceStep
  | MultiChoiceStep
  | ScaleStep
  | TextInputStep
  | StoryStep
  | LoadingStep
  | ResultStep;

export type OnboardingAnswer =
  | { type: 'welcome' }
  | { type: 'singleChoice'; optionId: string }
  | { type: 'multiChoice'; optionIds: readonly string[] }
  | { type: 'scale'; value: number }
  | { type: 'textInput'; value: string }
  | { type: 'story' }
  | { type: 'loading' }
  | { type: 'result' };
