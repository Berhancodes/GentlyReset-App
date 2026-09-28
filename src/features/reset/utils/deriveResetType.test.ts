import type { OnboardingAnswer } from '../../onboarding/types/onboarding';
import type { ResetTypeId, ResetTypeScores } from '../types';
import {
  deriveResetType,
  emptyResetTypeScores,
  LEGACY_FALLBACK_RESET_TYPE_ID,
  MULTI_QUESTION_TYPE_CAPS,
  resolveStoredResetTypeId,
} from './deriveResetType';

let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed += 1;
  console.error(`fail  ${label}${detail ? ` — ${detail}` : ''}`);
}

function single(optionId: string): OnboardingAnswer {
  return { type: 'singleChoice', optionId };
}

function multi(optionIds: readonly string[]): OnboardingAnswer {
  return { type: 'multiChoice', optionIds };
}

function text(value: string): OnboardingAnswer {
  return { type: 'textInput', value };
}

function scoresEqual(left: ResetTypeScores, right: ResetTypeScores): boolean {
  return (Object.keys(left) as ResetTypeId[]).every((id) => left[id] === right[id]);
}

const CLEARLY_OVERLOADED: Record<string, OnboardingAnswer> = {
  changePattern: single('keep-changing'),
  primaryObstacle: multi(['too-much']),
  reason: multi(['overwhelmed']),
  outOfBalance: multi(['everything']),
  recentFeeling: single('overwhelmed'),
};

const CLEARLY_RESTARTING: Record<string, OnboardingAnswer> = {
  changePattern: single('bad-day-week'),
  consistencyStage: single('restarting'),
  primaryObstacle: multi(['afraid-wont-stick']),
};

const CLEARLY_ALMOST_STARTER: Record<string, OnboardingAnswer> = {
  changePattern: single('plan-dont-start'),
  consistencyStage: single('starting'),
  primaryObstacle: multi(['put-off', 'overthink']),
};

const CLEARLY_FADING_FLAME: Record<string, OnboardingAnswer> = {
  changePattern: single('start-strong-fall-off'),
  consistencyStage: single('staying-consistent'),
  primaryObstacle: multi(['lose-motivation']),
  reason: multi(['lost-motivation']),
};

const CLEARLY_ALL_IN: Record<string, OnboardingAnswer> = {
  changePattern: single('all-in-burn-out'),
  primaryObstacle: multi(['too-much']),
};

const CLEARLY_QUIET_DRAIN: Record<string, OnboardingAnswer> = {
  primaryObstacle: multi(['no-energy']),
  outOfBalance: multi(['energy']),
  recentFeeling: single('drained'),
};

const CLEARLY_COMPASS: Record<string, OnboardingAnswer> = {
  changePattern: single('never-know-start'),
  primaryObstacle: multi(['dont-know']),
  outOfBalance: multi(['direction']),
  reason: multi(['stuck']),
};

const CLEARLY_STRANGER: Record<string, OnboardingAnswer> = {
  reason: multi(['not-myself']),
  recentFeeling: single('disconnected'),
};

const CLEARLY_SCATTER: Record<string, OnboardingAnswer> = {
  primaryObstacle: multi(['distracted']),
  outOfBalance: multi(['routine']),
};

const MIXED_RESTARTER_FLAME: Record<string, OnboardingAnswer> = {
  changePattern: single('bad-day-week'),
  consistencyStage: single('staying-consistent'),
};

const REACHABLE: Record<ResetTypeId, Record<string, OnboardingAnswer>> = {
  'overloaded-dreamer': CLEARLY_OVERLOADED,
  'soft-restarter': CLEARLY_RESTARTING,
  'almost-starter': CLEARLY_ALMOST_STARTER,
  'fading-flame': CLEARLY_FADING_FLAME,
  'all-in-heart': CLEARLY_ALL_IN,
  'quiet-drain': CLEARLY_QUIET_DRAIN,
  'drifting-compass': CLEARLY_COMPASS,
  'quiet-stranger': CLEARLY_STRANGER,
  'soft-scatter': CLEARLY_SCATTER,
};

for (const [typeId, answers] of Object.entries(REACHABLE) as [
  ResetTypeId,
  Record<string, OnboardingAnswer>,
][]) {
  const result = deriveResetType(answers);
  check(`reachable ${typeId}`, result.id === typeId, result.id);
  check(`reachable ${typeId} has name`, result.name.length > 0);
  check(
    `reachable ${typeId} breakdown matches scores`,
    scoresEqual(
      result.scores,
      result.breakdown.reduce((sum, entry) => {
        sum[entry.typeId] += entry.points;
        return sum;
      }, emptyResetTypeScores()),
    ),
  );
}

const overloaded = deriveResetType(CLEARLY_OVERLOADED);
check('overloaded is not leftover all-in', overloaded.id === 'overloaded-dreamer');
check('all-in-burn-out is All-In Heart', deriveResetType(CLEARLY_ALL_IN).id === 'all-in-heart');
check(
  'all-in-burn-out does not elect Overloaded Dreamer',
  deriveResetType({ changePattern: single('all-in-burn-out') }).id === 'all-in-heart' &&
    deriveResetType({ changePattern: single('all-in-burn-out') }).scores['overloaded-dreamer'] ===
      0,
);

check(
  'distracted elects Soft Scatter, not Almost Starter',
  deriveResetType({ primaryObstacle: multi(['distracted']) }).id === 'soft-scatter' &&
    deriveResetType({ primaryObstacle: multi(['distracted']) }).scores['almost-starter'] === 0,
);

