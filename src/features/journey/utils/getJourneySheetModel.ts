import { completeResetDay } from '../../../application/reset/completeResetDay';
import { startResetDay } from '../../../application/reset/startResetDay';
import type { ResetPersonalization, ResetSnapshot } from '../../reset/types';
import { formatMinutesLabel, getTaskForDay } from '../../reset/utils/getTaskForDay';
import {
  getJourneyChapterDays,
  getJourneyChapterForDay,
  getJourneyWeekLabel,
} from '../data/journeyChapters';
import { getJourneyDayState, type JourneyDayKind } from './getJourneyDayState';

/**
 * `by-steps`: today, not done yet. The day is checked in by ticking its three
 * steps; there is no shortcut button. `none`: nothing to check in.
 */
export type JourneySheetCheckIn = 'by-steps' | 'none';

export type JourneySheetDot = {
  day: number;
  kind: JourneyDayKind;
};

export type JourneySheetModel = {
  day: number;
  kind: JourneyDayKind;
  title: string;
  minutes: number;
  minutesLabel: string;
  description: string;
  /** The day's checklist labels, in JOURNEY_DAY_STEPS order. */
  steps: readonly string[];
  /** An easier version that still counts, for gentler reset types. */
  lighter: string | null;
  rememberLine: string | null;
  footnote: string | null;
  completeLabel: string | null;
  checkIn: JourneySheetCheckIn;
  weekLabel: string | null;
  /** Eyebrow above the title, e.g. "week 1 · day 1". */
  progressLabel: string;
  weekDots: readonly JourneySheetDot[];
};

export type JourneySheetInput = {
  day: number;
  currentDay: number;
  completedDays: readonly number[];
  todayStarted: boolean;
  todayCompleted: boolean;
  personalization: ResetPersonalization;
  rememberLine: string;
  resetTypeId?: string;
};

export function getJourneySheetModel(input: JourneySheetInput): JourneySheetModel {
  const state = getJourneyDayState(
    input.day,
    input.currentDay,
    input.completedDays,
    input.todayCompleted,
  );
  const task = getTaskForDay(input.day, input.personalization, input.resetTypeId);
  const chapter = getJourneyChapterForDay(input.day);
  const weekDots =
    chapter?.startDay !== undefined
      ? getJourneyChapterDays(chapter).map((chapterDay) => ({
          day: chapterDay,
          kind: getJourneyDayState(
            chapterDay,
            input.currentDay,
            input.completedDays,
            input.todayCompleted,
          ).kind,
        }))
      : [];
  const weekLabel = chapter ? getJourneyWeekLabel(chapter) : null;
  const dayOfPlan = `day ${input.day}`;
  const progressLabel = chapter ? `${chapter.subtitle} · ${dayOfPlan}` : dayOfPlan;

  if (state.kind === 'future') {
    return {
      day: input.day,
      kind: 'future',
      title: task.title,
      minutes: task.minutes,
      minutesLabel: formatMinutesLabel(task.minutes),
      description: task.description,
      steps: task.steps,
      lighter: task.lighter ?? null,
      rememberLine: null,
      footnote: "you'll get here soon.",
      completeLabel: null,
      checkIn: 'none',
      weekLabel,
      progressLabel,
      weekDots,
    };
  }

  if (state.kind === 'completed' || (state.kind === 'current' && state.todayCompleted)) {
    return {
      day: input.day,
      kind: state.kind === 'current' ? 'current' : 'completed',
      title: task.title,
      minutes: task.minutes,
      minutesLabel: formatMinutesLabel(task.minutes),
      description: task.description,
      steps: task.steps,
      lighter: task.lighter ?? null,
      rememberLine: null,
      footnote: 'you showed up.',
      completeLabel: state.kind === 'current' ? '✓ checked in' : '✓ done',
      checkIn: 'none',
      weekLabel,
      progressLabel,
      weekDots,
    };
  }

  return {
    day: input.day,
    kind: 'current',
    title: task.title,
    minutes: task.minutes,
    minutesLabel: formatMinutesLabel(task.minutes),
    description: task.description,
    steps: task.steps,
    lighter: task.lighter ?? null,
    rememberLine: input.rememberLine,
    footnote: null,
    completeLabel: null,
    checkIn: 'by-steps',
    weekLabel,
    progressLabel,
    weekDots,
  };
}

export type JourneySheetAction = 'open' | 'start' | 'complete' | 'close';

/**
 * Journey owns daily Start and Complete UI.
 * Both mutations go through the canonical reset commands.
 */
export function applyJourneySheetAction(
  snapshot: ResetSnapshot,
  action: JourneySheetAction,
  now: Date = new Date(),
): ResetSnapshot {
  if (action === 'start') {
    return startResetDay(snapshot);
  }
  if (action === 'complete') {
    return completeResetDay(snapshot, now);
  }
  return snapshot;
}

export function journeyPressMutates(): boolean {
  return false;
}
