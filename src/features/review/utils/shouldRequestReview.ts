/** Apple's rating prompt appears once, after this many check-ins. */
export const REVIEW_PROMPT_AFTER_CHECK_INS = 3;

/**
 * Ask for a rating once, after the third check-in. The system prompt itself
 * decides whether it actually shows (Apple caps it at three times a year).
 */
export function shouldRequestReview(checkInCount: number, alreadyRequested: boolean): boolean {
  return !alreadyRequested && checkInCount >= REVIEW_PROMPT_AFTER_CHECK_INS;
}
