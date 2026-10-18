import { useCallback, useState } from 'react';

import { getSingleChoiceId } from '@/features/onboarding/utils/answerReaders';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';

import {
  getNotificationPermission,
  notificationsAvailable,
  requestNotificationPermission,
} from '../native/notifications';
import { useNotificationStore } from '../store/useNotificationStore';
import { formatReminderTime, resolveReminderTime } from '../utils/planReminders';

/**
 * The friendly "want a little reminder?" question, asked once after a check-in
 * (never on first launch). Apple's own permission prompt only appears if they say yes.
 */
export function useReminderPrompt() {
  const [visible, setVisible] = useState(false);
  const answered = useNotificationStore((state) => state.reminderPromptAnswered);
  const answerReminderPrompt = useNotificationStore((state) => state.answerReminderPrompt);
  const reminderTime = useNotificationStore((state) => state.reminderTime);
  const supportTiming = useOnboardingStore((state) =>
    getSingleChoiceId(state.answers, 'supportTiming'),
  );
  const timeLabel = formatReminderTime(resolveReminderTime(reminderTime, supportTiming));

  /** Shows the question if it hasn't been answered yet. Returns whether it opened. */
  const showAfterCheckIn = useCallback((): boolean => {
    if (!notificationsAvailable || answered || !useNotificationStore.persist.hasHydrated()) {
      return false;
    }
    setVisible(true);
    return true;
  }, [answered]);

  const answer = useCallback(
    (wantsReminders: boolean) => {
      setVisible(false);
      if (!wantsReminders) {
        answerReminderPrompt(false);
        return;
      }
      void (async () => {
        const current = await getNotificationPermission();
        const permission = current === 'granted' ? current : await requestNotificationPermission();
        answerReminderPrompt(permission === 'granted');
      })().catch(() => answerReminderPrompt(false));
    },
    [answerReminderPrompt],
  );

  return { visible, timeLabel, showAfterCheckIn, answer };
}
