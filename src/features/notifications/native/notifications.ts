import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { REMINDER_ID_PREFIX, type PlannedReminder } from '../utils/planReminders';

/** Notifications only exist in the iOS/Android app, not the web preview. */
export const notificationsAvailable = Platform.OS === 'ios' || Platform.OS === 'android';

export type NotificationPermission = 'granted' | 'denied' | 'undetermined';

let handlerSet = false;

/** Show banners even when the app is open, so a friend's encouragement isn't missed. */
export function setForegroundNotificationHandler(): void {
  if (!notificationsAvailable || handlerSet) {
    return;
  }
  handlerSet = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function getNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsAvailable) {
    return 'denied';
  }
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted' ? 'granted' : status === 'denied' ? 'denied' : 'undetermined';
}

/** Shows Apple's permission prompt (only the first time; after that it returns the saved answer). */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsAvailable) {
    return 'denied';
  }
  const { status } = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowSound: true, allowBadge: false },
  });
  return status === 'granted' ? 'granted' : 'denied';
}

/** Replaces every queued daily reminder with `reminders` (pass [] to clear them). */
export async function replaceScheduledReminders(
  reminders: readonly PlannedReminder[],
): Promise<void> {
  if (!notificationsAvailable) {
    return;
  }
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((request) => request.identifier.startsWith(REMINDER_ID_PREFIX))
      .map((request) => Notifications.cancelScheduledNotificationAsync(request.identifier)),
  );
  for (const reminder of reminders) {
    await Notifications.scheduleNotificationAsync({
      identifier: reminder.id,
      content: {
        title: reminder.title,
        body: reminder.body,
        sound: 'default',
        data: { type: 'daily_reminder', url: '/journey' },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: reminder.date },
    });
  }
}

/** This phone's Expo push token, or null where push isn't possible (simulator, web, no permission). */
export async function getExpoPushToken(): Promise<string | null> {
  if (!notificationsAvailable) {
    return null;
  }
  const projectId = (Constants.expoConfig?.extra?.eas as { projectId?: string } | undefined)
    ?.projectId;
  if (!projectId) {
    return null;
  }
  try {
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    return data;
  } catch {
    return null;
  }
}

export function pushPlatform(): 'ios' | 'android' {
  return Platform.OS === 'android' ? 'android' : 'ios';
}

/** Calls `onOpen(url)` when someone taps one of our notifications, including the one that opened the app. */
export function addNotificationTapListener(onOpen: (url: string) => void): () => void {
  if (!notificationsAvailable) {
    return () => {};
  }
  const handled = new Set<string>();
  const open = (response: Notifications.NotificationResponse | null) => {
    if (!response) {
      return;
    }
    // iOS keeps the last tapped notification around; handle each tap once, then forget it,
    // or the app would jump to that screen again on every launch.
    const id = response.notification.request.identifier;
    if (handled.has(id)) {
      return;
    }
    handled.add(id);
    Notifications.clearLastNotificationResponse();
    const url = response.notification.request.content.data?.url;
    // Only our own screens: a path like "/world", never "//host" or a full URL.
    if (typeof url === 'string' && /^\/[a-z-]+$/.test(url)) {
      onOpen(url);
    }
  };
  open(Notifications.getLastNotificationResponse());
  const subscription = Notifications.addNotificationResponseReceivedListener(open);
  return () => subscription.remove();
}