const drainedOnly = deriveResetType({ recentFeeling: single('drained') });
check('drained alone elects Quiet Drain, not Fading Flame', drainedOnly.id === 'quiet-drain');
check('drained does not score Fading Flame', drainedOnly.scores['fading-flame'] === 0);

check(
  'not-myself + disconnected elects Quiet Stranger',
  deriveResetType(CLEARLY_STRANGER).id === 'quiet-stranger',
);

const compass = deriveResetType(CLEARLY_COMPASS);
check('never-know-start / direction elects Drifting Compass', compass.id === 'drifting-compass');
check(
  'never-know-start still gives Almost Starter a weaker bump',
  compass.scores['almost-starter'] === 1 && compass.scores['drifting-compass'] >= 8,
);

const mixed = deriveResetType(MIXED_RESTARTER_FLAME);
check(
  'exact tie uses changePattern',
  mixed.scores['soft-restarter'] === mixed.scores['fading-flame'] && mixed.id === 'soft-restarter',
);
check('tie confidence is 0', mixed.confidence === 0);
check('tie runner-up is fading-flame', mixed.runnerUp?.id === 'fading-flame');

const empty = deriveResetType({});
check('empty answers use tie-priority Soft Restarter', empty.id === 'soft-restarter');
check('empty all scores 0', scoresEqual(empty.scores, emptyResetTypeScores()));
check('empty confidence is 0', empty.confidence === 0);
check('empty runner-up is almost-starter', empty.runnerUp?.id === 'almost-starter');

const freshStart = deriveResetType({ reason: multi(['fresh-start']) });
check(
  'fresh-start cannot win — it scores nothing',
  scoresEqual(freshStart.scores, emptyResetTypeScores()),
);
check('fresh-start falls through to tie priority', freshStart.id === 'soft-restarter');

const prettyGood = deriveResetType({ recentFeeling: single('pretty-good') });
check('pretty-good cannot win', scoresEqual(prettyGood.scores, emptyResetTypeScores()));
check('pretty-good uses tie priority', prettyGood.id === 'soft-restarter');

const relationships = deriveResetType({ outOfBalance: multi(['relationships']) });
check('relationships cannot win', scoresEqual(relationships.scores, emptyResetTypeScores()));

const couldBeBetter = deriveResetType({ reason: multi(['could-be-better']) });
check('could-be-better is weak', couldBeBetter.scores['overloaded-dreamer'] === 1);

check(
  'same answers always same type',
  deriveResetType(CLEARLY_ALMOST_STARTER).id === deriveResetType(CLEARLY_ALMOST_STARTER).id &&
    deriveResetType(MIXED_RESTARTER_FLAME).runnerUp?.id === mixed.runnerUp?.id,
);

const withUnscored = deriveResetType({
  ...CLEARLY_ALMOST_STARTER,
  desiredFeelings: multi(['calm']),
  dailyCommitment: single('thirty-plus'),
  desiredIdentity: single('disciplined'),
  supportStyle: single('accountable'),
  supportTiming: single('wake-up'),
  thirtyDayOutcome: multi(['consistent']),
  missedDayResponse: single('continue'),
  profileAccuracy: single('not-really'),
});
const almost = deriveResetType(CLEARLY_ALMOST_STARTER);
check(
  'wishes do not change type',
  withUnscored.id === almost.id && scoresEqual(withUnscored.scores, almost.scores),
);

const allObstacles = deriveResetType({
  primaryObstacle: multi([
    'overthink',
    'put-off',
    'no-energy',
    'too-much',
    'lose-motivation',
    'afraid-wont-stick',
    'distracted',
    'dont-know',
  ]),
});
check(
  'obstacle cap holds for Almost Starter',
  allObstacles.scores['almost-starter'] <= (MULTI_QUESTION_TYPE_CAPS.primaryObstacle ?? 0),
);
check(
  'selecting every obstacle does not exceed cap',
  Math.max(...Object.values(allObstacles.scores)) <=
    (MULTI_QUESTION_TYPE_CAPS.primaryObstacle ?? 0),
);

const keywordDreamer = deriveResetType({
  resetReason: text('I try to change too much all at once'),
});
check('resetReason too much → dreamer', keywordDreamer.id === 'overloaded-dreamer');

const keywordNoisy = deriveResetType({
  resetReason: text('I want to feel better and change my life'),
});
check('noisy resetReason is skipped', scoresEqual(keywordNoisy.scores, emptyResetTypeScores()));

check(
  'resolve: valid stored id is kept even if answers would differ',
  resolveStoredResetTypeId('fading-flame', CLEARLY_ALMOST_STARTER) === 'fading-flame',
);
check(
  'resolve: new ids are valid stored types',
  resolveStoredResetTypeId('quiet-drain', CLEARLY_OVERLOADED) === 'quiet-drain',
);
check(
  'resolve: unknown id with answers derives once',
  resolveStoredResetTypeId('unknown-old-type', CLEARLY_OVERLOADED) === 'overloaded-dreamer',
);
check(
  'resolve: missing id with no answers uses legacy dreamer fallback',
  resolveStoredResetTypeId('', {}) === LEGACY_FALLBACK_RESET_TYPE_ID,
);
check(
  'new classification of empty answers is restarter, not the legacy dreamer fallback',
  deriveResetType({}).id === 'soft-restarter',
);

const parked = deriveResetType({
  ...CLEARLY_OVERLOADED,
  recurringThought: single('further-ahead'),
  selfTalkAfterSlip: single('ruined-progress'),
});
check('parked questions do not change scores', scoresEqual(parked.scores, overloaded.scores));

if (failed > 0) {
  throw new Error(`${failed} reset-type check(s) failed`);
}

console.log('\nall reset-type checks passed');
