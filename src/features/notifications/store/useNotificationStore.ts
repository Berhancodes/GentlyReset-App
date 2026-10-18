import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { asyncPersistStorage } from '@/utils/persistStorage';

import type { ReminderTime } from '../data/reminderCopy';

export const NOTIFICATION_PERSIST_KEY = 'gently-reset-notifications';
export const NOTIFICATION_PERSIST_VERSION = 1;

export type RegisteredPush = { token: string; userId: string };

type NotificationSettings = {
  /** Daily reminder switched on in the app (iOS permission is checked separately). */
  reminderEnabled: boolean;
  /** Their own reminder time; null means "use the time from onboarding". */
  reminderTime: ReminderTime | null;
  /** Friend notifications (encouragements, friend requests) switched on. */
  friendPushEnabled: boolean;
  /** The "want a little reminder?" question after the first check-in was answered. */
  reminderPromptAnswered: boolean;
  /** The push token this phone saved on the server, and for whom, so it can be removed. */
  registeredPush: RegisteredPush | null;
};

type NotificationActions = {
  setReminderEnabled: (enabled: boolean) => void;
  setReminderTime: (time: ReminderTime) => void;
  setFriendPushEnabled: (enabled: boolean) => void;
  answerReminderPrompt: (accepted: boolean) => void;
  setRegisteredPush: (registered: RegisteredPush | null) => void;
  resetNotificationSettings: () => void;
};

const DEFAULTS: NotificationSettings = {
  reminderEnabled: false,
  reminderTime: null,
  friendPushEnabled: false,
  reminderPromptAnswered: false,
  registeredPush: null,
};

/** Notification choices for this phone. Cleared with the rest of the device data on sign-out. */
export const useNotificationStore = create<NotificationSettings & NotificationActions>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setReminderEnabled: (reminderEnabled) => set({ reminderEnabled }),
      setReminderTime: (reminderTime) => set({ reminderTime }),
      setFriendPushEnabled: (friendPushEnabled) => set({ friendPushEnabled }),
      // Saying yes turns on both the daily reminder and friend notifications.
      answerReminderPrompt: (accepted) =>
        set(
          accepted
            ? { reminderPromptAnswered: true, reminderEnabled: true, friendPushEnabled: true }
            : { reminderPromptAnswered: true },
        ),
      setRegisteredPush: (registeredPush) => set({ registeredPush }),
      resetNotificationSettings: () => set(DEFAULTS),
    }),
    {
      name: NOTIFICATION_PERSIST_KEY,
      storage: asyncPersistStorage,
      version: NOTIFICATION_PERSIST_VERSION,
      partialize: (state): NotificationSettings => ({
        reminderEnabled: state.reminderEnabled,
        reminderTime: state.reminderTime,
        friendPushEnabled: state.friendPushEnabled,
        reminderPromptAnswered: state.reminderPromptAnswered,
        registeredPush: state.registeredPush,
      }),
    },
  ),
);
