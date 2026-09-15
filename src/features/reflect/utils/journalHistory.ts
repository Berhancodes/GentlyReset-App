import { parseLocalDateKey, toLocalDateKey } from '@/features/reset/utils/calendar';
import type { JournalEntry, JournalMood } from '@/features/reset/types';

export const MOOD_LABELS: Record<JournalMood, string> = {
  1: 'very low',
  2: 'low',
  3: 'okay',
  4: 'good',
  5: 'great',
};

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
