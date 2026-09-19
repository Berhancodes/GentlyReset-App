import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { MainTabHeader, Screen } from '@/components/ui';
import { spacing } from '@/design-system';
import { DayProgressHeader } from '@/features/home/components/DayProgressHeader';
import { JourneyPath } from '@/features/journey/components/JourneyPath';
import { PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { getTaskForDay } from '@/features/reset/utils/getTaskForDay';
import type { TodayTask } from '@/features/reset/types';

export function JourneyScreen() {
  useSyncResetDay();
  const router = useRouter();
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const currentDay = useResetStore((state) => state.currentDay);
  const completedDays = useResetStore((state) => state.completedDays);
  const todayCompleted = useResetStore((state) => state.todayCompleted);
  const personalization = useResetStore((state) => state.personalization);
  const resetStartedOn = useResetStore((state) => state.resetStartedOn);

  const tasksByDay = useMemo(() => {
    const map = new Map<number, TodayTask>();
    for (let day = 1; day <= PLAN_DAY_COUNT; day += 1) {
      // Same source as Home: getTaskForDay(currentDay, personalization).
      map.set(day, getTaskForDay(day, personalization));
    }
    return map;
  }, [personalization]);

  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <MainTabHeader title="journey" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {resetStartedOn ? (
          <>
            <DayProgressHeader currentDay={currentDay} completedCount={completedDays.length} />
            <JourneyPath
              currentDay={currentDay}
              completedDays={completedDays}
              todayCompleted={todayCompleted}
              tasksByDay={tasksByDay}
              expandedDay={expandedDay}
              onPressDay={(day, kind) => {
                if (kind === 'today') {
                  router.navigate('/(app)/(tabs)/home');
                  return;
                }
                if (kind === 'completed') {
                  setExpandedDay((current) => (current === day ? null : day));
                }
              }}
            />
          </>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
});
