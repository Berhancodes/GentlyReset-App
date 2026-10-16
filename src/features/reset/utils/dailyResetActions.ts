import { personalizationForNextSeason, type FocusAreaId } from '../../../domain/reset/roadmap';
import type { JournalMood, ResetSnapshot } from '../types';
import { PLAN_DAY_COUNT } from '../data/thirtyDayPlan';
import { processDateRollover } from './applyDateRollover';
import { shiftDateKey, toLocalDateKey } from './calendar';
import { getCurrentResetTask } from './resetSelectors';
import { compareJournalEntries, journalEntryKey } from './journalEntryKey';

export function applyStartToday(state: ResetSnapshot): ResetSnapshot {
  if (!state.resetStartedOn || state.todayCompleted) {
    return state;
  }

  return {
    ...state,
    todayStarted: true,
  };
}

export function applyCompleteToday(state: ResetSnapshot, now: Date): ResetSnapshot {
  const today = toLocalDateKey(now);
  const rolled = processDateRollover(state, now);
  if (rolled.todayCompleted) {
    return rolled;
  }
  if (rolled.completedDays.includes(rolled.currentDay)) {
    return {
      ...rolled,
      todayCompleted: true,
      todayStarted: true,
    };
  }

  const yesterday = shiftDateKey(today, -1);
  const streak =
    rolled.lastCompletedOn === yesterday
      ? rolled.streak + 1
      : rolled.lastCompletedOn === today
        ? rolled.streak
        : 1;

  return {
    ...rolled,
    todayCompleted: true,
    todayStarted: true,
    completedDays: [...rolled.completedDays, rolled.currentDay],
    completionDates: { ...rolled.completionDates, [rolled.currentDay]: today },
    lastCompletedOn: today,
    // Streaks carry across seasons, so they are not capped at one season's length.
    streak,
    missedYesterday: false,
    todayTask: getCurrentResetTask(rolled),
  };
}

/** A season is finished once its last plan day is checked in. */
export function isSeasonFinished(state: Pick<ResetSnapshot, 'completedDays'>): boolean {
  return state.completedDays.includes(PLAN_DAY_COUNT);
}

/**
 * Begin the next season in the chosen focus area, starting today. Progress
 * days start over; the streak, journal, and identity carry on. Does nothing
 * until the current season is finished.
 */
export function applyStartNextSeason(
  state: ResetSnapshot,
  focusAreaId: FocusAreaId,
  now: Date,
): ResetSnapshot {
  const rolled = processDateRollover(state, now);
  if (!rolled.resetStartedOn || !isSeasonFinished(rolled)) {
    return rolled;
  }

  const today = toLocalDateKey(now);
  const personalization = personalizationForNextSeason(
    rolled.personalization,
    focusAreaId,
    rolled.resetTypeId,
  );
  const next: ResetSnapshot = {
    ...rolled,
    currentDay: 1,
    completedDays: [],
    completionDates: {},
    todayCompleted: false,
    todayStarted: false,
    resetStartedOn: today,
    lastSeenOn: today,
    missedYesterday: false,
    personalization,
  };
  return { ...next, todayTask: getCurrentResetTask(next) };
}

export function applySaveReflection(
  state: ResetSnapshot,
  input: { mood: JournalMood; text: string; prompt: string },
  now: Date,
): ResetSnapshot {
  const today = toLocalDateKey(now);
  const rolled = processDateRollover(state, now);
  const text = input.text.trim();
  if (!text) {
    return rolled;
  }

  const entry = {
    day: rolled.currentDay,
    date: today,
    mood: input.mood,
    prompt: input.prompt,
    text,
    savedAt: now.toISOString(),
  };
  // Rewriting today replaces today's entry only; a missed day keeps its own.
  const remaining = (rolled.reflections ?? []).filter(
    (reflection) => journalEntryKey(reflection) !== journalEntryKey(entry),
  );

  return {
    ...rolled,
    reflections: [...remaining, entry].sort(compareJournalEntries),
  };
}
