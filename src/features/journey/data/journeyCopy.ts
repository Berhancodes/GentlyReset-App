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
  { title: 'Step 1', hint: 'Tap when this step is done.' },
  { title: 'Step 2', hint: 'Tap when this step is done.' },
  { title: 'Step 3', hint: 'Tap when this step is done.' },
] as const;

/** Under the day's steps: how far along today is. The last tick checks the day in. */
export function getStepProgressLine(checkedCount: number, stepCount: number): string {
  if (checkedCount <= 0) {
    return `Tick each step as you go · 0 of ${stepCount}`;
  }
  if (checkedCount === stepCount - 1) {
    return `${checkedCount} of ${stepCount}. Almost there!`;
  }
  return `${checkedCount} of ${stepCount} done. Keep going!`;
}

export function getJourneySignLine(chapterId: JourneyChapterId): string {
  return SIGN_LINES[chapterId];
}

export function getJourneyQuote(chapterId: JourneyChapterId): string {
  return QUOTES[chapterId];
}

/** Under the day's list: how far along today is, and when it counts. */
export function getListProgressLine(
  checkedCount: number,
  total: number,
  checkInAt: number,
  checkedIn: boolean,
): string {
  if (checkedCount >= total) {
    return `All ${total} done. A full day! 🌟`;
  }
  if (checkedIn) {
    return `${checkedCount} of ${total} done. Checked in. Keep going if you like.`;
  }
  if (checkedCount <= 0) {
    return `Tick any ${checkInAt} to check in · 0 of ${total}`;
  }
  const left = checkInAt - checkedCount;
  return `${checkedCount} of ${total}. ${left} more to check in!`;
}
