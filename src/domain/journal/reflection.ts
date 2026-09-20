import type { JournalEntry, Reflection } from './types';

/**
 * Map a persisted journal row to a domain Reflection.
 * Copies every stored field. Does not invent a cycle id.
 */
export function mapJournalEntryToReflection(entry: JournalEntry): Reflection {
  return {
    day: entry.day,
    date: entry.date,
    mood: entry.mood,
    prompt: entry.prompt,
    text: entry.text,
    savedAt: entry.savedAt,
  };
}

export function mapJournalEntriesToReflections(entries: readonly JournalEntry[]): Reflection[] {
  return entries.map(mapJournalEntryToReflection);
}
