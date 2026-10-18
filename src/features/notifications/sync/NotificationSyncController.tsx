import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useRouter, type Href } from 'expo-router';

import { useAuth } from '@/features/auth/session/useAuth';
import { getMascotIntroName, getSingleChoiceId } from '@/features/onboarding/utils/answerReaders';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { useResetStore } from '@/features/reset/store/useResetStore';

import { registerPushToken, unregisterPushToken } from '../api/pushTokensApi';
import {
  addNotificationTapListener,
  getExpoPushToken,
  getNotificationPermission,
  notificationsAvailable,
  pushPlatform,
  replaceScheduledReminders,
  setForegroundNotificationHandler,
} from '../native/notifications';
import { useNotificationStore } from '../store/useNotificationStore';
import { planReminders, resolveReminderTime } from '../utils/planReminders';

/**
 * Keeps notifications in step with the app. Renders nothing.
 * - Daily reminders: re-queued after each check-in, setting change and return to the app.
 * - Friend notifications: saves this phone's push token on the server while they're on.
 * - Tapping a notification opens the screen it's about.
 */
export function NotificationSyncController() {
  return notificationsAvailable ? <NotificationSync /> : null;
}

function NotificationSync() {
  const router = useRouter();
  const [foregroundTick, setForegroundTick] = useState(0);
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const reminderEnabled = useNotificationStore((state) => state.reminderEnabled);
  const reminderTime = useNotificationStore((state) => state.reminderTime);
  const friendPushEnabled = useNotificationStore((state) => state.friendPushEnabled);
  const registeredPush = useNotificationStore((state) => state.registeredPush);
  const setRegisteredPush = useNotificationStore((state) => state.setRegisteredPush);

  const todayCompleted = useResetStore((state) => state.todayCompleted);
  const lastCompletedOn = useResetStore((state) => state.lastCompletedOn);
  const resetStartedOn = useResetStore((state) => state.resetStartedOn);
  const answers = useOnboardingStore((state) => state.answers);
  const supportTiming = getSingleChoiceId(answers, 'supportTiming');
  const missedDayStyle = getSingleChoiceId(answers, 'missedDayResponse');
  const name = getMascotIntroName(answers);

  useEffect(() => {
    setForegroundNotificationHandler();
    const appState = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        setForegroundTick((tick) => tick + 1);
      }
    });
    const removeTapListener = addNotificationTapListener((url) => {
      router.push(url as Href);
    });
    return () => {
      appState.remove();
      removeTapListener();
    };
  }, [router]);

  // Daily reminders.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const permission = await getNotificationPermission();
        const wanted = reminderEnabled && permission === 'granted' && resetStartedOn !== null;
        const reminders = wanted
          ? planReminders({
              now: new Date(),
              time: resolveReminderTime(reminderTime, supportTiming),
              todayCompleted,
              name,
              missedDayStyle,
            })
          : [];
        if (!cancelled) {
          await replaceScheduledReminders(reminders);
        }
      } catch {
        // Reminders are a bonus; never let them break the app.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    foregroundTick,
    lastCompletedOn,
    missedDayStyle,
    name,
    reminderEnabled,
    reminderTime,
    resetStartedOn,
    supportTiming,
    todayCompleted,
  ]);

  // Friend notifications: keep this phone's token on the server only while they're wanted.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const permission = await getNotificationPermission();
        const wanted = friendPushEnabled && permission === 'granted' && userId !== null;
        if (!wanted) {
          if (registeredPush && userId === registeredPush.userId) {
            await unregisterPushToken(registeredPush.token);
            if (!cancelled) {
              setRegisteredPush(null);
            }
          }
          return;
        }
        const token = await getExpoPushToken();
        if (!token || cancelled) {
          return;
        }
        if (registeredPush?.token === token && registeredPush.userId === userId) {
          return;
        }
        if (await registerPushToken(token, pushPlatform())) {
          if (!cancelled) {
            setRegisteredPush({ token, userId });
          }
        }
      } catch {
        // Friend notifications are a bonus; never let them break the app.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [foregroundTick, friendPushEnabled, registeredPush, setRegisteredPush, userId]);

  return null;
}
