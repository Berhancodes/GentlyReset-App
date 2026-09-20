import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createResetApplication } from '@/application/createResetApplication';
import {
  createResetRepositoryFromAccessors,
  type ResetRepository,
} from '@/application/reset/ResetRepository';
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

/**
 * After Phase 2C this store is the reactive UI cache and the persist
 * bridge (`gently-reset-daily` v1). Business rules live in application
 * commands; this file only binds get/set to ResetRepository.
 *
 * Hydration: persist middleware loads AsyncStorage before UI mounts
 * (`usePersistedStoresHydrated`). This initializer does not write
 * `initialSnapshot` to disk. Mutations go through application + repo
 * after hydrate. ResetRepository is not the onboarding store.
 */
function storeResetRepository(
  get: () => ResetSnapshot,
  set: (snapshot: ResetSnapshot) => void,
): ResetRepository {
  return createResetRepositoryFromAccessors(get, set);
}

export const useResetStore = create<ResetSnapshot & ResetActions>()(
  persist(
    (set, get) => {
      const app = () =>
        createResetApplication(storeResetRepository(get, (snapshot) => set(snapshot)));

      return {
        ...initialSnapshot,
        seedFromOnboarding: (answers, now = new Date()) => {
          app().startReset(answers, now);
        },
        ensureSeeded: (answers, now = new Date()) => {
          app().ensureSeeded(answers, now);
        },
        applyCalendarDay: (now = new Date()) => {
          if (!get().resetStartedOn) {
            return;
          }
          app().processDateRollover(now);
        },
        syncResetDay: (answers, now = new Date()) => {
          get().ensureSeeded(answers, now);
          get().applyCalendarDay(now);
        },
        startToday: () => {
          app().startResetDay();
        },
        completeToday: (now = new Date()) => {
          app().completeResetDay(now);
        },
        saveReflection: (input, now = new Date()) => {
          app().saveReflection(input, now);
        },
        clearReset: () => set(initialSnapshot),
      };
    },
    {
      name: RESET_PERSIST_KEY,
      storage: asyncPersistStorage,
      version: RESET_PERSIST_VERSION,
      migrate: (persistedState) => migrateResetPersistState(persistedState),
      partialize: (state) => partializeResetState(state),
    },
  ),
);
