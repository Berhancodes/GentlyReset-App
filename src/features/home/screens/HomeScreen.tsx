import { useCallback, useEffect, useLayoutEffect } from 'react';
import { AppState, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, getTabBarScenePadding, MainTabHeader, Screen } from '@/components/ui';
import { spacing } from '@/design-system';
import { DayProgressHeader } from '@/features/home/components/DayProgressHeader';
import { HomeScene } from '@/features/home/components/HomeScene';
import { TodayResetCard } from '@/features/home/components/TodayResetCard';
import {
  getHomeGreeting,
  getHomeSupportLine,
  getHomeTaskTitle,
  HOME_COMPLETION_MESSAGE,
  HOME_IDLE_SUBTITLE,
} from '@/features/home/utils/homeCopy';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { getTaskForDay } from '@/features/reset/utils/getTaskForDay';

const HOME_COLUMN_MAX_WIDTH = 430;
const COMPACT_HEIGHT = 740;

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const compact = height < COMPACT_HEIGHT;
  const answers = useOnboardingStore((state) => state.answers);
  const resetStartedOn = useResetStore((state) => state.resetStartedOn);
  const currentDay = useResetStore((state) => state.currentDay);
  const completedDays = useResetStore((state) => state.completedDays);
  const todayCompleted = useResetStore((state) => state.todayCompleted);
  const todayStarted = useResetStore((state) => state.todayStarted);
  const personalization = useResetStore((state) => state.personalization);
  const ensureSeeded = useResetStore((state) => state.ensureSeeded);
  const applyCalendarDay = useResetStore((state) => state.applyCalendarDay);
  const startToday = useResetStore((state) => state.startToday);
  const completeToday = useResetStore((state) => state.completeToday);

  const syncDay = useCallback(() => {
    ensureSeeded(answers);
    applyCalendarDay();
  }, [answers, applyCalendarDay, ensureSeeded]);

  useLayoutEffect(() => {
    syncDay();
  }, [syncDay]);

  useFocusEffect(
    useCallback(() => {
      syncDay();
    }, [syncDay]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        syncDay();
      }
    });
    return () => subscription.remove();
  }, [syncDay]);

  if (!resetStartedOn) {
    return (
      <Screen
        includeTopSafeArea={false}
        includeBottomSafeArea={false}
        padded={false}
        backgroundColor="transparent"
      >
        <HomeScene completed={false} />
        <MainTabHeader title="home" transparent />
      </Screen>
    );
  }

  const task = getTaskForDay(currentDay, personalization);

  return (
    <Screen
      includeTopSafeArea={false}
      includeBottomSafeArea={false}
      padded={false}
      backgroundColor="transparent"
    >
      <HomeScene completed={todayCompleted} />
      <MainTabHeader title="home" transparent />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          compact ? styles.contentCompact : null,
          { paddingBottom: getTabBarScenePadding(insets.bottom) },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        <View style={styles.greeting}>
          <AppText variant="display">{getHomeGreeting()}</AppText>
          <AppText variant="body" color="primary">
            {HOME_IDLE_SUBTITLE}
          </AppText>
        </View>
        <DayProgressHeader
          currentDay={currentDay}
          completedCount={completedDays.length}
          showCount={false}
          layout="inline"
        />
        <TodayResetCard
          title={getHomeTaskTitle(task.minutes)}
          description={getHomeSupportLine(personalization.primaryObstacle)}
          minutes={task.minutes}
          started={todayStarted}
          completed={todayCompleted}
          completionMessage={HOME_COMPLETION_MESSAGE}
          onStart={startToday}
          onComplete={completeToday}
        />
        <View style={styles.landscape} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: HOME_COLUMN_MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  contentCompact: {
    paddingTop: spacing.xxs,
    gap: spacing.xs,
  },
  greeting: {
    flexShrink: 0,
    gap: spacing.xxs,
  },
  landscape: {
    flex: 1,
    minHeight: spacing.xl,
  },
});
