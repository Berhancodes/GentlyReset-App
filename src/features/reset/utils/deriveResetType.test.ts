import type { OnboardingAnswer } from '../../onboarding/types/onboarding';
import type { ResetTypeId, ResetTypeScores } from '../types';
import {
  deriveResetType,
  emptyResetTypeScores,
  LEGACY_FALLBACK_RESET_TYPE_ID,
  MULTI_QUESTION_TYPE_CAPS,
  QUESTION_WEIGHTS,
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
  return (
    left['overloaded-dreamer'] === right['overloaded-dreamer'] &&
    left['soft-restarter'] === right['soft-restarter'] &&
    left['almost-starter'] === right['almost-starter'] &&
    left['fading-flame'] === right['fading-flame']
  );
}

function expectedScores(partial: Partial<ResetTypeScores>): ResetTypeScores {
  return {
    ...emptyResetTypeScores(),
    ...partial,
  };
}

function breakdownMatchesScores(
  breakdown: ReturnType<typeof deriveResetType>['breakdown'],
  scores: ResetTypeScores,
): boolean {
  const summed = emptyResetTypeScores();
  for (const contribution of breakdown) {
    summed[contribution.typeId] += contribution.points;
  }
  return scoresEqual(summed, scores);
}

function contributionCount(
  breakdown: ReturnType<typeof deriveResetType>['breakdown'],
  typeId: ResetTypeId,
  questionId: string,
  optionId: string,
): number {
  return breakdown.filter(
    (entry) =>
      entry.typeId === typeId && entry.questionId === questionId && entry.optionId === optionId,
  ).length;
}

const CLEARLY_OVERLOADED: Record<string, OnboardingAnswer> = {
  changePattern: single('all-in-burn-out'),
  primaryObstacle: multi(['too-much']),
  outOfBalance: multi(['everything', 'direction']),
  recentFeeling: single('overwhelmed'),
};

const CLEARLY_RESTARTING: Record<string, OnboardingAnswer> = {
  changePattern: single('bad-day-week'),
  consistencyStage: single('restarting'),
  outOfBalance: multi(['confidence']),
};

const CLEARLY_ALMOST_STARTER: Record<string, OnboardingAnswer> = {
  changePattern: single('plan-dont-start'),
  consistencyStage: single('starting'),
  primaryObstacle: multi(['overthink', 'put-off']),
};

const CLEARLY_FADING_FLAME: Record<string, OnboardingAnswer> = {
  changePattern: single('start-strong-fall-off'),
  consistencyStage: single('staying-consistent'),
  primaryObstacle: multi(['lose-motivation']),
  outOfBalance: multi(['energy', 'habits']),
  recentFeeling: single('drained'),
};

const MIXED_DREAMER_ALMOST: Record<string, OnboardingAnswer> = {
  changePattern: single('keep-changing'),
  consistencyStage: single('starting'),
  primaryObstacle: multi(['too-much', 'overthink']),
  recentFeeling: single('overwhelmed'),
};

const MIXED_RESTARTER_FLAME: Record<string, OnboardingAnswer> = {
  changePattern: single('bad-day-week'),
  consistencyStage: single('staying-consistent'),
};

const SPARSE_STARTING: Record<string, OnboardingAnswer> = {
  consistencyStage: single('starting'),
};

const CONFLICTING: Record<string, OnboardingAnswer> = {
  changePattern: single('plan-dont-start'),
  consistencyStage: single('restarting'),
  primaryObstacle: multi(['too-much']),
};

const overloaded = deriveResetType(CLEARLY_OVERLOADED);
check('1 clearly overloaded winner', overloaded.id === 'overloaded-dreamer');
check('1 clearly overloaded name', overloaded.name === 'The Overloaded Dreamer');
check(
  '1 clearly overloaded scores',
  scoresEqual(overloaded.scores, expectedScores({ 'overloaded-dreamer': 8 })),
  JSON.stringify(overloaded.scores),
);
check('1 clearly overloaded runner-up id', overloaded.runnerUp?.id === 'soft-restarter');
check('1 clearly overloaded runner-up score', overloaded.runnerUp?.score === 0);
check('1 clearly overloaded confidence', overloaded.confidence === 1);
check(
  '1 clearly overloaded breakdown matches scores',
  breakdownMatchesScores(overloaded.breakdown, overloaded.scores),
);
check(
  '1 clearly overloaded includes all-in-burn-out',
  contributionCount(
    overloaded.breakdown,
    'overloaded-dreamer',
    'changePattern',
    'all-in-burn-out',
  ) === 1,
);

