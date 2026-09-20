export type JournalMood = 1 | 2 | 3 | 4 | 5;

/**
 * Persisted journal row. Domain Reflection maps this 1:1.
 * Do not invent cycle ids here — entries do not store them.
 */
export type JournalEntry = {
  day: number;
  date: string;
  mood: JournalMood;
  prompt: string;
  text: string;
  savedAt: string;
};

/**
 * Domain journal record. Same fields as JournalEntry; no cycle id is added.
 */
export type Reflection = {
  day: number;
  date: string;
  mood: JournalMood;
  prompt: string;
  text: string;
  savedAt: string;
};
