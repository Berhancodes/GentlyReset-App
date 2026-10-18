import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { asyncPersistStorage } from '@/utils/persistStorage';

export const REVIEW_PROMPT_PERSIST_KEY = 'gently-reset-review-prompt';
export const REVIEW_PROMPT_PERSIST_VERSION = 1;

type ReviewPromptState = {
  /** Set once the rating prompt has been requested on this device. */
  requested: boolean;
  markRequested: () => void;
};

/**
 * Remembers that the rating prompt was already requested, so it is asked at
 * most once per install. Not cleared on sign-out: one ask per device is enough.
 */
export const useReviewPromptStore = create<ReviewPromptState>()(
  persist(
    (set) => ({
      requested: false,
      markRequested: () => set({ requested: true }),
    }),
    {
      name: REVIEW_PROMPT_PERSIST_KEY,
      storage: asyncPersistStorage,
      version: REVIEW_PROMPT_PERSIST_VERSION,
      partialize: (state) => ({ requested: state.requested }),
    },
  ),
);
