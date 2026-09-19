import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { OnboardingAnswer } from '@/features/onboarding/types/onboarding';
import { getSingleChoiceId } from '@/features/onboarding/utils/answerReaders';
import type { JournalMood, ResetSnapshot, TodayTask } from '@/features/reset/types';
import { applyDateRollover } from '@/features/reset/utils/applyDateRollover';
import { toLocalDateKey } from '@/features/reset/utils/calendar';
import {
  applyCompleteToday,
  applySaveReflection,
  applyStartToday,
} from '@/features/reset/utils/dailyResetActions';
import { resolveStoredResetTypeId } from '@/features/reset/utils/deriveResetType';
import { getTaskForDay } from '@/features/reset/utils/getTaskForDay';
import { createSeededResetState } from '@/features/reset/utils/seedResetState';
import { asyncPersistStorage } from '@/utils/persistStorage';

const emptyPersonalization = {
  desiredFeelings: [] as const,
};

const fallbackTask: TodayTask = getTaskForDay(1, emptyPersonalization);

/** todayTask is persist/journal compat only. Home and Journey render via getTaskForDay. */
const initialSnapshot: ResetSnapshot = {
  currentDay: 1,
  completedDays: [],
  todayCompleted: false,
  todayStarted: false,
  todayTask: fallbackTask,
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
        if (get().resetStartedOn) {
          get().applyCalendarDay(now);
          const current = get();
          const resetTypeId = resolveStoredResetTypeId(current.resetTypeId, answers);
          const profileAccuracy =
            current.profileAccuracy ?? getSingleChoiceId(answers, 'profileAccuracy');
          if (resetTypeId !== current.resetTypeId || profileAccuracy !== current.profileAccuracy) {
            set({ resetTypeId, profileAccuracy });
          }
          return;
        }
        set(createSeededResetState(answers, now));
      },
      applyCalendarDay: (now = new Date()) => {
        const current = get();
        if (!current.resetStartedOn) {
          return;
        }
        set(applyDateRollover(current, toLocalDateKey(now)));
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
      name: 'gently-reset-daily',
      storage: asyncPersistStorage,
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as Partial<ResetSnapshot>;
        return {
          ...state,
          reflections: state.reflections ?? [],
          profileAccuracy:
            typeof state.profileAccuracy === 'string' ? state.profileAccuracy : undefined,
          // Unknown/missing resetTypeId is resolved once in ensureSeeded when
          // onboarding answers are available — never reclassified on migrate.
        };
      },
      partialize: (state) => ({
        currentDay: state.currentDay,
        completedDays: state.completedDays,
        todayCompleted: state.todayCompleted,
        todayStarted: state.todayStarted,
        todayTask: state.todayTask,
        resetStartedOn: state.resetStartedOn,
        lastSeenOn: state.lastSeenOn,
        lastCompletedOn: state.lastCompletedOn,
        streak: state.streak,
        missedYesterday: state.missedYesterday,
        resetTypeId: state.resetTypeId,
        profileAccuracy: state.profileAccuracy,
        personalization: state.personalization,
        reflections: state.reflections ?? [],
      }),
    },
  ),
);
