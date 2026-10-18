import * as StoreReview from 'expo-store-review';

import { useReviewPromptStore } from '@/features/review/store/useReviewPromptStore';
import { shouldRequestReview } from '@/features/review/utils/shouldRequestReview';

/**
 * After a check-in, asks for an App Store rating once the third day is done.
 * Uses Apple's own prompt only; it never shows in TestFlight, and iOS may
 * choose not to show it at all.
 */
export async function requestReviewAfterCheckIn(checkInCount: number): Promise<void> {
  // Until the saved flag has loaded we can't know it was asked before, so wait.
  if (!useReviewPromptStore.persist.hasHydrated()) {
    return;
  }
  const { requested, markRequested } = useReviewPromptStore.getState();
  if (!shouldRequestReview(checkInCount, requested)) {
    return;
  }
  try {
    if (!(await StoreReview.isAvailableAsync())) {
      return;
    }
    markRequested();
    await StoreReview.requestReview();
  } catch {
    // Rating is a nice-to-have; never let it interrupt the day.
  }
}
