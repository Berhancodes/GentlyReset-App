import type { JourneyChapterId } from './journeyChapters';

const SIGN_LINES: Record<JourneyChapterId, string> = {
  'week-1': 'you can do this',
  'week-2': 'keep going',
  'week-3': 'stay with it',
  'week-4': 'one step',
  finish: 'almost there',
};

const QUOTES: Record<JourneyChapterId, string> = {
  'week-1': 'One small step can change everything.',
  'week-2': 'Little changes create a lighter you.',
  'week-3': 'Showing up again is the whole point.',
  'week-4': 'Keep the same small promise.',
  finish: 'A gentle close still counts.',
};

/** The same three-step checklist on every day's pop-up. */
/** Fallback labels and hints; each day's plan supplies its own step labels. */
export const JOURNEY_DAY_STEPS = [
  { title: 'Get ready', hint: 'Set up today’s small step.' },
  { title: 'Do it', hint: 'Make one small change today.' },
  { title: 'Check in', hint: 'Notice how it felt.' },
] as const;

export function getJourneySignLine(chapterId: JourneyChapterId): string {
  return SIGN_LINES[chapterId];
}

export function getJourneyQuote(chapterId: JourneyChapterId): string {
  return QUOTES[chapterId];
}
