export const ONBOARDING_CHAPTERS = [
  { id: 'where-you-are', label: 'where you are' },
  { id: 'whats-holding-you-back', label: "what's holding you back" },
  { id: 'where-youre-going', label: "where you're going" },
  { id: 'your-reset', label: 'your reset' },
] as const;

export type OnboardingChapterId = (typeof ONBOARDING_CHAPTERS)[number]['id'];

export type OnboardingIllustrationSize = 'default' | 'large' | 'hero';

export type OnboardingIllustrationKey =
  | 'welcome'
  | 'carrying'
  | 'detective'
  | 'path'
  | 'self'
  | 'buildingReset'
  | 'gotYou'
  | 'overloadedDreamer'
  | 'companion'
  | 'journey';

export type ResetProfile = {
  id: string;
  name: string;
  summary: string;
  description: string;
  advice: string;
  emphasized: string;
  biggestPattern: string;
  whatUsuallyHelps: string;
  strengths: readonly string[];
  challenges: readonly string[];
  shareQuote: string;
  illustrationKey: OnboardingIllustrationKey;
};

export type QuestionLayout = 'grid2' | 'grid3' | 'stacked' | 'stackedWithSubtitle' | 'feelingList';

export type OnboardingOption = {
  id: string;
  label: string;
  description?: string;
  selectHaptic?: 'selection' | 'success';
};

export type ScalePoint = {
  value: number;
  label: string;
};

export type LoadingStage = {
  id: string;
  label: string;
};

export type PlanPreviewItem = {
  dayLabel: string;
  title: string;
};

type BaseOnboardingStep = {
  id: string;
  chapter?: OnboardingChapterId;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  illustrationKey?: OnboardingIllustrationKey;
  illustrationSize?: OnboardingIllustrationSize;
  hideProgress?: boolean;
  required: boolean;
};

export type WelcomeStep = BaseOnboardingStep & {
  type: 'welcome';
  ctaLabel: string;
};

export type SingleChoiceStep = BaseOnboardingStep & {
  type: 'singleChoice';
  options: readonly OnboardingOption[];
  comfortable?: boolean;
  layout?: QuestionLayout;
};

export type MultiChoiceStep = BaseOnboardingStep & {
  type: 'multiChoice';
  options: readonly OnboardingOption[];
  minSelections?: number;
  maxSelections?: number;
  layout?: QuestionLayout;
};

export type ScaleStep = BaseOnboardingStep & {
  type: 'scale';
  points: readonly ScalePoint[];
};

export type TextInputStep = BaseOnboardingStep & {
  type: 'textInput';
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
};

export type StoryStep = BaseOnboardingStep & {
  type: 'story';
  body?: string;
  ctaLabel: string;
  dynamicCopy?: 'outOfBalance' | 'consistencyStage';
};

export type BeforeAfterStep = BaseOnboardingStep & {
  type: 'beforeAfter';
  ctaLabel: string;
};

export type LoadingStep = BaseOnboardingStep & {
  type: 'loading';
  stages: readonly LoadingStage[];
  /**
   * Mock-only total duration. Replace with real personalization progress later
   * without rewriting LoadingScreen.
   */
  mockDurationMs: number;
};

export type ResultStep = BaseOnboardingStep & {
  type: 'result';
  profileId: string;
  ctaLabel: string;
  secondaryCtaLabel?: string;
};

export type ResultDetailsStep = BaseOnboardingStep & {
  type: 'resultDetails';
  profileId: string;
  ctaLabel: string;
};

export type SharePreviewStep = BaseOnboardingStep & {
  type: 'sharePreview';
  profileId: string;
  shareCtaLabel: string;
  continueCtaLabel: string;
};

export type FinalStep = BaseOnboardingStep & {
  type: 'final';
  ctaLabel: string;
  preview: readonly PlanPreviewItem[];
};

export type PaywallStep = BaseOnboardingStep & {
  type: 'paywall';
  ctaLabel: string;
  secondaryCtaLabel: string;
  benefits: readonly string[];
};

export type OnboardingStep =
  | WelcomeStep
  | SingleChoiceStep
  | MultiChoiceStep
  | ScaleStep
  | TextInputStep
  | StoryStep
  | BeforeAfterStep
  | LoadingStep
  | ResultStep
  | ResultDetailsStep
  | SharePreviewStep
  | FinalStep
  | PaywallStep;

export type OnboardingAnswer =
  | { type: 'welcome' }
  | { type: 'singleChoice'; optionId: string }
  | { type: 'multiChoice'; optionIds: readonly string[] }
  | { type: 'scale'; value: number }
  | { type: 'textInput'; value: string }
  | { type: 'story' }
  | { type: 'beforeAfter' }
  | { type: 'loading' }
  | { type: 'result' }
  | { type: 'resultDetails' }
  | { type: 'sharePreview' }
  | { type: 'final' }
  | { type: 'paywall' };
