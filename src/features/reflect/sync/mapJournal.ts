import type { JournalEntry, JournalMood } from '../../reset/types';
import { isValidCalendarDate } from '../../reset/sync/calendarDate';
import type { CloudJournalRow, CloudJournalWrite } from './types';

const PLAN_DAY_MIN = 1;
const PLAN_DAY_MAX = 30;

export function clampJournalDay(day: number): number {
  if (!Number.isInteger(day)) {
    return 1;
  }
  return Math.min(PLAN_DAY_MAX, Math.max(PLAN_DAY_MIN, day));
}

export function moodToCloud(mood: JournalMood): string {
  return String(mood);
}

export function moodFromCloud(value: string | null): JournalMood {
  const parsed = Number(value);
  if (parsed === 1 || parsed === 2 || parsed === 3 || parsed === 4 || parsed === 5) {
    return parsed;
  }
  return 3;
}

/**
 * Local Reflection → cloud row.
 * Identity is cycle_id + local_day, never user_id + day.
 * photo_url stays null — Journal photos are still a placeholder.
 */
export function mapReflectionToCloud(
  entry: JournalEntry,
  cycleId: string,
): CloudJournalWrite | null {
  const body = entry.text.trim();
  if (!body) {
    return null;
  }

  return {
    cycleId,
    localDay: clampJournalDay(entry.day),
    calendarDate: isValidCalendarDate(entry.date) ? entry.date : null,
    mood: moodToCloud(entry.mood),
    prompt: entry.prompt,
    body,
    photoUrl: null,
    savedAt: entry.savedAt,
  };
}

export function mapCloudToReflection(row: CloudJournalRow): JournalEntry {
  return {
    day: clampJournalDay(row.localDay),
    date: isValidCalendarDate(row.calendarDate) ? row.calendarDate : (row.calendarDate ?? ''),
    mood: moodFromCloud(row.mood),
    prompt: row.prompt ?? '',
    text: row.body,
    savedAt: row.updatedAt || row.savedAt,
  };
}

export function journalFingerprint(reflections: readonly JournalEntry[]): string {
  return JSON.stringify(
    [...reflections]
      .map((entry) => ({
        day: clampJournalDay(entry.day),
        date: entry.date,
        mood: entry.mood,
        prompt: entry.prompt,
        text: entry.text,
        savedAt: entry.savedAt,
      }))
      .sort((left, right) => left.day - right.day),
  );
}
