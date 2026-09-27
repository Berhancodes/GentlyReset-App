import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { MainTabHeader, Screen } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import { DayProgressHeader } from '@/features/home/components/DayProgressHeader';
import { JourneyDaySheet } from '@/features/journey/components/JourneyDaySheet';
import { JourneyLinearStage } from '@/features/journey/components/JourneyLinearStage';
import { JourneyQuoteCard } from '@/features/journey/components/JourneyQuoteCard';
import { useJourneyProgression } from '@/features/journey/hooks/useJourneyProgression';
import { useJourneyVisualStore } from '@/features/journey/store/useJourneyVisualStore';
import { getJourneyChapterForDay } from '@/features/journey/data/journeyChapters';
import { getJourneyQuote } from '@/features/journey/data/journeyCopy';
import { getJourneySheetModel } from '@/features/journey/utils/getJourneySheetModel';
import { getResetProfile } from '@/features/reset/data/resetProfiles';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import {
  getCompletedDayCount,
  getCurrentResetTask,
  getResetProgress,
} from '@/features/reset/utils/resetSelectors';

function JourneyMapGlyph() {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no" style={styles.mapButton}>
      <Ionicons name="map-outline" size={24} color={colors.text.primary} />
    </View>
  );
}

export function JourneyScreen() {
  useSyncResetDay();
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [journeyFocused, setJourneyFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setJourneyFocused(true);
      return () => {
        setJourneyFocused(false);
      };
    }, []),
  );

  const currentDay = useResetStore((state) => state.currentDay);
  const completedDays = useResetStore((state) => state.completedDays);
  const todayCompleted = useResetStore((state) => state.todayCompleted);
  const todayStarted = useResetStore((state) => state.todayStarted);
  const personalization = useResetStore((state) => state.personalization);
  const resetTypeId = useResetStore((state) => state.resetTypeId);
  const resetStartedOn = useResetStore((state) => state.resetStartedOn);
  const startToday = useResetStore((state) => state.startToday);

  const rememberLine = getResetProfile(resetTypeId).homeSupportLine;
  const currentTask = getCurrentResetTask({ currentDay, personalization });
  const progression = useJourneyProgression({
    currentDay,
    completedDays,
    todayCompleted,
    currentTitle: currentTask.title,
    focused: journeyFocused,
  });
  const chapter = getJourneyChapterForDay(progression.headingDay);
  const completedCount = getCompletedDayCount({ completedDays });
  const progress = getResetProgress({ completedDays });

  const sheetModel =
    selectedDay === null
      ? null
      : getJourneySheetModel({
          day: selectedDay,
          currentDay,
          completedDays,
          todayStarted,
          todayCompleted,
          personalization,
          rememberLine,
        });

  const onPressDay = useCallback((day: number) => {
    setSelectedDay(day);
  }, []);

  const closeSheet = useCallback(() => {
    setSelectedDay(null);
  }, []);

  const onPrimary = useCallback(() => {
    if (!sheetModel) {
      return;
    }
    if (sheetModel.cta === 'start') {
      startToday();
      setSelectedDay(null);
      router.navigate('/(app)/(tabs)/home');
      return;
    }
    if (sheetModel.cta === 'continue') {
      setSelectedDay(null);
      router.navigate('/(app)/(tabs)/home');
    }
  }, [router, sheetModel, startToday]);

  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <MainTabHeader title="journey" contentSpacing="roomy" rightAction={<JourneyMapGlyph />} />
      {resetStartedOn ? (
        <>
          <View style={styles.progress}>
            <DayProgressHeader
              currentDay={progression.progressDay}
              completedCount={completedCount}
              progress={progress}
              thickness={spacing.xxs}
              fillColor={colors.accent.gold}
              trackColor={colors.progress.track}
              startMarker
            />
          </View>
          <JourneyLinearStage
            presentation={progression}
            onPressDay={onPressDay}
            focused={journeyFocused}
          />
          <JourneyQuoteCard
            quote={chapter ? getJourneyQuote(chapter.id) : 'One small step can change everything.'}
          />
          <JourneyDaySheet
            visible={sheetModel !== null}
            model={sheetModel}
            onClose={closeSheet}
            onPrimary={onPrimary}
          />
        </>
      ) : null}
    </Screen>
  );
}

if (__DEV__) {
  Object.assign(globalThis, {
    replayJourneyProgression() {
      const visual = useJourneyVisualStore.getState();
      const preview = visual.devPreview;
      if (preview && preview.restDay === preview.toDay && !preview.pendingPlay) {
        visual.restDevSideScroll(preview.fromDay);
        console.log(`Journey preview resting on day ${preview.fromDay} only.`);
        return;
      }
      visual.playDevSideScroll(3, 4);
      console.log('Journey preview: day 3 exits left, day 4 enters right.');
    },
    resetJourneyProgression() {
      const day = useResetStore.getState().currentDay;
      useJourneyVisualStore.getState().clearDevSideScroll();
      useJourneyVisualStore.getState().acknowledgeDay(day);
      console.log(`Journey preview cleared. Resting on real day ${day}.`);
    },
  });
}

const styles = StyleSheet.create({
  progress: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  mapButton: {
    minWidth: spacing.hitTarget,
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
