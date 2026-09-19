import { useCallback, useEffect, useLayoutEffect } from 'react';
import { AppState, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import { AppText, MainTabHeader, Screen } from '@/components/ui';
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
      <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
        <MainTabHeader title="home" />
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
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <MainTabHeader title="home" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.greeting}>
          <AppText variant="title">{getHomeGreeting()}</AppText>
          <Animated.View key={companionMoment} entering={messageEntering}>
            <AppText variant="body" color="secondary">
              {subtitle}
            </AppText>
          </Animated.View>
        </View>
        <HomeScene completed={todayCompleted} />
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
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  greeting: {
    flexShrink: 0,
    gap: spacing.xxs,
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
