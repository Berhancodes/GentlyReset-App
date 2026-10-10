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

export type JourneySheetCta = 'start' | 'complete' | 'none';

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
  rememberLine: string | null;
  footnote: string | null;
  completeLabel: string | null;
  cta: JourneySheetCta;
  ctaLabel: string | null;
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
      rememberLine: null,
      footnote: "you'll get here soon.",
      completeLabel: null,
      cta: 'none',
      ctaLabel: null,
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
      rememberLine: null,
      footnote: 'you showed up.',
      completeLabel: state.kind === 'current' ? '✓ checked in' : '✓ done',
      cta: 'none',
      ctaLabel: null,
      weekLabel,
      progressLabel,
      weekDots,
    };
  }

  const started = input.todayStarted;
  return {
    day: input.day,
    kind: 'current',
    title: task.title,
    minutes: task.minutes,
    minutesLabel: formatMinutesLabel(task.minutes),
    description: task.description,
    rememberLine: input.rememberLine,
    footnote: null,
    completeLabel: null,
    cta: started ? 'complete' : 'start',
    ctaLabel: started ? 'Check in for today' : "Start today's reset",
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
