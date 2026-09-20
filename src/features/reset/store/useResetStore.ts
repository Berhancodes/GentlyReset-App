import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { saveReflection as saveReflectionCommand } from '@/application/journal/saveReflection';
import { completeResetDay } from '@/application/reset/completeResetDay';
import { processDateRollover } from '@/application/reset/processDateRollover';
import { ensureSeeded as ensureSeededCommand, startReset } from '@/application/reset/startReset';
import { startResetDay } from '@/application/reset/startResetDay';
import type { OnboardingAnswer } from '@/features/onboarding/types/onboarding';
import type { JournalMood, ResetSnapshot } from '@/features/reset/types';
import {
  migrateResetPersistState,
  partializeResetState,
  RESET_PERSIST_KEY,
  RESET_PERSIST_VERSION,
} from '@/features/reset/utils/resetPersist';
import { getCurrentResetTask } from '@/features/reset/utils/resetSelectors';
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
        set(startReset(get(), answers, now));
      },
      ensureSeeded: (answers, now = new Date()) => {
        set(ensureSeededCommand(get(), answers, now));
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
        set(startResetDay(get()));
      },
      completeToday: (now = new Date()) => {
        set(completeResetDay(get(), now));
      },
      saveReflection: (input, now = new Date()) => {
        set(saveReflectionCommand(get(), input, now));
      },
      clearReset: () => set(initialSnapshot),
    }),
    {
      name: RESET_PERSIST_KEY,
      storage: asyncPersistStorage,
      version: RESET_PERSIST_VERSION,
      migrate: (persistedState) => migrateResetPersistState(persistedState),
      partialize: (state) => partializeResetState(state),
    },
  ),
);
