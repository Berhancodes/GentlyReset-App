import type { StagePose } from '../stage/stagePoseNames';

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
  | 'softRestarter'
  | 'almostStarter'
  | 'fadingFlame'
  | 'allInHeart'
  | 'quietDrain'
  | 'driftingCompass'
  | 'quietStranger'
  | 'softScatter'
  | 'companion'
  | 'journey';

export type ResetProfile = {
  id: string;
  name: string;
  summary: string;
  shortSummary: string;
  description: string;
  advice: string;
  emphasized: string;
  biggestPattern: string;
  whatUsuallyHelps: string;
  strength: string;
  pattern: string;
  resetApproach: string;
  homeSupportLine: string;
  missedDayLine: string;
  strengths: readonly string[];
  challenges: readonly string[];
  shareQuote: string;
  illustrationKey: OnboardingIllustrationKey;
};

export type QuestionLayout =
  | 'grid2'
  | 'grid3'
  | 'stacked'
  | 'stackedWithSubtitle'
  | 'feelingList'
  /** Clean stage: soft pills under the mascot. */
  | 'chips'
  /** Clean stage: full-width answers with a description. */
  | 'cards'
  /** Clean stage: a snapping slider for ordered answers. */
  | 'slider'
  /** Clean stage: each pick drops a stone into the sack he carries. */
  | 'sack'
  /** Clean stage: each pick plants a sprout by his feet. */
  | 'plant';

/** What the mascot does: a pose, and optionally a short line in his speech bubble. */
export type MascotReaction = {
  pose: StagePose;
  line?: string;
};

export type OnboardingOption = {
  id: string;
  label: string;
  description?: string;
  selectHaptic?: 'selection' | 'success';
  /** How the mascot reacts when this answer is chosen. */
  reaction?: MascotReaction;
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
  /** The mascot's pose and line when this step appears on the clean stage. */
  mascot?: MascotReaction;
};

/** A worry that pops up over the mascot and drops into his sack on the opening screen. */
export type WelcomeWorry = {
  label: string;
  /** What he says as it lands. */
  line?: string;
};

export type WelcomeStep = BaseOnboardingStep & {
  type: 'welcome';
  /** One per sinking frame: each lands in the sack and weighs him down a step further. */
  worries: readonly WelcomeWorry[];
  ctaLabel: string;
  signInPrompt?: string;
  signInLabel?: string;
};

export type MascotIntroStep = BaseOnboardingStep & {
  type: 'mascotIntro';
  /** One complete playthrough of the source GIF, in milliseconds. */
  durationMs: number;
  /** Pause after arrival before the name prompt appears. */
  holdMs: number;
  nameMaxLength: number;
};

export type SingleChoiceStep = BaseOnboardingStep & {
  type: 'singleChoice';
  options: readonly OnboardingOption[];
  comfortable?: boolean;
  layout?: QuestionLayout;
  /** Slider answer chosen before the person moves it. */
  defaultOptionId?: string;
};

export type MultiChoiceStep = BaseOnboardingStep & {
  type: 'multiChoice';
  options: readonly OnboardingOption[];
  minSelections?: number;
  maxSelections?: number;
  layout?: QuestionLayout;
  /** Said instead of an answer's own line once more than two are chosen. */
  crowdedLine?: string;
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
  /** What the mascot does with the answer before the next step. */
  submitReaction?: MascotReaction;
};

export type StoryStep = BaseOnboardingStep & {
  type: 'story';
  body?: string;
  ctaLabel?: string;
  autoAdvance?: boolean;
  dynamicCopy?: 'outOfBalance' | 'consistencyStage';
  scene?: 'breathing' | 'noticing' | 'newLife' | 'companion';
};

export type LoadingStep = BaseOnboardingStep & {
  type: 'loading';
  stages: readonly LoadingStage[];
  /**
   * Mock-only total duration. Replace with real personalization progress later
   * without rewriting LoadingScreen.
   */
  mockDurationMs: number;
  scene?: 'building';
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

/** "This was made for me": the plan built from their answers, just before the paywall. */
export type PlanReadyStep = BaseOnboardingStep & {
  type: 'planReady';
  ctaLabel: string;
};

/** One row of the promise screen's timeline, from this week out to the whole year. */
export type SeasonTimelineItem = {
  when: string;
  title: string;
  body: string;
};

/** The whole year, season by season, then a small promise they press and hold to make. */
export type PromiseStep = BaseOnboardingStep & {
  type: 'promise';
  timeline: readonly SeasonTimelineItem[];
  reassurance: string;
  promise: string;
  kicker: string;
  hint: string;
  promisedKicker: string;
  promisedHint: string;
  ctaLabel: string;
  /** The button's label until the promise is made. */
  lockedCtaLabel: string;
};

export type PaywallStep = BaseOnboardingStep & {
  type: 'paywall';
  ctaLabel: string;
  secondaryCtaLabel: string;
  benefits: readonly string[];
};

export type OnboardingStep =
  | WelcomeStep
  | MascotIntroStep
  | SingleChoiceStep
  | MultiChoiceStep
  | ScaleStep
  | TextInputStep
  | StoryStep
  | LoadingStep
  | ResultStep
  | ResultDetailsStep
  | SharePreviewStep
  | FinalStep
  | PlanReadyStep
  | PromiseStep
  | PaywallStep;

export type OnboardingAnswer =
  | { type: 'welcome' }
  | { type: 'mascotIntro'; name: string }
  | { type: 'singleChoice'; optionId: string }
  | { type: 'multiChoice'; optionIds: readonly string[] }
  | { type: 'scale'; value: number }
  | { type: 'textInput'; value: string }
  | { type: 'story' }
  | { type: 'loading' }
  | { type: 'result' }
  | { type: 'resultDetails' }
  | { type: 'sharePreview' }
  | { type: 'final' }
  | { type: 'paywall' };
