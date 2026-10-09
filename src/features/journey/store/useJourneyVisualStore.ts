import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { JourneySeason } from '@/features/journey/utils/getJourneySeason';
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

/** Ticked checklist steps (indexes into JOURNEY_DAY_STEPS) for one plan day. */
export type JourneyStepChecks = {
  day: number;
  checked: readonly number[];
};

type JourneyVisualState = {
  acknowledgedDay: number | null;
  /** Today's ticked steps. A different day starts empty. */
  stepChecks: JourneyStepChecks | null;
  devPreview: JourneyDevPreview | null;
  /** Dev-only season override; never persisted. */
  devSeason: JourneySeason | null;
  /** Dev-only: bumping it replays the day-complete celebration. Never persisted. */
  devCelebrationKey: number;
};

type JourneyVisualActions = {
  acknowledgeDay: (day: number) => void;
  clearJourneyVisual: () => void;
  playDevSideScroll: (fromDay: number, toDay: number) => void;
  restDevSideScroll: (restDay: number) => void;
  clearDevSideScroll: () => void;
  setDevSeason: (season: JourneySeason | null) => void;
  previewDayComplete: () => void;
  /**
   * Ticks one step for `day`. Ticks are permanent: returns the new number of
   * ticked steps, or null when that step was already ticked.
   */
  checkStep: (day: number, step: number) => number | null;
};

const initialState: JourneyVisualState = {
  acknowledgedDay: null,
  stepChecks: null,
  devPreview: null,
  devSeason: null,
  devCelebrationKey: 0,
};

export const useJourneyVisualStore = create<JourneyVisualState & JourneyVisualActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      checkStep: (day, step) => {
        const current = get().stepChecks;
        const checked = current?.day === day ? current.checked : [];
        if (checked.includes(step)) {
          return null;
        }
        const next = [...checked, step];
        set({ stepChecks: { day, checked: next } });
        return next.length;
      },
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
      setDevSeason: (season) => set({ devSeason: season }),
      previewDayComplete: () =>
        set((state) => ({ devCelebrationKey: state.devCelebrationKey + 1 })),
    }),
    {
      name: JOURNEY_VISUAL_PERSIST_KEY,
      storage: asyncPersistStorage,
      version: JOURNEY_VISUAL_PERSIST_VERSION,
      partialize: (state) => ({
        acknowledgedDay: state.acknowledgedDay,
        stepChecks: state.stepChecks,
      }),
    },
  ),
);
