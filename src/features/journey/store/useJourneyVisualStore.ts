import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { asyncPersistStorage } from '@/utils/persistStorage';

export const JOURNEY_VISUAL_PERSIST_KEY = 'gently-reset-journey-visual';
export const JOURNEY_VISUAL_PERSIST_VERSION = 1;

export type JourneyDevPreview = {
  fromDay: number;
  toDay: number;
  restDay: number;
  generation: number;
  pendingPlay: boolean;
};

type JourneyVisualState = {
  acknowledgedDay: number | null;
  devPreview: JourneyDevPreview | null;
};

type JourneyVisualActions = {
  acknowledgeDay: (day: number) => void;
  clearJourneyVisual: () => void;
  playDevSideScroll: (fromDay: number, toDay: number) => void;
  restDevSideScroll: (restDay: number) => void;
  clearDevSideScroll: () => void;
};

const initialState: JourneyVisualState = {
  acknowledgedDay: null,
  devPreview: null,
};

export const useJourneyVisualStore = create<JourneyVisualState & JourneyVisualActions>()(
  persist(
    (set) => ({
      ...initialState,
      acknowledgeDay: (day) => set({ acknowledgedDay: day }),
      clearJourneyVisual: () => set(initialState),
      playDevSideScroll: (fromDay, toDay) =>
        set((state) => ({
          devPreview: {
            fromDay,
            toDay,
            restDay: fromDay,
            generation: (state.devPreview?.generation ?? 0) + 1,
            pendingPlay: true,
          },
        })),
      restDevSideScroll: (restDay) =>
        set((state) => {
          if (!state.devPreview) {
            return state;
          }
          return {
            devPreview: {
              ...state.devPreview,
              restDay,
              pendingPlay: false,
            },
          };
        }),
      clearDevSideScroll: () => set({ devPreview: null }),
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
