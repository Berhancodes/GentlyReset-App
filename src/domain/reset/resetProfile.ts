import {
  isResetTypeId,
  LEGACY_FALLBACK_RESET_TYPE_ID,
  RESET_TYPE_NAMES,
  type ResetIllustrationKey,
  type ResetProfile,
  type ResetTypeId,
} from './types';

const RESET_ILLUSTRATION_KEYS: Record<ResetTypeId, ResetIllustrationKey> = {
  'overloaded-dreamer': 'overloadedDreamer',
  'soft-restarter': 'softRestarter',
  'almost-starter': 'almostStarter',
  'fading-flame': 'fadingFlame',
  'all-in-heart': 'allInHeart',
  'quiet-drain': 'quietDrain',
  'drifting-compass': 'driftingCompass',
  'quiet-stranger': 'quietStranger',
  'soft-scatter': 'softScatter',
};

function profile(
  fields: Omit<ResetProfile, 'illustrationKey' | 'name'> & { id: ResetTypeId },
): ResetProfile {
  return {
    ...fields,
    name: RESET_TYPE_NAMES[fields.id],
    illustrationKey: RESET_ILLUSTRATION_KEYS[fields.id],
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
  startedLine: 'stay with the one thing. the rest can wait.',
  completedLine: 'you chose one thing. that is real progress.',
  milestoneDay7Line: 'you made some room.',
  milestoneDay14Line: 'you protected the one thing.',
  milestoneDay21Line: 'you finished small loops instead of starting ten.',
  cycleCompleteLine: "you don't have to do everything to move forward.",
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
  startedLine: 'this is still the same plan. keep going.',
  completedLine: 'you continued. that is the whole skill.',
  milestoneDay7Line: 'you stayed with the same plan.',
  milestoneDay14Line: 'coming back is getting more ordinary.',
  milestoneDay21Line: 'you came back without starting over.',
  cycleCompleteLine: "you continued. you didn't restart your life.",
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
  startedLine: 'the first minutes are the whole point. keep going.',
  completedLine: 'you began. that was the hard part.',
  milestoneDay7Line: 'you practiced beginning.',
  milestoneDay14Line: 'you started before you felt ready.',
  milestoneDay21Line: 'starting is getting ordinary.',
  cycleCompleteLine: 'beginning is a skill you already used.',
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
  startedLine: 'keep it ordinary. that is how it stays.',
  completedLine: 'an ordinary day counted. good.',
  milestoneDay7Line: 'you made the bar ordinary.',
  milestoneDay14Line: 'you stayed after the exciting part.',
  milestoneDay21Line: 'you stayed through a quieter week.',
  cycleCompleteLine: 'ordinary days count. you kept going without a mood.',
  strengths: ['creates momentum', 'enthusiastic starter', 'cares about progress'],
  challenges: ['motivation fades', 'ordinary days feel pointless', 'hard to stay'],
  shareQuote: 'apparently I can start.\nI just need ordinary days to count.',
});

const ALL_IN_HEART: ResetProfile = profile({
  id: 'all-in-heart',
  shortSummary: "you don't lack commitment. you spend it all in the first week.",
  summary: "you don't lack commitment. you spend it all in the first week.",
  description:
    'when you care, you go hard. then there is nothing left, and the crash feels like proof you cannot keep going.',
  advice: "your reset isn't about trying bigger.",
  emphasized: "it's learning to stop at enough.",
  strength: 'you show up with your whole chest',
  pattern: 'going all-in, then burning out',
  resetApproach: 'cap the effort and keep a little in reserve',
  biggestPattern: 'going all-in, then having nothing left',
  whatUsuallyHelps: 'effort caps, recovery as part of the plan, and medium days on purpose',
  homeSupportLine: "stop at enough. that's the work.",
  missedDayLine: "a crash isn't a character flaw. come back smaller than yesterday.",
  startedLine: 'enough is the assignment. not more.',
  completedLine: 'you stopped at enough. that took skill.',
  milestoneDay7Line: 'you practiced stopping.',
  milestoneDay14Line: 'recovery counted as part of the work.',
  milestoneDay21Line: 'medium effort, repeated. that is strength.',
  cycleCompleteLine: 'you can care without burning the week down.',
  strengths: ['deeply committed', 'willing', 'cares hard'],
  challenges: ['overdoing the first week', 'all-or-nothing effort', 'crashing after a surge'],
  shareQuote: "apparently I don't need to go harder.\nI need to stop at enough.",
});

const QUIET_DRAIN: ResetProfile = profile({
  id: 'quiet-drain',
  shortSummary: "you don't need a lecture. you need days that fit a low battery.",
  summary: "you don't need a lecture. you need days that fit a low battery.",
  description:
    'getting through the day is already a lot. a reset that asks for hero energy will not fit the life you actually have.',
  advice: "your reset isn't a push.",
  emphasized: "it's a day small enough to keep.",
  strength: 'you still showed up, even tired',
  pattern: 'capacity runs out before the plan does',
  resetApproach: 'tiny restoration, then one honest step',
  biggestPattern: 'the day already costs more energy than you have',
  whatUsuallyHelps: 'five-minute permission, energy-giving acts, and no catching up',
  homeSupportLine: 'a tiny day still counts.',
  missedDayLine: 'nothing to catch up on. a tiny day still counts.',
  startedLine: 'keep it tiny. your battery is the plan.',
  completedLine: 'you moved without pretending you were full.',
  milestoneDay7Line: 'you let the days stay small.',
  milestoneDay14Line: 'you gave a little energy back.',
  milestoneDay21Line: 'you protected your battery on purpose.',
  cycleCompleteLine: 'you moved forward without pretending you were full.',
  strengths: ['honest about capacity', 'still here', 'gentle with effort'],
  challenges: ['running on empty', 'plans that assume a full tank', 'guilt about doing less'],
  shareQuote: "apparently I don't need a push.\nI need a day that fits.",
});

