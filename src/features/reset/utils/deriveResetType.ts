import type { OnboardingAnswer } from '../../onboarding/types/onboarding';
import {
  getMultiChoiceIds,
  getSingleChoiceId,
  getTextInputValue,
} from '../../onboarding/utils/answerReaders';
import {
  isResetTypeId,
  LEGACY_FALLBACK_RESET_TYPE_ID,
  RESET_TYPE_IDS,
  RESET_TYPE_NAMES,
  RESET_TYPE_TIE_PRIORITY,
  type ResetTypeId,
  type ResetTypeScores,
} from '../types';

export { isResetTypeId, LEGACY_FALLBACK_RESET_TYPE_ID } from '../types';

export type ScoredQuestionId =
  | 'changePattern'
  | 'consistencyStage'
  | 'primaryObstacle'
  | 'outOfBalance'
  | 'recentFeeling'
  | 'reason';

export type ScoreContribution = {
  questionId: ScoredQuestionId | 'resetReason';
  optionId: string;
  typeId: ResetTypeId;
  points: number;
};

export type ResetTypeClassification = {
  id: ResetTypeId;
  name: string;
  scores: ResetTypeScores;
  /**
   * (winnerScore - runnerUpScore) / max(winnerScore, 1).
   * 1 = unique lead (or sole non-zero score). 0 = tie or all-zero answers.
   */
  confidence: number;
  runnerUp: { id: ResetTypeId; score: number } | null;
  breakdown: readonly ScoreContribution[];
};

export type ScoreRule = {
  typeId: ResetTypeId;
  points: number;
};

/**
 * Per-option points. Mechanics first (changePattern / consistencyStage),
 * then obstacles, then reason, then state. Generic options are omitted.
 */
export const OPTION_SCORE_MATRIX: Record<ScoredQuestionId, Record<string, readonly ScoreRule[]>> = {
  changePattern: {
    'all-in-burn-out': [{ typeId: 'all-in-heart', points: 4 }],
    'plan-dont-start': [{ typeId: 'almost-starter', points: 4 }],
    'start-strong-fall-off': [{ typeId: 'fading-flame', points: 4 }],
    'bad-day-week': [{ typeId: 'soft-restarter', points: 4 }],
    'keep-changing': [{ typeId: 'overloaded-dreamer', points: 4 }],
    'never-know-start': [
      { typeId: 'drifting-compass', points: 3 },
      { typeId: 'almost-starter', points: 1 },
    ],
  },
  consistencyStage: {
    starting: [{ typeId: 'almost-starter', points: 4 }],
    'staying-consistent': [{ typeId: 'fading-flame', points: 4 }],
    restarting: [{ typeId: 'soft-restarter', points: 4 }],
  },
  primaryObstacle: {
    'too-much': [{ typeId: 'overloaded-dreamer', points: 3 }],
    'put-off': [{ typeId: 'almost-starter', points: 3 }],
    overthink: [{ typeId: 'almost-starter', points: 2 }],
    'no-energy': [{ typeId: 'quiet-drain', points: 3 }],
    'lose-motivation': [{ typeId: 'fading-flame', points: 3 }],
    'afraid-wont-stick': [{ typeId: 'soft-restarter', points: 2 }],
    distracted: [{ typeId: 'soft-scatter', points: 3 }],
    'dont-know': [{ typeId: 'drifting-compass', points: 2 }],
  },
  reason: {
    'not-myself': [{ typeId: 'quiet-stranger', points: 3 }],
    overwhelmed: [{ typeId: 'overloaded-dreamer', points: 2 }],
    'lost-motivation': [{ typeId: 'fading-flame', points: 2 }],
    stuck: [{ typeId: 'drifting-compass', points: 1 }],
    'could-be-better': [{ typeId: 'overloaded-dreamer', points: 1 }],
    // fresh-start: intentionally unscored
  },
  outOfBalance: {
    energy: [{ typeId: 'quiet-drain', points: 2 }],
    direction: [{ typeId: 'drifting-compass', points: 2 }],
    routine: [{ typeId: 'soft-scatter', points: 2 }],
    everything: [{ typeId: 'overloaded-dreamer', points: 2 }],
    mind: [
      { typeId: 'almost-starter', points: 1 },
      { typeId: 'overloaded-dreamer', points: 1 },
    ],
    habits: [
      { typeId: 'soft-scatter', points: 1 },
      { typeId: 'fading-flame', points: 1 },
    ],
    confidence: [{ typeId: 'soft-restarter', points: 1 }],
    // relationships: unscored
  },
  recentFeeling: {
    drained: [{ typeId: 'quiet-drain', points: 2 }],
    overwhelmed: [{ typeId: 'overloaded-dreamer', points: 2 }],
    disconnected: [{ typeId: 'quiet-stranger', points: 2 }],
    'getting-through': [{ typeId: 'quiet-drain', points: 1 }],
    // mostly-okay, pretty-good: unscored
  },
};