const restarter = deriveResetType(CLEARLY_RESTARTING);
check('2 clearly restarting winner', restarter.id === 'soft-restarter');
check(
  '2 clearly restarting scores',
  scoresEqual(restarter.scores, expectedScores({ 'soft-restarter': 7 })),
  JSON.stringify(restarter.scores),
);
check(
  '2 clearly restarting runner-up',
  restarter.runnerUp?.id === 'almost-starter' && restarter.runnerUp.score === 0,
);
check('2 clearly restarting confidence', restarter.confidence === 1);
check(
  '2 clearly restarting breakdown matches scores',
  breakdownMatchesScores(restarter.breakdown, restarter.scores),
);

const almost = deriveResetType(CLEARLY_ALMOST_STARTER);
check('3 clearly almost-starter winner', almost.id === 'almost-starter');
check(
  '3 clearly almost-starter scores',
  scoresEqual(almost.scores, expectedScores({ 'almost-starter': 10 })),
  JSON.stringify(almost.scores),
);
check(
  '3 clearly almost-starter runner-up',
  almost.runnerUp?.id === 'soft-restarter' && almost.runnerUp.score === 0,
);
check('3 clearly almost-starter confidence', almost.confidence === 1);
check(
  '3 clearly almost-starter breakdown matches scores',
  breakdownMatchesScores(almost.breakdown, almost.scores),
);

const fading = deriveResetType(CLEARLY_FADING_FLAME);
check('4 clearly fading-flame winner', fading.id === 'fading-flame');
check(
  '4 clearly fading-flame scores',
  scoresEqual(fading.scores, expectedScores({ 'fading-flame': 11 })),
  JSON.stringify(fading.scores),
);
check(
  '4 clearly fading-flame runner-up',
  fading.runnerUp?.id === 'soft-restarter' && fading.runnerUp.score === 0,
);
check('4 clearly fading-flame confidence', fading.confidence === 1);
check(
  '4 clearly fading-flame breakdown matches scores',
  breakdownMatchesScores(fading.breakdown, fading.scores),
);

const mixedDreamerAlmost = deriveResetType(MIXED_DREAMER_ALMOST);
check('5 mixed dreamer+almost winner', mixedDreamerAlmost.id === 'overloaded-dreamer');
check(
  '5 mixed dreamer+almost scores',
  scoresEqual(
    mixedDreamerAlmost.scores,
    expectedScores({ 'overloaded-dreamer': 6, 'almost-starter': 5 }),
  ),
  JSON.stringify(mixedDreamerAlmost.scores),
);
check(
  '5 mixed dreamer+almost runner-up',
  mixedDreamerAlmost.runnerUp?.id === 'almost-starter' && mixedDreamerAlmost.runnerUp.score === 5,
);
check('5 mixed dreamer+almost confidence', mixedDreamerAlmost.confidence === (6 - 5) / 6);
check(
  '5 mixed includes keep-changing',
  contributionCount(
    mixedDreamerAlmost.breakdown,
    'overloaded-dreamer',
    'changePattern',
    'keep-changing',
  ) === 1,
);

const mixedRestarterFlame = deriveResetType(MIXED_RESTARTER_FLAME);
check(
  '6 mixed restarter+flame scores tied at 3',
  mixedRestarterFlame.scores['soft-restarter'] === 3 &&
    mixedRestarterFlame.scores['fading-flame'] === 3,
);
check(
  '6 mixed restarter+flame winner via changePattern',
  mixedRestarterFlame.id === 'soft-restarter',
);
check(
  '6 mixed restarter+flame runner-up',
  mixedRestarterFlame.runnerUp?.id === 'fading-flame' && mixedRestarterFlame.runnerUp.score === 3,
);
check('6 mixed restarter+flame confidence is 0 on tie', mixedRestarterFlame.confidence === 0);

