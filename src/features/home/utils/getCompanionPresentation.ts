import {
  getCompanionState,
  type CompanionState,
  type CompanionStateSource,
} from '../../../domain/reset/companionState';
import { getResetProfile } from '../../../domain/reset/resetProfile';
import { getHomeGreeting } from './homeCopy';

/**
 * Semantic companion clips. Home maps these 1:1 later; the reset engine never reads them.
 */
export type CompanionAnimationId =
  'idle' | 'wave' | 'encourage' | 'celebrate' | 'welcome_back' | 'milestone';

export type CompanionCtaDestination = 'home' | 'journey';

export type CompanionPresentation = {
  state: CompanionState;
  greeting: string;
  supportingMessage: string;
  animationId: CompanionAnimationId;
  primaryCtaLabel: string;
  primaryCtaDestination: CompanionCtaDestination;
};

export type CompanionPresentationInput = CompanionStateSource & {
  resetTypeId: string;
  firstName?: string;
  now?: Date;
};

const ANIMATION_BY_STATE: Record<CompanionState, CompanionAnimationId> = {
  new_user: 'wave',
  ready: 'idle',
  started: 'encourage',
  completed: 'celebrate',
  returned_after_miss: 'welcome_back',
  milestone: 'milestone',
  cycle_complete: 'milestone',
};

const CTA_LABEL_BY_STATE: Record<CompanionState, string> = {
  new_user: 'begin',
  ready: "start today's reset",
  started: "continue today's reset",
  completed: "that's enough for today",
  returned_after_miss: "start today's reset",
  milestone: "that's enough for today",
  cycle_complete: "that's enough for today",
};

const CTA_DESTINATION_BY_STATE: Record<CompanionState, CompanionCtaDestination> = {
  new_user: 'home',
  ready: 'journey',
  started: 'journey',
  completed: 'journey',
  returned_after_miss: 'journey',
  milestone: 'journey',
  cycle_complete: 'home',
};

function firstNameToken(firstName: string | undefined): string | undefined {
  if (firstName == null) {
    return undefined;
  }
  const trimmed = firstName.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function withName(base: string, firstName: string | undefined): string {
  const name = firstNameToken(firstName);
  return name ? `${base}, ${name}` : base;
}

function greetingForState(state: CompanionState, firstName: string | undefined, now: Date): string {
  if (state === 'new_user') {
    return withName('welcome', firstName);
  }
  return withName(getHomeGreeting(now), firstName);
}

function supportingMessageForState(
  state: CompanionState,
  resetTypeId: string,
  currentDay: number,
): string {
  const profile = getResetProfile(resetTypeId);

  if (state === 'new_user') {
    return 'this is your cozy place to begin.';
  }
  if (state === 'ready') {
    return profile.homeSupportLine;
  }
  if (state === 'started') {
    return profile.startedLine;
  }
  if (state === 'returned_after_miss') {
    return profile.missedDayLine;
  }
  if (state === 'milestone') {
    if (currentDay === 7) {
      return profile.milestoneDay7Line;
    }
    if (currentDay === 14) {
      return profile.milestoneDay14Line;
    }
    if (currentDay === 21) {
      return profile.milestoneDay21Line;
    }
    return 'look at that. you showed up again.';
  }
  if (state === 'cycle_complete') {
    return profile.cycleCompleteLine;
  }
  return profile.completedLine;
}

/**
 * Home-facing companion view. Deterministic. Reads the same reset snapshot
 * Journey mutates, so completing a task updates this on the next render.
 */
export function getCompanionPresentation(input: CompanionPresentationInput): CompanionPresentation {
  const state = getCompanionState(input);
  const now = input.now ?? new Date();

  return {
    state,
    greeting: greetingForState(state, input.firstName, now),
    supportingMessage: supportingMessageForState(state, input.resetTypeId, input.currentDay),
    animationId: ANIMATION_BY_STATE[state],
    primaryCtaLabel: CTA_LABEL_BY_STATE[state],
    primaryCtaDestination: CTA_DESTINATION_BY_STATE[state],
  };
}
