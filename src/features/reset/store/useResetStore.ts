import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { OnboardingAnswer } from '@/features/onboarding/types/onboarding';
import type { JournalMood, ResetSnapshot } from '@/features/reset/types';
import { processDateRollover } from '@/features/reset/utils/applyDateRollover';
import {
  applyCompleteToday,
  applySaveReflection,
  applyStartToday,
} from '@/features/reset/utils/dailyResetActions';
import {
  migrateResetPersistState,
  partializeResetState,
  RESET_PERSIST_KEY,
  RESET_PERSIST_VERSION,
} from '@/features/reset/utils/resetPersist';
import { getCurrentResetTask } from '@/features/reset/utils/resetSelectors';
import { applyEnsureSeeded, createSeededResetState } from '@/features/reset/utils/seedResetState';
import { asyncPersistStorage } from '@/utils/persistStorage';

const emptyPersonalization = {
  desiredFeelings: [] as const,
};

/** todayTask is persist/journal compat only. Screens read via getCurrentResetTask. */
const initialSnapshot: ResetSnapshot = {
  currentDay: 1,
  completedDays: [],
  todayCompleted: false,
  todayStarted: false,
  todayTask: getCurrentResetTask({ currentDay: 1, personalization: emptyPersonalization }),
  resetStartedOn: null,
  lastSeenOn: null,
  lastCompletedOn: null,
  streak: 0,
  missedYesterday: false,
  resetTypeId: '',
  personalization: emptyPersonalization,
  reflections: [],
};

type ResetActions = {
  seedFromOnboarding: (answers: Record<string, OnboardingAnswer>, now?: Date) => void;
  ensureSeeded: (answers: Record<string, OnboardingAnswer>, now?: Date) => void;
  applyCalendarDay: (now?: Date) => void;
  syncResetDay: (answers: Record<string, OnboardingAnswer>, now?: Date) => void;
  startToday: () => void;
  completeToday: (now?: Date) => void;
  saveReflection: (input: { mood: JournalMood; text: string; prompt: string }, now?: Date) => void;
  clearReset: () => void;
};

export const useResetStore = create<ResetSnapshot & ResetActions>()(
  persist(
    (set, get) => ({
      ...initialSnapshot,
      seedFromOnboarding: (answers, now = new Date()) => {
        set(createSeededResetState(answers, now));
      },
      ensureSeeded: (answers, now = new Date()) => {
        set(applyEnsureSeeded(get(), answers, now));
      },
      applyCalendarDay: (now = new Date()) => {
        const current = get();
        if (!current.resetStartedOn) {
          return;
        }
        set(processDateRollover(current, now));
      },
      syncResetDay: (answers, now = new Date()) => {
        get().ensureSeeded(answers, now);
        get().applyCalendarDay(now);
      },
      startToday: () => {
        set(applyStartToday(get()));
      },
      completeToday: (now = new Date()) => {
        set(applyCompleteToday(get(), now));
      },
      saveReflection: (input, now = new Date()) => {
        set(applySaveReflection(get(), input, now));
      },
      clearReset: () => set(initialSnapshot),
    }),
    {
      name: RESET_PERSIST_KEY,
      storage: asyncPersistStorage,
      version: RESET_PERSIST_VERSION,
      migrate: migrateResetPersistState,
      partialize: partializeResetState,
    },
  ),
);
