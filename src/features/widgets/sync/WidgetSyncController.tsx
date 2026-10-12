import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { ROOM_STAGES } from '@/features/room/data/roomStages';
import { getRoomState } from '@/features/room/utils/getRoomState';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { getCompletedDayCount } from '@/features/reset/utils/resetSelectors';
import { syncWidgetMascots } from '@/features/widgets/sync/syncWidgetMascots';
import { widgetsAvailable } from '@/features/widgets/native/widgetsAvailability';
import { getWidgetTimeline, type WidgetMascots } from '@/features/widgets/utils/getWidgetTimeline';

type WidgetModule = typeof import('@/features/widgets/widget/gentlyResetWidget');

/**
 * Keeps the home screen widget in step with today's reset: after each check-in, when the
 * app comes back to the front, and (through the timeline) at midnight. Renders nothing.
 * Does nothing at all where widgets don't exist (Expo Go, web, Android).
 */
export function WidgetSyncController() {
  return widgetsAvailable ? <WidgetSync /> : null;
}

function WidgetSync() {
  const [mascots, setMascots] = useState<WidgetMascots | null>(null);
  const [widgetModule, setWidgetModule] = useState<WidgetModule | null>(null);
  const [foregroundTick, setForegroundTick] = useState(0);
  const resetStartedOn = useResetStore((state) => state.resetStartedOn);
  const currentDay = useResetStore((state) => state.currentDay);
  const completedDays = useResetStore((state) => state.completedDays);
  const todayCompleted = useResetStore((state) => state.todayCompleted);
  const missedYesterday = useResetStore((state) => state.missedYesterday);
  const streak = useResetStore((state) => state.streak);
  const stepTitle = useResetStore((state) => state.todayTask.title);

  useEffect(() => {
    let active = true;
    // Loaded only here, so apps without the widget module never touch expo-widgets.
    void import('@/features/widgets/widget/gentlyResetWidget')
      .then((module) => {
        if (active) {
          setWidgetModule(module);
        }
      })
      .catch(() => {
        // Without the widget code there is nothing to update.
      });
    syncWidgetMascots()
      .then((result) => {
        if (active) {
          setMascots(result);
        }
      })
      .catch(() => {
        // No widget pictures means no widget update; the app itself is unaffected.
      });
    const subscription = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        setForegroundTick((tick) => tick + 1);
      }
    });
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!mascots || !widgetModule) {
      return;
    }
    const completedCount = getCompletedDayCount({ completedDays });
    const room = getRoomState(completedCount);
    const roomGrewToday =
      todayCompleted &&
      completedCount > 0 &&
      ROOM_STAGES.some((stage) => stage.fromCheckIns === completedCount);
    try {
      widgetModule.gentlyResetWidget.updateTimeline(
        getWidgetTimeline(
          {
            resetStartedOn,
            currentDay,
            completedCount,
            todayCompleted,
            missedYesterday,
            streak,
            stepTitle,
            roomName: room.stage.name,
            roomGrewToday,
          },
          mascots,
          new Date(),
        ),
      );
    } catch {
      // Widgets are a bonus; never let them break the app.
    }
  }, [
    completedDays,
    currentDay,
    foregroundTick,
    mascots,
    missedYesterday,
    resetStartedOn,
    stepTitle,
    streak,
    todayCompleted,
    widgetModule,
  ]);

  return null;
}
