import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { asyncPersistStorage } from '@/utils/persistStorage';

type WidgetState = {
  /** The "want me on your home screen?" sheet has been shown once. */
  promptSeen: boolean;
  markPromptSeen: () => void;
};

export const useWidgetStore = create<WidgetState>()(
  persist(
    (set) => ({
      promptSeen: false,
      markPromptSeen: () => set({ promptSeen: true }),
    }),
    {
      name: 'gently-reset-widget',
      version: 1,
      storage: asyncPersistStorage,
      partialize: (state) => ({ promptSeen: state.promptSeen }),
    },
  ),
);
