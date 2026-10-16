import { router } from 'expo-router';

import { clearDeviceData } from '@/features/account/clearDeviceData';
import { PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { toLocalDateKey } from '@/features/reset/utils/calendar';

/**
 * Commands to type in the React Native DevTools console (press `j` where Expo is
 * running) or the browser console while testing. Development builds only.
 */
export function registerDevCommands(): void {
  if (!__DEV__) {
    return;
  }
  Object.assign(globalThis, {
    /** Wipes this device's Gently Reset data and goes back to the welcome screen. */
    restartOnboarding() {
      clearDeviceData();
      router.replace('/(onboarding)/flow');
      console.log('Onboarding restarted from the welcome screen.');
    },
    /** Checks in every day of the current season so the season-complete card shows on Home. */
    finishSeason() {
      const reset = useResetStore.getState();
      if (!reset.resetStartedOn) {
        console.log('Finish onboarding first, then try again.');
        return;
      }
      const today = toLocalDateKey(new Date());
      const days = Array.from({ length: PLAN_DAY_COUNT }, (_, index) => index + 1);
      useResetStore.setState({
        currentDay: PLAN_DAY_COUNT,
        completedDays: days,
        completionDates: Object.fromEntries(days.map((day) => [day, today])),
        todayStarted: true,
        todayCompleted: true,
        lastCompletedOn: today,
        lastSeenOn: today,
      });
      console.log('Season finished. Open Home to choose the next season.');
    },
  });
}