const sparse = deriveResetType(SPARSE_STARTING);
check('7 sparse winner', sparse.id === 'almost-starter');
check('7 sparse scores', sparse.scores['almost-starter'] === 3);
check(
  '7 sparse runner-up is tie-priority among zeros',
  sparse.runnerUp?.id === 'soft-restarter' && sparse.runnerUp.score === 0,
);
check('7 sparse confidence', sparse.confidence === 1);

const conflicting = deriveResetType(CONFLICTING);
check(
  '8 conflicting scores',
  scoresEqual(
    conflicting.scores,
    expectedScores({
      'almost-starter': 3,
      'soft-restarter': 3,
      'overloaded-dreamer': 2,
      'fading-flame': 0,
    }),
  ),
  JSON.stringify(conflicting.scores),
);
check('8 conflicting winner via changePattern', conflicting.id === 'almost-starter');
check(
  '8 conflicting runner-up',
  conflicting.runnerUp?.id === 'soft-restarter' && conflicting.runnerUp.score === 3,
);
check('8 conflicting confidence is 0 on top-score tie', conflicting.confidence === 0);
check(
  '8 conflicting is deterministic',
  deriveResetType(CONFLICTING).id === conflicting.id &&
    deriveResetType(CONFLICTING).runnerUp?.id === conflicting.runnerUp?.id,
);

const empty = deriveResetType({});
check('9 empty winner is tie-priority restarter', empty.id === 'soft-restarter');
check('9 empty all scores 0', scoresEqual(empty.scores, emptyResetTypeScores()));
check(
  '9 empty runner-up is almost-starter',
  empty.runnerUp?.id === 'almost-starter' && empty.runnerUp.score === 0,
);
check('9 empty confidence is 0', empty.confidence === 0);
check('9 empty does not crash', empty.breakdown.length === 0);

const withUnscored = deriveResetType({
  ...CLEARLY_ALMOST_STARTER,
  desiredFeelings: multi(['calm', 'confident', 'motivated']),
  dailyCommitment: single('thirty-plus'),
  desiredIdentity: single('disciplined'),
  supportStyle: single('accountable'),
  supportTiming: single('wake-up'),
  readiness: { type: 'scale', value: 5 },
  churnRisk: single('asks-too-much'),
  thirtyDayOutcome: multi(['consistent']),
  desiredDailyLife: multi(['structure']),
  successStatement: single('stuck-with-it'),
  missedDayResponse: single('continue'),
  reason: multi(['overwhelmed', 'fresh-start']),
  profileAccuracy: single('not-really'),
});
check(
  'unscored questions do not change type',
  withUnscored.id === almost.id && scoresEqual(withUnscored.scores, almost.scores),
);

const prettyGood = deriveResetType({
  ...CLEARLY_OVERLOADED,
  recentFeeling: single('pretty-good'),
});
check(
  'pretty-good is unscored',
  prettyGood.scores['overloaded-dreamer'] === 7 &&
    prettyGood.breakdown.every((entry) => entry.optionId !== 'pretty-good'),
);

const mostlyOkay = deriveResetType({ recentFeeling: single('mostly-okay') });
check(
  'mostly-okay is unscored (falls through to tie priority)',
  mostlyOkay.id === 'soft-restarter',
);
check('mostly-okay adds no points', scoresEqual(mostlyOkay.scores, emptyResetTypeScores()));

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
  'multi-choice cap: almost-starter from obstacles',
  allObstacles.scores['almost-starter'] === MULTI_QUESTION_TYPE_CAPS.primaryObstacle,
);
check(
  'multi-choice cap: fading-flame from obstacles',
  allObstacles.scores['fading-flame'] === MULTI_QUESTION_TYPE_CAPS.primaryObstacle,
);
check(
  'multi-choice cap: overloaded-dreamer from obstacles',
  allObstacles.scores['overloaded-dreamer'] === MULTI_QUESTION_TYPE_CAPS.primaryObstacle,
);
check(
  'multi-choice cap: restarter uncapped below cap',
  allObstacles.scores['soft-restarter'] === 2,
);
check(
  'selecting every obstacle does not exceed cap',
  Math.max(
    allObstacles.scores['overloaded-dreamer'],
    allObstacles.scores['soft-restarter'],
    allObstacles.scores['almost-starter'],
    allObstacles.scores['fading-flame'],
  ) === MULTI_QUESTION_TYPE_CAPS.primaryObstacle,
);

