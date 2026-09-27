import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { asyncPersistStorage } from '@/utils/persistStorage';

export const JOURNEY_VISUAL_PERSIST_KEY = 'gently-reset-journey-visual';
export const JOURNEY_VISUAL_PERSIST_VERSION = 1;

type JourneyVisualState = {
  acknowledgedDay: number | null;
};

type JourneyVisualActions = {
  acknowledgeDay: (day: number) => void;
  clearJourneyVisual: () => void;
};

const initialState: JourneyVisualState = {
  acknowledgedDay: null,
};

export const useJourneyVisualStore = create<JourneyVisualState & JourneyVisualActions>()(
  persist(
    (set) => ({
      ...initialState,
      acknowledgeDay: (day) => set({ acknowledgedDay: day }),
      clearJourneyVisual: () => set(initialState),
    }),
    {
      name: JOURNEY_VISUAL_PERSIST_KEY,
      storage: asyncPersistStorage,
      version: JOURNEY_VISUAL_PERSIST_VERSION,
      partialize: (state) => ({
        acknowledgedDay: state.acknowledgedDay,
      }),
    },
  ),
);
