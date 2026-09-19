import { useCallback, useEffect, useLayoutEffect } from 'react';
import { AppState, Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import { AppText, getTabBarScenePadding, MainTabHeader, Screen } from '@/components/ui';
import { spacing } from '@/design-system';
import { HomeScene } from '@/features/home/components/HomeScene';
import { TodayResetCard } from '@/features/home/components/TodayResetCard';
import { getHomeGreeting, HOME_IDLE_SUBTITLE } from '@/features/home/utils/homeCopy';
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

  const completeReset = useCallback(() => {
    if (!todayStarted) {
      startToday();
    }
    completeToday();
  }, [completeToday, startToday, todayStarted]);

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
  const companionMoment = todayCompleted
    ? 'completed'
    : missedYesterday
      ? 'missed'
      : todayStarted
        ? 'started'
        : 'idle';
  const subtitle =
    companionMoment === 'idle' || companionMoment === 'started'
      ? HOME_IDLE_SUBTITLE
      : getCompanionMessage(companionMoment, personalization);
  const messageEntering = reduceMotion ? undefined : FadeIn.duration(320);

  return (
    <Screen
      includeTopSafeArea={false}
      includeBottomSafeArea={false}
      padded={false}
      backgroundColor="transparent"
    >
      <HomeScene completed={todayCompleted} />
      <MainTabHeader title="home" transparent />
      <View style={[styles.content, { paddingBottom: getTabBarScenePadding(insets.bottom) }]}>
        <View style={styles.greeting}>
          <AppText variant="title">{getHomeGreeting()}</AppText>
          <Animated.View key={companionMoment} entering={messageEntering}>
            <AppText variant="body" color="secondary">
              {subtitle}
            </AppText>
          </Animated.View>
        </View>
        <TodayResetCard
          minutes={task.minutes}
          completed={todayCompleted}
          onComplete={completeReset}
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
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
    maxWidth: HOME_COLUMN_MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    gap: spacing.md,
  },
  greeting: {
    flexShrink: 0,
    gap: spacing.xxs,
  },
  reflection: {
    flexShrink: 0,
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
