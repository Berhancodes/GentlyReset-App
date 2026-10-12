import type { JournalEntry } from '../types';

/**
 * One journal entry per calendar date. The plan day can't be the key: after a
 * missed day it stays the same, so two days' writing would share it and the
 * second would overwrite the first. Entries without a date fall back to the day.
 */
export function journalEntryKey(entry: Pick<JournalEntry, 'date' | 'day'>): string {
  return entry.date ? `date:${entry.date}` : `day:${entry.day}`;
}

/** Oldest first: by date, then by plan day, then by save time. */
export function compareJournalEntries(left: JournalEntry, right: JournalEntry): number {
  if (left.date && right.date && left.date !== right.date) {
    return left.date < right.date ? -1 : 1;
  }
  if (left.day !== right.day) {
    return left.day - right.day;
  }
  return left.savedAt < right.savedAt ? -1 : left.savedAt > right.savedAt ? 1 : 0;
}
