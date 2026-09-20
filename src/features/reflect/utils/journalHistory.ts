import { parseLocalDateKey, shiftDateKey, toLocalDateKey } from '../../reset/utils/calendar';
import type { JournalEntry, JournalMood } from '../../reset/types';

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

const SHORT_MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
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

export function sortedReflections(reflections: readonly JournalEntry[]): JournalEntry[] {
  return [...reflections].sort((left, right) => right.savedAt.localeCompare(left.savedAt));
}

export function recentReflections(reflections: readonly JournalEntry[], limit = 3): JournalEntry[] {
  return sortedReflections(reflections).slice(0, limit);
}

export function latestReflection(reflections: readonly JournalEntry[]): JournalEntry | undefined {
  return sortedReflections(reflections)[0];
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

export function formatRecentEntryDate(dateKey: string): string {
  const date = parseLocalDateKey(dateKey);
  const monthName = SHORT_MONTH_NAMES[date.getMonth()];
  if (!monthName) {
    return dateKey;
  }

  return `${monthName} ${date.getDate()}, ${date.getFullYear()}`;
}

const TITLE_MAX_LENGTH = 28;

export function reflectionTitle(text: string): string {
  const firstLine = text.trim().split('\n')[0] ?? '';
  const sentence = firstLine.split(/[.!?]/)[0]?.trim() ?? '';
  if (!sentence) {
    return 'untitled';
  }
  if (sentence.length <= TITLE_MAX_LENGTH) {
    return sentence;
  }

  const truncated = sentence.slice(0, TITLE_MAX_LENGTH).trimEnd();
  const lastSpace = truncated.lastIndexOf(' ');
  const clipped = lastSpace > 12 ? truncated.slice(0, lastSpace) : truncated;
  return `${clipped}…`;
}

export function reflectionPreview(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}
