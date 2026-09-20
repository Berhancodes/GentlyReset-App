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

export function getJourneySignLine(chapterId: JourneyChapterId): string {
  return SIGN_LINES[chapterId];
}

export function getJourneyQuote(chapterId: JourneyChapterId): string {
  return QUOTES[chapterId];
}
