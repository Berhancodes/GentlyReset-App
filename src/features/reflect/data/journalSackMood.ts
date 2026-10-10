import type { JournalMood } from '@/features/reset/types';

type SackMoodStep = {
  mood: JournalMood;
  /** The word above the slider and on the entry's pill. */
  label: string;
  /** What he says while you're on this step. */
  line: string;
  /** Which welcome-screen sack frame he shows: hauling it at 1, resting beside it at 5. */
  frame: number;
};

/** "How heavy was today?" Mood 1 is the heaviest, so the slider runs heavy to light. */
const SACK_MOODS: Record<JournalMood, SackMoodStep> = {
  1: { mood: 1, label: 'Really heavy', line: "Oof. Let's put some of that down.", frame: 0 },
  2: { mood: 2, label: 'Heavy', line: "That's a lot to carry.", frame: 1 },
  3: { mood: 3, label: 'In between', line: "Somewhere in the middle. That's okay.", frame: 2 },
  4: { mood: 4, label: 'Lighter', line: 'A little lighter today.', frame: 3 },
  5: { mood: 5, label: 'Light', line: 'Phew. Light as a feather.', frame: 5 },
};

export const JOURNAL_SACK_MOODS: readonly SackMoodStep[] = [
  SACK_MOODS[1],
  SACK_MOODS[2],
  SACK_MOODS[3],
  SACK_MOODS[4],
  SACK_MOODS[5],
];

export function getJournalSackMood(mood: JournalMood): SackMoodStep {
  return SACK_MOODS[mood];
}
