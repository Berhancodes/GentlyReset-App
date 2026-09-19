import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { OnboardingAnswer } from '@/features/onboarding/types/onboarding';
import { getSingleChoiceId } from '@/features/onboarding/utils/answerReaders';
import type { JournalMood, ResetSnapshot, TodayTask } from '@/features/reset/types';
import { PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';
import { applyDateRollover } from '@/features/reset/utils/applyDateRollover';
import { shiftDateKey, toLocalDateKey } from '@/features/reset/utils/calendar';
import { resolveStoredResetTypeId } from '@/features/reset/utils/deriveResetType';
import { getTaskForDay } from '@/features/reset/utils/getTaskForDay';
import { createSeededResetState } from '@/features/reset/utils/seedResetState';
import { asyncPersistStorage } from '@/utils/persistStorage';

const emptyPersonalization = {
  desiredFeelings: [] as const,
};

const fallbackTask: TodayTask = getTaskForDay(1, emptyPersonalization);

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
        const current = get();
        if (!current.resetStartedOn || current.todayCompleted) {
          return;
        }
        set({ todayStarted: true });
      },
      completeToday: (now = new Date()) => {
        const today = toLocalDateKey(now);
        const rolled = applyDateRollover(get(), today);
        if (rolled.todayCompleted) {
          set(rolled);
          return;
        }
        if (rolled.completedDays.includes(rolled.currentDay)) {
          set({
            ...rolled,
            todayCompleted: true,
            todayStarted: true,
          });
          return;
        }

        const yesterday = shiftDateKey(today, -1);
        const streak =
          rolled.lastCompletedOn === yesterday
            ? rolled.streak + 1
            : rolled.lastCompletedOn === today
              ? rolled.streak
              : 1;

        set({
          ...rolled,
          todayCompleted: true,
          todayStarted: true,
          completedDays: [...rolled.completedDays, rolled.currentDay],
          lastCompletedOn: today,
          streak: Math.min(PLAN_DAY_COUNT, streak),
          missedYesterday: false,
          todayTask: getTaskForDay(rolled.currentDay, rolled.personalization),
        });
      },
      saveReflection: (input, now = new Date()) => {
        const today = toLocalDateKey(now);
        const rolled = applyDateRollover(get(), today);
        const text = input.text.trim();
        if (!text) {
          set(rolled);
          return;
        }

        const entry = {
          day: rolled.currentDay,
          date: today,
          mood: input.mood,
          prompt: input.prompt,
          text,
          savedAt: now.toISOString(),
        };
        const remaining = (rolled.reflections ?? []).filter(
          (reflection) => reflection.day !== rolled.currentDay,
        );

        set({
          ...rolled,
          reflections: [...remaining, entry].sort((left, right) => left.day - right.day),
        });
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
