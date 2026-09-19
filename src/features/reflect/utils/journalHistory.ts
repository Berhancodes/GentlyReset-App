import { parseLocalDateKey, shiftDateKey, toLocalDateKey } from '@/features/reset/utils/calendar';
import type { JournalEntry, JournalMood } from '@/features/reset/types';

export const MOOD_LABELS: Record<JournalMood, string> = {
  1: 'awful',
  2: 'tired',
  3: 'okay',
  4: 'good',
  5: 'amazing',
};

const MONTH_NAMES = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

export function startOfLocalWeek(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - start.getDay());
  return start;
}

export function thisWeekDates(now: Date = new Date()): string[] {
  const start = startOfLocalWeek(now);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return toLocalDateKey(day);
  });
}

export function moodForDate(
  reflections: readonly JournalEntry[],
  dateKey: string,
): JournalMood | undefined {
  return reflections.find((entry) => entry.date === dateKey)?.mood;
}

export function recentReflections(reflections: readonly JournalEntry[], limit = 3): JournalEntry[] {
  return [...reflections]
    .sort((left, right) => right.savedAt.localeCompare(left.savedAt))
    .slice(0, limit);
}

export function weekdayLetter(dateKey: string): string {
  const weekday = parseLocalDateKey(dateKey).getDay();
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][weekday] ?? '';
}

export function formatJournalHeadingDate(date: Date = new Date()): string {
  const monthName = MONTH_NAMES[date.getMonth()];
  if (!monthName) {
    return toLocalDateKey(date);
  }

  return `${monthName} ${date.getDate()}, ${date.getFullYear()}`;
}

export function formatReflectionListDate(dateKey: string, now: Date = new Date()): string {
  const today = toLocalDateKey(now);
  if (dateKey === today) {
    return 'today';
  }

  if (dateKey === shiftDateKey(today, -1)) {
    return 'yesterday';
  }

  const date = parseLocalDateKey(dateKey);
  const monthName = MONTH_NAMES[date.getMonth()];
  if (!monthName) {
    return dateKey;
  }

  return `${monthName} ${date.getDate()}`;
}