/**
 * Caps so multi-select cannot drown diagnostics.
 * Obstacle: two strong options. Reason: two signals. Balance+feeling combined.
 */
export const MULTI_QUESTION_TYPE_CAPS: Partial<Record<ScoredQuestionId, number>> = {
  primaryObstacle: 6,
  reason: 4,
};

export const STATE_QUESTION_TYPE_CAP = 4;

const DIAGNOSTIC_TIE_QUESTIONS: readonly ScoredQuestionId[] = [
  'changePattern',
  'consistencyStage',
  'primaryObstacle',
  'reason',
];

const RESET_REASON_KEYWORD_RULES: readonly {
  typeId: ResetTypeId;
  phrases: readonly string[];
}[] = [
  {
    typeId: 'overloaded-dreamer',
    phrases: ['too much', 'all at once', 'everything at once'],
  },
  {
    typeId: 'soft-restarter',
    phrases: [
      'start over',
      'starting over',
      'restart',
      'bad day',
      'fell off',
      'fall off',
      'falling off',
    ],
  },
  {
    typeId: 'almost-starter',
    phrases: [
      "can't start",
      'cannot start',
      "don't start",
      'dont start',
      'overthink',
      'procrastinate',
      'procrastinating',
      'procrastination',
    ],
  },
  {
    typeId: 'fading-flame',
    phrases: [
      'lose motivation',
      'losing motivation',
      'lost motivation',
      "can't stick",
      'cannot stick',
      "won't stick",
      'wont stick',
    ],
  },
  {
    typeId: 'all-in-heart',
    phrases: ['burned out', 'burn out', 'all in', 'all-in'],
  },
  {
    typeId: 'quiet-drain',
    phrases: ['no energy', 'exhausted', "don't have the energy", 'dont have the energy'],
  },
  {
    typeId: 'drifting-compass',
    phrases: ["don't know where", 'dont know where', 'no direction', "don't know what I'm doing"],
  },
  {
    typeId: 'quiet-stranger',
    phrases: ["don't feel like myself", 'dont feel like myself', 'not myself', 'feel like myself'],
  },
  {
    typeId: 'soft-scatter',
    phrases: ['distracted', 'no routine', 'no structure'],
  },
];

export function emptyResetTypeScores(): ResetTypeScores {
  return {
    'overloaded-dreamer': 0,
    'soft-restarter': 0,
    'almost-starter': 0,
    'fading-flame': 0,
    'all-in-heart': 0,
    'quiet-drain': 0,
    'drifting-compass': 0,
    'quiet-stranger': 0,
    'soft-scatter': 0,
  };
}

function typesIndicatedByQuestion(
  breakdown: readonly ScoreContribution[],
  questionId: ScoredQuestionId,
): ReadonlySet<ResetTypeId> {
  const indicated = new Set<ResetTypeId>();
  for (const contribution of breakdown) {
    if (contribution.questionId === questionId && contribution.points > 0) {
      indicated.add(contribution.typeId);
    }
  }
  return indicated;
}

/**
 * Highest score first. Exact ties prefer the type indicated by:
 * 1. changePattern
 * 2. consistencyStage
 * 3. primaryObstacle
 * 4. reason
 * then RESET_TYPE_TIE_PRIORITY.
 */
function compareResetTypes(
  left: ResetTypeId,
  right: ResetTypeId,
  scores: ResetTypeScores,
  breakdown: readonly ScoreContribution[],
): number {
  const scoreDelta = scores[right] - scores[left];
  if (scoreDelta !== 0) {
    return scoreDelta;
  }

  for (const questionId of DIAGNOSTIC_TIE_QUESTIONS) {
    const indicated = typesIndicatedByQuestion(breakdown, questionId);
    const leftIndicated = indicated.has(left);
    const rightIndicated = indicated.has(right);
    if (leftIndicated !== rightIndicated) {
      return leftIndicated ? -1 : 1;
    }
  }

  return RESET_TYPE_TIE_PRIORITY.indexOf(left) - RESET_TYPE_TIE_PRIORITY.indexOf(right);
}

function rankResetTypes(
  scores: ResetTypeScores,
  breakdown: readonly ScoreContribution[],
): ResetTypeId[] {
  return [...RESET_TYPE_IDS].sort((left, right) =>
    compareResetTypes(left, right, scores, breakdown),
  );
}

function applyOption(questionId: ScoredQuestionId, optionId: string): ScoreContribution[] {
  const rules = OPTION_SCORE_MATRIX[questionId][optionId];
  if (!rules || rules.length === 0) {
    return [];
  }

  return rules.map((rule) => ({
    questionId,
    optionId,
    typeId: rule.typeId,
    points: rule.points,
  }));
}

