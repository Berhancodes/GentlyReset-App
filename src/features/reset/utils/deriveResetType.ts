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
  'changePattern' | 'consistencyStage' | 'primaryObstacle' | 'outOfBalance' | 'recentFeeling';

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

export const QUESTION_WEIGHTS: Record<ScoredQuestionId | 'resetReason', number> = {
  changePattern: 3,
  consistencyStage: 3,
  primaryObstacle: 2,
  outOfBalance: 1,
  recentFeeling: 1,
  resetReason: 1,
};

/**
 * Cap per-type points from a multi-choice question so selecting every option
 * cannot drown out the 3-pt diagnostics. 2 options × question weight.
 */
export const MULTI_QUESTION_TYPE_CAPS: Partial<Record<ScoredQuestionId, number>> = {
  primaryObstacle: 4,
  outOfBalance: 2,
};

/**
 * Explicit option → type matrix. An option may map to more than one type.
 * Options omitted here are intentionally unscored (too noisy or not diagnostic).
 *
 * Ambiguous / leftover mappings (see also the report):
 * - `no-energy`: closest to fading-flame; could also be overload or post-slip crash.
 * - `dont-know`: no mechanic; leftover cluster → overloaded-dreamer.
 * - `just-lazy`: shame after a slip, not a mechanic → soft-restarter (question is post-slip).
 * - `miss-old-me`: nostalgia, not a change pattern → fading-flame (lost spark).
 * - `dont-know-life`: directionless leftover → overloaded-dreamer.
 * - `pretty-good`, `mostly-okay`, `relationships`: unscored.
 */
export const OPTION_TYPE_MATRIX: Record<
  ScoredQuestionId,
  Record<string, readonly ResetTypeId[]>
> = {
  changePattern: {
    'all-in-burn-out': ['overloaded-dreamer'],
    'plan-dont-start': ['almost-starter'],
    'start-strong-fall-off': ['fading-flame'],
    'bad-day-week': ['soft-restarter'],
    'keep-changing': ['overloaded-dreamer'],
    'never-know-start': ['almost-starter', 'overloaded-dreamer'],
  },
  consistencyStage: {
    starting: ['almost-starter'],
    'staying-consistent': ['fading-flame'],
    restarting: ['soft-restarter'],
  },
  primaryObstacle: {
    overthink: ['almost-starter'],
    'put-off': ['almost-starter'],
    'no-energy': ['fading-flame'],
    'too-much': ['overloaded-dreamer'],
    'lose-motivation': ['fading-flame'],
    'afraid-wont-stick': ['soft-restarter', 'fading-flame'],
    distracted: ['almost-starter'],
    'dont-know': ['overloaded-dreamer'],
  },
  outOfBalance: {
    mind: ['almost-starter', 'overloaded-dreamer'],
    energy: ['fading-flame'],
    habits: ['fading-flame'],
    confidence: ['soft-restarter'],
    direction: ['overloaded-dreamer'],
    routine: ['fading-flame'],
    everything: ['overloaded-dreamer'],
    // relationships: unscored — not a change mechanic.
  },
  recentFeeling: {
    drained: ['fading-flame'],
    overwhelmed: ['overloaded-dreamer'],
    disconnected: ['fading-flame'],
    'getting-through': ['fading-flame'],
    // mostly-okay, pretty-good: unscored — no change-pattern signal.
  },
};

const SINGLE_CHOICE_QUESTIONS: readonly ScoredQuestionId[] = [
  'changePattern',
  'consistencyStage',
  'recentFeeling',
];

const MULTI_CHOICE_QUESTIONS: readonly ScoredQuestionId[] = ['primaryObstacle', 'outOfBalance'];

const DIAGNOSTIC_TIE_QUESTIONS: readonly ScoredQuestionId[] = [
  'changePattern',
  'consistencyStage',
  'primaryObstacle',
];

/**
 * Conservative phrase matches only. Generic words like "better", "change",
 * "start", or "everything" are too noisy and are not scored.
 */
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
];

export function emptyResetTypeScores(): ResetTypeScores {
  return {
    'overloaded-dreamer': 0,
    'soft-restarter': 0,
    'almost-starter': 0,
    'fading-flame': 0,
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
 * Higher score first. When scores tie, prefer the type indicated by the
 * strongest diagnostic answers in this order:
 * 1. changePattern (3pt)
 * 2. consistencyStage (3pt)
 * 3. primaryObstacle (2pt)
 *
 * If still tied — including all scores 0 — use RESET_TYPE_TIE_PRIORITY:
 * soft-restarter > almost-starter > fading-flame > overloaded-dreamer.
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
  const types = OPTION_TYPE_MATRIX[questionId][optionId];
  if (!types || types.length === 0) {
    return [];
  }

  const points = QUESTION_WEIGHTS[questionId];
  return types.map((typeId) => ({
    questionId,
    optionId,
    typeId,
    points,
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
      points: QUESTION_WEIGHTS.resetReason,
    });
  }

  return contributions;
}

/**
 * Weighted reset-type classifier. Pure: same answers always produce the same
 * result. Parked questions (`recurringThought`, `selfTalkAfterSlip`, and the
 * other retired onboarding items) are ignored even if still present in
 * persisted answers. Unscored live questions (dailyCommitment, desiredIdentity,
 * supportStyle, supportTiming, thirtyDayOutcome, missedDayResponse, and
 * `reason`) are also ignored.
 */
export function deriveResetType(
  answers: Record<string, OnboardingAnswer>,
): ResetTypeClassification {
  const scores = emptyResetTypeScores();
  const breakdown: ScoreContribution[] = [];

  for (const questionId of SINGLE_CHOICE_QUESTIONS) {
    const optionId = getSingleChoiceId(answers, questionId);
    if (!optionId) {
      continue;
    }
    addCappedContributions(scores, breakdown, applyOption(questionId, optionId), undefined);
  }

  for (const questionId of MULTI_CHOICE_QUESTIONS) {
    const optionIds = getMultiChoiceIds(answers, questionId);
    const contributions = optionIds.flatMap((optionId) => applyOption(questionId, optionId));
    addCappedContributions(scores, breakdown, contributions, MULTI_QUESTION_TYPE_CAPS[questionId]);
  }

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
