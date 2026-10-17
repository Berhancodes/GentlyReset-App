import { router } from 'expo-router';

import { clearDeviceData } from '@/features/account/clearDeviceData';
import { PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';
import { useJourneyVisualStore } from '@/features/journey/store/useJourneyVisualStore';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
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
    /** Marks onboarding done with no answers (default plan) and opens Home. */
    skipOnboarding() {
      const onboarding = useOnboardingStore.getState();
      useResetStore.getState().ensureSeeded(onboarding.answers);
      onboarding.completeOnboarding();
      router.replace('/');
      console.log('Onboarding skipped. Try jumpToDay(29).');
    },
    /**
     * Makes `day` today's plan day, not started yet, with every earlier day
     * checked in on the days before. `jumpToDay(29)` sets up the last stretch.
     */
    jumpToDay(day: number) {
      const reset = useResetStore.getState();
      if (!reset.resetStartedOn) {
        console.log('Finish onboarding first, then try again.');
        return;
      }
      const target = Math.max(1, Math.min(PLAN_DAY_COUNT, Math.floor(day)));
      const now = new Date();
      const daysAgo = (count: number) =>
        toLocalDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - count));
      const earlierDays = Array.from({ length: target - 1 }, (_, index) => index + 1);
      useResetStore.setState({
        currentDay: target,
        completedDays: earlierDays,
        completionDates: Object.fromEntries(
          earlierDays.map((earlierDay) => [earlierDay, daysAgo(target - earlierDay)]),
        ),
        todayStarted: false,
        todayCompleted: false,
        lastCompletedOn: earlierDays.length > 0 ? daysAgo(1) : null,
        lastSeenOn: toLocalDateKey(now),
        streak: earlierDays.length,
      });
      useJourneyVisualStore.setState({ stepChecks: null });
      console.log(`Now on day ${target}, not started yet.`);
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
