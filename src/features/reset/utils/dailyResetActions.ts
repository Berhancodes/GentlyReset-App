import type { JournalMood, ResetSnapshot } from '@/features/reset/types';
import { PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';
import { applyDateRollover } from '@/features/reset/utils/applyDateRollover';
import { shiftDateKey, toLocalDateKey } from '@/features/reset/utils/calendar';
import { getTaskForDay } from '@/features/reset/utils/getTaskForDay';

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
  const rolled = applyDateRollover(state, today);
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
    lastCompletedOn: today,
    streak: Math.min(PLAN_DAY_COUNT, streak),
    missedYesterday: false,
    todayTask: getTaskForDay(rolled.currentDay, rolled.personalization),
  };
}

export function applySaveReflection(
  state: ResetSnapshot,
  input: { mood: JournalMood; text: string; prompt: string },
  now: Date,
): ResetSnapshot {
  const today = toLocalDateKey(now);
  const rolled = applyDateRollover(state, today);
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
  const remaining = (rolled.reflections ?? []).filter(
    (reflection) => reflection.day !== rolled.currentDay,
  );

  return {
    ...rolled,
    reflections: [...remaining, entry].sort((left, right) => left.day - right.day),
  };
}
