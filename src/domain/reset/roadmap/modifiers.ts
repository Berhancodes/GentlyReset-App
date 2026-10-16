import { isResetTypeId, LEGACY_FALLBACK_RESET_TYPE_ID, type ResetTypeId } from '../types';
import { getRoadmapPhaseForDay } from './phase';
import { ROADMAP_PHASES } from './types';

export function resolveContentResetTypeId(resetTypeId?: string): ResetTypeId {
  if (resetTypeId && isResetTypeId(resetTypeId)) {
    return resetTypeId;
  }
  return LEGACY_FALLBACK_RESET_TYPE_ID;
}

const MINUTES_BY_COMMITMENT: Record<string, number> = {
  five: 5,
  ten: 10,
  twenty: 20,
  'thirty-plus': 30,
};

export function minutesFromCommitment(dailyCommitment?: string): number {
  if (!dailyCommitment) {
    return 5;
  }
  return MINUTES_BY_COMMITMENT[dailyCommitment] ?? 5;
}

export function formatMinutesLabel(minutes: number): string {
  return `${minutes} min`;
}

/**
 * Minutes grow across the season so the plan builds: about half the chosen
 * time in week 1, the full time from week 4. Indexed by roadmap phase.
 */
const MINUTES_RAMP_BY_COMMITMENT: Record<string, readonly number[]> = {
  five: [3, 4, 5, 5, 5],
  ten: [5, 7, 8, 10, 10],
  twenty: [10, 12, 15, 20, 20],
  'thirty-plus': [15, 20, 25, 30, 30],
};

/** Later seasons skip the gentle warm-up: they start where week 3 of season 1 was. */
const LATER_SEASON_RAMP_HEAD_START = 2;

function rampedMinutes(
  day: number,
  dailyCommitment: string | undefined,
  seasonNumber: number,
): number {
  const ramp =
    MINUTES_RAMP_BY_COMMITMENT[dailyCommitment ?? 'five'] ?? MINUTES_RAMP_BY_COMMITMENT.five;
  const headStart = seasonNumber > 1 ? LATER_SEASON_RAMP_HEAD_START : 0;
  const phaseIndex = Math.min(
    ROADMAP_PHASES.length - 1,
    ROADMAP_PHASES.indexOf(getRoadmapPhaseForDay(day)) + headStart,
  );
  return ramp?.[phaseIndex] ?? minutesFromCommitment(dailyCommitment);
}

/**
 * Quiet Drain stays capacity-safe. All-In Heart does not get a harder Week 1
 * for choosing 30+ minutes — stopping at enough is the lesson.
 */
export function minutesForResetDay(
  day: number,
  resetTypeId: ResetTypeId,
  dailyCommitment?: string,
  seasonNumber: number = 1,
): number {
  const ramped = rampedMinutes(day, dailyCommitment, seasonNumber);

  if (resetTypeId === 'quiet-drain' || resetTypeId === 'all-in-heart') {
    return Math.min(ramped, day <= 14 ? 10 : 20);
  }

  return ramped;
}

const TONE_BY_SUPPORT_STYLE: Record<string, string> = {
  'be-gentle': 'Small is enough.',
  'remind-what-matters': 'This is the promise you made yourself.',
  'something-small': 'One little win is the whole assignment.',
  accountable: 'Do this, then you are done.',
  'need-to-hear': "You don't have to fix everything today.",
  depends: 'Meet yourself where you are.',
};

const OBSTACLE_CLOSE: Record<string, string> = {
  'too-much': 'Then stop.',
  overthink: "You don't need a perfect plan.",
  'afraid-wont-stick': 'Showing up once still counts.',
};

function alreadyHas(text: string, snippet: string): boolean {
  return text.toLowerCase().includes(snippet.toLowerCase());
}

function clipWhy(value: string): string {
  const trimmed = value.replace(/\s+/g, ' ').trim();
  if (trimmed.length <= 80) {
    return trimmed;
  }
  return `${trimmed.slice(0, 77)}...`;
}

export function applyTaskModifiers(
  description: string,
  input: {
    supportStyle?: string;
    primaryObstacle?: string;
    resetReason?: string;
    day: number;
  },
): string {
  let text = description;

  const obstacleClose = input.primaryObstacle ? OBSTACLE_CLOSE[input.primaryObstacle] : undefined;
  if (obstacleClose && !alreadyHas(text, obstacleClose)) {
    text = `${text} ${obstacleClose}`;
  }

  const tone = input.supportStyle ? TONE_BY_SUPPORT_STYLE[input.supportStyle] : undefined;
  if (tone && !alreadyHas(text, tone)) {
    text = `${text} ${tone}`;
  }

  const why = input.resetReason?.trim();
  if (why && input.day >= 29) {
    text = `${text} Remember why you started: ${clipWhy(why)}`;
  }

  return text;
}