const neverKnow = deriveResetType({ changePattern: single('never-know-start') });
check(
  'never-know-start maps to almost-starter and overloaded-dreamer',
  neverKnow.scores['almost-starter'] === QUESTION_WEIGHTS.changePattern &&
    neverKnow.scores['overloaded-dreamer'] === QUESTION_WEIGHTS.changePattern,
);
check(
  'never-know-start tie prefers almost-starter (cleaner diagnostic)',
  neverKnow.id === 'almost-starter',
);

const keywordDreamer = deriveResetType({
  resetReason: text('I try to change too much all at once'),
});
check('resetReason too much / all at once → dreamer', keywordDreamer.id === 'overloaded-dreamer');
check('resetReason dreamer score is 1', keywordDreamer.scores['overloaded-dreamer'] === 1);

const keywordRestarter = deriveResetType({
  resetReason: text('I keep starting over after a bad day'),
});
check('resetReason starting over / bad day → restarter', keywordRestarter.id === 'soft-restarter');

const keywordNoisy = deriveResetType({
  resetReason: text('I want to feel better and change my life'),
});
check('noisy resetReason is skipped', scoresEqual(keywordNoisy.scores, emptyResetTypeScores()));
check('noisy resetReason uses tie priority', keywordNoisy.id === 'soft-restarter');

check(
  'resolve: valid stored id is kept even if answers would differ',
  resolveStoredResetTypeId('fading-flame', CLEARLY_ALMOST_STARTER) === 'fading-flame',
);
check(
  'resolve: unknown id with answers derives once',
  resolveStoredResetTypeId('unknown-old-type', CLEARLY_OVERLOADED) === 'overloaded-dreamer',
);
check(
  'resolve: missing id with answers derives once',
  resolveStoredResetTypeId('', SPARSE_STARTING) === 'almost-starter',
);
check(
  'resolve: missing id with no answers uses legacy dreamer fallback',
  resolveStoredResetTypeId('', {}) === LEGACY_FALLBACK_RESET_TYPE_ID,
);
check(
  'resolve: unknown id with no answers uses legacy dreamer fallback',
  resolveStoredResetTypeId('not-a-type', {}) === LEGACY_FALLBACK_RESET_TYPE_ID,
);
check(
  'new classification of empty answers is restarter, not the legacy dreamer fallback',
  deriveResetType({}).id === 'soft-restarter',
);

check('question weights: changePattern is 3', QUESTION_WEIGHTS.changePattern === 3);
check('question weights: consistencyStage is 3', QUESTION_WEIGHTS.consistencyStage === 3);
check('question weights: primaryObstacle is 2', QUESTION_WEIGHTS.primaryObstacle === 2);
check('question weights: outOfBalance is 1', QUESTION_WEIGHTS.outOfBalance === 1);
check('question weights: recentFeeling is 1', QUESTION_WEIGHTS.recentFeeling === 1);
check('question weights: resetReason is 1', QUESTION_WEIGHTS.resetReason === 1);

const legacyParked = deriveResetType({
  ...CLEARLY_OVERLOADED,
  recurringThought: single('further-ahead'),
  selfTalkAfterSlip: single('ruined-progress'),
});
check(
  'parked recurringThought and selfTalkAfterSlip do not change scores',
  scoresEqual(legacyParked.scores, overloaded.scores) && legacyParked.id === overloaded.id,
);

if (failed > 0) {
  throw new Error(`${failed} reset-type check(s) failed`);
}

console.log('\nall reset-type checks passed');
