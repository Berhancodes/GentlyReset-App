import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking } from 'react-native';

import { getSingleChoiceId } from '@/features/onboarding/utils/answerReaders';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';

import {
  getNotificationPermission,
  notificationsAvailable,
  requestNotificationPermission,
  type NotificationPermission,
} from '../native/notifications';
import { useNotificationStore } from '../store/useNotificationStore';
import { formatReminderTime, resolveReminderTime, shiftReminderTime } from '../utils/planReminders';

/** Everything the Profile notification settings need, with Apple's permission handled. */
export function useNotificationSettings() {
  const [permission, setPermission] = useState<NotificationPermission>('undetermined');
  const reminderEnabled = useNotificationStore((state) => state.reminderEnabled);
  const friendPushEnabled = useNotificationStore((state) => state.friendPushEnabled);
  const savedTime = useNotificationStore((state) => state.reminderTime);
  const setReminderEnabled = useNotificationStore((state) => state.setReminderEnabled);
  const setFriendPushEnabled = useNotificationStore((state) => state.setFriendPushEnabled);
  const setReminderTime = useNotificationStore((state) => state.setReminderTime);
  const supportTiming = useOnboardingStore((state) =>
    getSingleChoiceId(state.answers, 'supportTiming'),
  );
  const time = resolveReminderTime(savedTime, supportTiming);

  const refreshPermission = useCallback(() => {
    void getNotificationPermission()
      .then(setPermission)
      .catch(() => setPermission('denied'));
  }, []);

  // Re-check after a trip to iOS Settings.
  useEffect(() => {
    refreshPermission();
    const subscription = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        refreshPermission();
      }
    });
    return () => subscription.remove();
  }, [refreshPermission]);

  /** Switching something on asks Apple for permission first if it hasn't been asked. */
  const switchOn = useCallback(
    async (apply: () => void) => {
      const granted =
        permission === 'granted' || (await requestNotificationPermission()) === 'granted';
      setPermission(granted ? 'granted' : 'denied');
      if (granted) {
        apply();
      }
    },
    [permission],
  );

  const toggleReminder = useCallback(
    (on: boolean) => {
      if (!on) {
        setReminderEnabled(false);
        return;
      }
      void switchOn(() => setReminderEnabled(true));
    },
    [setReminderEnabled, switchOn],
  );

  const toggleFriendPush = useCallback(
    (on: boolean) => {
      if (!on) {
        setFriendPushEnabled(false);
        return;
      }
      void switchOn(() => setFriendPushEnabled(true));
    },
    [setFriendPushEnabled, switchOn],
  );

  return {
    available: notificationsAvailable,
    /** iOS has notifications off for the app, so switching on can't work until Settings. */
    blockedInSettings: permission === 'denied',
    reminderOn: reminderEnabled && permission === 'granted',
    friendPushOn: friendPushEnabled && permission === 'granted',
    timeLabel: formatReminderTime(time),
    toggleReminder,
    toggleFriendPush,
    earlier: () => setReminderTime(shiftReminderTime(time, -1)),
    later: () => setReminderTime(shiftReminderTime(time, 1)),
    openSettings: () => void Linking.openSettings().catch(() => undefined),
  };
}