function addCappedContributions(
  scores: ResetTypeScores,
  breakdown: ScoreContribution[],
  contributions: readonly ScoreContribution[],
  capPerType: number | undefined,
): void {
  const appliedByType = emptyResetTypeScores();

  for (const contribution of contributions) {
    const remaining =
      capPerType === undefined
        ? contribution.points
        : Math.max(0, capPerType - appliedByType[contribution.typeId]);
    const applied = Math.min(contribution.points, remaining);
    if (applied <= 0) {
      continue;
    }

    appliedByType[contribution.typeId] += applied;
    scores[contribution.typeId] += applied;
    breakdown.push({
      ...contribution,
      points: applied,
    });
  }
}

function scoreResetReason(value: string): ScoreContribution[] {
  const normalized = value.toLowerCase().replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return [];
  }

  const contributions: ScoreContribution[] = [];
  for (const rule of RESET_REASON_KEYWORD_RULES) {
    const matchedPhrase = rule.phrases.find((phrase) => normalized.includes(phrase));
    if (!matchedPhrase) {
      continue;
    }

    contributions.push({
      questionId: 'resetReason',
      optionId: matchedPhrase,
      typeId: rule.typeId,
      points: 1,
    });
  }

  return contributions;
}

/**
 * Weighted reset-type classifier. Pure: same answers always produce the same
 * result. Parked questions are ignored. Wishes (outcomes, identity, support,
 * commitment, missed-day, profileAccuracy) do not elect a type.
 */
export function deriveResetType(
  answers: Record<string, OnboardingAnswer>,
): ResetTypeClassification {
  const scores = emptyResetTypeScores();
  const breakdown: ScoreContribution[] = [];

  const changePattern = getSingleChoiceId(answers, 'changePattern');
  if (changePattern) {
    addCappedContributions(
      scores,
      breakdown,
      applyOption('changePattern', changePattern),
      undefined,
    );
  }

  const consistencyStage = getSingleChoiceId(answers, 'consistencyStage');
  if (consistencyStage) {
    addCappedContributions(
      scores,
      breakdown,
      applyOption('consistencyStage', consistencyStage),
      undefined,
    );
  }

  const obstacleIds = getMultiChoiceIds(answers, 'primaryObstacle');
  addCappedContributions(
    scores,
    breakdown,
    obstacleIds.flatMap((optionId) => applyOption('primaryObstacle', optionId)),
    MULTI_QUESTION_TYPE_CAPS.primaryObstacle,
  );

  const reasonIds = getMultiChoiceIds(answers, 'reason');
  addCappedContributions(
    scores,
    breakdown,
    reasonIds.flatMap((optionId) => applyOption('reason', optionId)),
    MULTI_QUESTION_TYPE_CAPS.reason,
  );

  const balanceIds = getMultiChoiceIds(answers, 'outOfBalance');
  const feelingId = getSingleChoiceId(answers, 'recentFeeling');
  const stateContributions = [
    ...balanceIds.flatMap((optionId) => applyOption('outOfBalance', optionId)),
    ...(feelingId ? applyOption('recentFeeling', feelingId) : []),
  ];
  addCappedContributions(scores, breakdown, stateContributions, STATE_QUESTION_TYPE_CAP);

  const resetReason = getTextInputValue(answers, 'resetReason');
  if (resetReason) {
    addCappedContributions(scores, breakdown, scoreResetReason(resetReason), undefined);
  }

  const ranked = rankResetTypes(scores, breakdown);
  const winner = ranked[0] ?? 'soft-restarter';
  const runnerUpId = ranked[1];
  const winnerScore = scores[winner];
  const runnerUpScore = runnerUpId ? scores[runnerUpId] : 0;
  const runnerUp =
    runnerUpId === undefined
      ? null
      : {
          id: runnerUpId,
          score: runnerUpScore,
        };

  return {
    id: winner,
    name: RESET_TYPE_NAMES[winner],
    scores,
    confidence: (winnerScore - runnerUpScore) / Math.max(winnerScore, 1),
    runnerUp,
    breakdown,
  };
}

/**
 * Existing users with a valid resetTypeId keep it (do not reclassify on
 * every app open). Old snapshots with a missing/unknown id are derived once
 * from stored onboarding answers when those exist. If there are no answers,
 * keep overloaded-dreamer as a legacy fallback for pre-classifier installs —
 * this is not the classifier default (all-zero answers pick via tie priority).
 */
export function resolveStoredResetTypeId(
  storedId: string | undefined,
  answers: Record<string, OnboardingAnswer>,
): ResetTypeId {
  if (storedId && isResetTypeId(storedId)) {
    return storedId;
  }

  if (Object.keys(answers).length > 0) {
    return deriveResetType(answers).id;
  }

  return LEGACY_FALLBACK_RESET_TYPE_ID;
}