const DRIFTING_COMPASS: ResetProfile = profile({
  id: 'drifting-compass',
  shortSummary: "you don't need more discipline yet. you need a direction small enough to walk.",
  summary: "you don't need more discipline yet. you need a direction small enough to walk.",
  description:
    'it is hard to start when there is no obvious "this is the thing." waiting for the whole map keeps you still.',
  advice: "your reset isn't a ten-year plan.",
  emphasized: "it's one direction for thirty days.",
  strength: 'you want your days to mean something',
  pattern: 'never quite knowing where to begin',
  resetApproach: 'choose a small north, then walk it',
  biggestPattern: 'no clear direction, so nothing gets a first step',
  whatUsuallyHelps: 'naming what is true now, choosing one path, and refusing a new destination',
  homeSupportLine: "you don't need the whole map today.",
  missedDayLine: 'you are not lost. take the next small step on the same path.',
  startedLine: 'one direction is enough. walk it.',
  completedLine: 'you walked the small path. that is direction.',
  milestoneDay7Line: 'you named what is true now.',
  milestoneDay14Line: 'you chose a direction small enough to walk.',
  milestoneDay21Line: 'you stayed on the same path.',
  cycleCompleteLine: 'you know the next small way, even without the whole map.',
  strengths: ['thoughtful', 'honest', 'wants meaning'],
  challenges: ['too many possible lives', 'waiting for certainty', 'changing destination mid-walk'],
  shareQuote: "apparently I don't need the whole map.\nI need a direction I can walk.",
});

const QUIET_STRANGER: ResetProfile = profile({
  id: 'quiet-stranger',
  shortSummary: "you haven't disappeared. you've just gotten far from yourself.",
  summary: "you haven't disappeared. you've just gotten far from yourself.",
  description:
    'the days keep moving, but they do not quite feel like yours. getting back is less about grinding and more about coming closer.',
  advice: "your reset isn't a new personality.",
  emphasized: "it's finding your way back into your own days.",
  strength: 'you can still tell when something feels like you',
  pattern: 'living at a distance from yourself',
  resetApproach: 'notice, reconnect, belong in ordinary time',
  biggestPattern: 'not feeling like yourself in your own life',
  whatUsuallyHelps: 'noticing without fixing, one familiar thing, and presence over performance',
  homeSupportLine: 'come back to yourself in one small way.',
  missedDayLine: 'you are not gone. one familiar thing is enough to come closer.',
  startedLine: 'stay close. this is about you, not a performance.',
  completedLine: 'you came a little closer to yourself.',
  milestoneDay7Line: 'you noticed without having to fix it all.',
  milestoneDay14Line: 'you brought one true thing back.',
  milestoneDay21Line: 'ordinary time started feeling a little more like you.',
  cycleCompleteLine: "you don't have a new life. you have a closer one.",
  strengths: ['self-aware', 'tender', 'still reaching'],
  challenges: [
    'feeling far from yourself',
    'going through the motions',
    'skipping what feels like you',
  ],
  shareQuote: "apparently I haven't disappeared.\nI've just gotten a little far from myself.",
});

const SOFT_SCATTER: ResetProfile = profile({
  id: 'soft-scatter',
  shortSummary: "you don't need more willpower. you need a smaller container.",
  summary: "you don't need more willpower. you need a smaller container.",
  description:
    'the day has no edges, so the good thing leaks out. structure here is a kindness, not a crackdown.',
  advice: "your reset isn't a stricter personality.",
  emphasized: "it's one window, one place, one repeating slot.",
  strength: 'you care — the day just has too many exits',
  pattern: 'no container, so nothing sticks',
  resetApproach: 'give the day a smaller shape',
  biggestPattern: 'days without edges, so follow-through dissolves',
  whatUsuallyHelps: 'one time, one place, less friction, and a plan that survives a messy day',
  homeSupportLine: 'give today a smaller container.',
  missedDayLine: 'the container is still here. step back into the same small slot.',
  startedLine: 'stay inside the small slot. that is the whole trick.',
  completedLine: 'you kept it in the container. that counts.',
  milestoneDay7Line: 'you gave the day an edge.',
  milestoneDay14Line: 'you made the path a little easier to keep.',
  milestoneDay21Line: 'the same loose time is starting to hold.',
  cycleCompleteLine: "you don't need more willpower. you have a place for this.",
  strengths: ['adaptable', 'open', 'wants an easier day'],
  challenges: ['distraction', 'no repeating slot', 'days without edges'],
  shareQuote: "apparently I don't need more willpower.\nI need a smaller container.",
});

export const RESET_PROFILES: Record<ResetTypeId, ResetProfile> = {
  'overloaded-dreamer': OVERLOADED_DREAMER,
  'soft-restarter': SOFT_RESTARTER,
  'almost-starter': ALMOST_STARTER,
  'fading-flame': FADING_FLAME,
  'all-in-heart': ALL_IN_HEART,
  'quiet-drain': QUIET_DRAIN,
  'drifting-compass': DRIFTING_COMPASS,
  'quiet-stranger': QUIET_STRANGER,
  'soft-scatter': SOFT_SCATTER,
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
