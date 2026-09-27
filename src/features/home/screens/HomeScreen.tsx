import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, getTabBarScenePadding, MainTabHeader, Screen } from '@/components/ui';
import { spacing } from '@/design-system';
import { DayProgressHeader } from '@/features/home/components/DayProgressHeader';
import { HomeScene } from '@/features/home/components/HomeScene';
import { TodayResetCard } from '@/features/home/components/TodayResetCard';
import { getCompanionPresentation } from '@/features/home/utils/getCompanionPresentation';
import { getHomeSupportLine } from '@/features/home/utils/homeCopy';
import { getResetProfile } from '@/features/reset/data/resetProfiles';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import {
  getCompletedDayCount,
  getCurrentPlanDay,
  getCurrentResetTask,
  getResetProgress,
} from '@/features/reset/utils/resetSelectors';

const HOME_COLUMN_MAX_WIDTH = 430;
const COMPACT_HEIGHT = 740;

export function HomeScreen() {
  useSyncResetDay();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const compact = height < COMPACT_HEIGHT;
  const resetStartedOn = useResetStore((state) => state.resetStartedOn);
  const currentDay = useResetStore((state) => state.currentDay);
  const completedDays = useResetStore((state) => state.completedDays);
  const todayCompleted = useResetStore((state) => state.todayCompleted);
  const todayStarted = useResetStore((state) => state.todayStarted);
  const missedYesterday = useResetStore((state) => state.missedYesterday);
  const personalization = useResetStore((state) => state.personalization);
  const resetTypeId = useResetStore((state) => state.resetTypeId);
  const startToday = useResetStore((state) => state.startToday);
  const completeToday = useResetStore((state) => state.completeToday);

  if (!resetStartedOn) {
    return (
      <Screen
        includeTopSafeArea={false}
        includeBottomSafeArea={false}
        padded={false}
        backgroundColor="transparent"
      >
        <HomeScene completed={false} />
        <MainTabHeader title="home" transparent fade />
      </Screen>
    );
  }

  const task = getCurrentResetTask({ currentDay, personalization });
  const planDay = getCurrentPlanDay({ currentDay });
  const completedCount = getCompletedDayCount({ completedDays });
  const progress = getResetProgress({ completedDays });
  const companion = getCompanionPresentation({
    resetStartedOn,
    currentDay,
    completedDays,
    todayStarted,
    todayCompleted,
    missedYesterday,
    resetTypeId,
  });
  const supportLine = resetTypeId
    ? getResetProfile(resetTypeId).homeSupportLine
    : getHomeSupportLine(personalization.primaryObstacle);

  return (
    <Screen
      includeTopSafeArea={false}
      includeBottomSafeArea={false}
      padded={false}
      backgroundColor="transparent"
    >
      <HomeScene completed={todayCompleted} />
      <MainTabHeader title="home" transparent fade />
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
          <AppText variant="display">{companion.greeting}</AppText>
          <AppText variant="body" color="primary">
            {companion.supportingMessage}
          </AppText>
        </View>
        <DayProgressHeader
          currentDay={planDay}
          completedCount={completedCount}
          progress={progress}
          showCount={false}
          layout="inline"
        />
        <TodayResetCard
          title={task.title}
          description={task.description}
          supportLine={supportLine}
          minutes={task.minutes}
          started={todayStarted}
          completed={todayCompleted}
          completionMessage={companion.supportingMessage}
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
