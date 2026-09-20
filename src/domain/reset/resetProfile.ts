import {
  isResetTypeId,
  LEGACY_FALLBACK_RESET_TYPE_ID,
  RESET_TYPE_NAMES,
  type ResetProfile,
  type ResetTypeId,
} from './types';

const SHARED_ILLUSTRATION = 'overloadedDreamer' as const;

function profile(
  fields: Omit<ResetProfile, 'illustrationKey' | 'name'> & { id: ResetTypeId },
): ResetProfile {
  return {
    ...fields,
    name: RESET_TYPE_NAMES[fields.id],
    illustrationKey: SHARED_ILLUSTRATION,
  };
}

const OVERLOADED_DREAMER: ResetProfile = profile({
  id: 'overloaded-dreamer',
  shortSummary: "you don't lack ambition. you care about too many things at once.",
  summary: "you don't lack ambition. you care about too many things at once.",
  description:
    'you see so many versions of a better life that it is hard to pick one and stay with it.',
  advice: "your reset isn't about trying harder.",
  emphasized: "it's about one thing at a time.",
  strength: 'ambitious — you see possibility everywhere',
  pattern: 'trying to change everything at once',
  resetApproach: 'one thing at a time',
  biggestPattern: 'trying to change everything at once',
  whatUsuallyHelps: 'one commitment, visible progress, and permission to ignore the rest',
  homeSupportLine: 'one thing is enough today.',
  missedDayLine: "a missed day isn't a reason to pile on a make-up mountain.",
  strengths: ['ambitious', 'sees possibility', 'hopeful'],
  challenges: ['too many starting points', 'all-or-nothing weeks', 'rarely finishes one thing'],
  shareQuote: "apparently I don't need a new life.\nI need to stop trying to fix mine all at once.",
});

const SOFT_RESTARTER: ResetProfile = profile({
  id: 'soft-restarter',
  shortSummary: "you don't fail the plan. you disappear after a bad day.",
  summary: "you don't fail the plan. you disappear after a bad day.",
  description:
    'a slip starts to feel like the whole thing is ruined, so restarting feels safer than continuing.',
  advice: "your reset isn't a new Monday.",
  emphasized: "it's learning to continue.",
  strength: 'you care enough to keep trying',
  pattern: 'a slip starts feeling like starting over',
  resetApproach: 'learn to continue instead of restart',
  biggestPattern: 'a slip starts feeling like starting over',
  whatUsuallyHelps: 'softer re-entry, the same plan, and no make-up mountain',
  homeSupportLine: "you don't have to start over. just continue.",
  missedDayLine: 'you can continue from here. no restart required.',
  strengths: ['keeps trying', 'self-aware', 'cares deeply'],
  challenges: ['all-or-nothing after a slip', 'restart rituals', 'hard to come back'],
  shareQuote: "apparently I don't fail the plan.\nI just treat a bad day like a restart.",
});

const ALMOST_STARTER: ResetProfile = profile({
  id: 'almost-starter',
  shortSummary: "you don't need another plan. you need a first five minutes.",
  summary: "you don't need another plan. you need a first five minutes.",
  description:
    'you care about doing it properly, so waiting until you feel ready keeps getting in the way of beginning.',
  advice: "your reset isn't a better plan.",
  emphasized: "it's beginning before you feel ready.",
  strength: 'thoughtful — you want to do things properly',
  pattern: 'waiting, planning, or overthinking delays action',
  resetApproach: 'begin before you feel completely ready',
  biggestPattern: 'waiting, planning, or overthinking delays action',
  whatUsuallyHelps: 'tiny starts, a lower bar, and beginning before it is perfect',
  homeSupportLine: "you don't need to feel ready. just begin.",
  missedDayLine: 'starting small still counts. five minutes is enough to begin again.',
  strengths: ['thoughtful', 'wants to do it right', 'self-aware'],
  challenges: ['overthinking', 'waiting to feel ready', 'plans without starts'],
  shareQuote: "apparently I don't need another plan.\nI need a first five minutes.",
});

const FADING_FLAME: ResetProfile = profile({
  id: 'fading-flame',
  shortSummary: 'you can begin. the hard part is staying when it feels ordinary.',
  summary: 'you can begin. the hard part is staying when it feels ordinary.',
  description:
    'the first burst of motivation is easy. keeping going after the excitement fades is where things slip.',
  advice: "your reset isn't about getting the spark back.",
  emphasized: "it's making consistency lighter than motivation.",
  strength: 'you create momentum quickly',
  pattern: 'motivation fades after the initial excitement',
  resetApproach: 'make consistency lighter than motivation',
  biggestPattern: 'motivation fades after the initial excitement',
  whatUsuallyHelps: 'lighter habits, smaller repeats, and progress that does not need hype',
  homeSupportLine: 'ordinary progress is still progress.',
  missedDayLine: "an ordinary next step is enough. you don't need the spark back first.",
  strengths: ['creates momentum', 'enthusiastic starter', 'cares about progress'],
  challenges: ['motivation fades', 'ordinary days feel pointless', 'hard to stay'],
  shareQuote: 'apparently I can start.\nI just need ordinary days to count.',
});

export const RESET_PROFILES: Record<ResetTypeId, ResetProfile> = {
  'overloaded-dreamer': OVERLOADED_DREAMER,
  'soft-restarter': SOFT_RESTARTER,
  'almost-starter': ALMOST_STARTER,
  'fading-flame': FADING_FLAME,
};

/**
 * Profile lookup only. Unknown or empty ids fall back to overloaded-dreamer
 * for old snapshots. Does not classify answers or reclassify a valid id.
 */
export function getResetProfile(profileId: string): ResetProfile {
  if (isResetTypeId(profileId)) {
    return RESET_PROFILES[profileId];
  }
  return RESET_PROFILES[LEGACY_FALLBACK_RESET_TYPE_ID];
}
