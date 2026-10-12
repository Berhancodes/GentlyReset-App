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
    streak: Math.min(PLAN_DAY_COUNT, streak),
    missedYesterday: false,
    todayTask: getCurrentResetTask(rolled),
  };
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
