import { useCallback, useEffect, useLayoutEffect } from 'react';
import { AppState, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import { AppText, getTabBarScenePadding, MainTabHeader, Screen } from '@/components/ui';
import { spacing } from '@/design-system';
import { DayProgressHeader } from '@/features/home/components/DayProgressHeader';
import { HomeScene } from '@/features/home/components/HomeScene';
import { TodayResetCard } from '@/features/home/components/TodayResetCard';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { getCompanionMessage } from '@/features/reset/utils/companionCopy';
import { getTaskForDay } from '@/features/reset/utils/getTaskForDay';

const HOME_COLUMN_MAX_WIDTH = 430;

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const answers = useOnboardingStore((state) => state.answers);
  const resetStartedOn = useResetStore((state) => state.resetStartedOn);
  const currentDay = useResetStore((state) => state.currentDay);
  const completedDays = useResetStore((state) => state.completedDays);
  const todayCompleted = useResetStore((state) => state.todayCompleted);
  const todayStarted = useResetStore((state) => state.todayStarted);
  const missedYesterday = useResetStore((state) => state.missedYesterday);
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
      <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
        <MainTabHeader title="home" showMascot={false} />
      </Screen>
    );
  }

  const task = getTaskForDay(currentDay, personalization);
  const companionMoment = todayCompleted
    ? 'completed'
    : missedYesterday
      ? 'missed'
      : todayStarted
        ? 'started'
        : 'idle';
  const companionMessage = getCompanionMessage(companionMoment, personalization);
  const messageEntering = reduceMotion ? undefined : FadeIn.duration(320);

  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <MainTabHeader title="home" showMascot={false} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: getTabBarScenePadding(insets.bottom) },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <DayProgressHeader
          currentDay={currentDay}
          completedCount={completedDays.length}
          showCount={false}
        />
        <Animated.View key={companionMoment} entering={messageEntering}>
          <AppText variant="body" color="secondary">
            {companionMessage}
          </AppText>
        </Animated.View>
        <TodayResetCard
          task={task}
          started={todayStarted}
          completed={todayCompleted}
          onStart={startToday}
          onComplete={completeToday}
        />
        {todayCompleted ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save a reflection. How was that?"
            accessibilityHint="Opens the journal tab"
            onPress={() => {
              router.navigate('/(app)/(tabs)/reflect');
            }}
            style={({ pressed }) => [styles.reflection, pressed ? styles.reflectionPressed : null]}
          >
            <AppText variant="caption" color="helper" align="center">
              how was that?
            </AppText>
            <AppText variant="optionTitle" align="center">
              save a reflection →
            </AppText>
          </Pressable>
        ) : null}
        <HomeScene completed={todayCompleted} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: HOME_COLUMN_MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  reflection: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.sm,
  },
  reflectionPressed: {
    opacity: 0.72,
  },
});
