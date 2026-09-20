import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { MainTabHeader, Screen } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import { DayProgressHeader } from '@/features/home/components/DayProgressHeader';
import { JourneyDaySheet } from '@/features/journey/components/JourneyDaySheet';
import { JourneyLinearStage } from '@/features/journey/components/JourneyLinearStage';
import { JourneyQuoteCard } from '@/features/journey/components/JourneyQuoteCard';
import { getJourneyChapterForDay } from '@/features/journey/data/journeyChapters';
import { getJourneyQuote } from '@/features/journey/data/journeyCopy';
import { getJourneySheetModel } from '@/features/journey/utils/getJourneySheetModel';
import { getResetProfile } from '@/features/reset/data/resetProfiles';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { getTaskForDay } from '@/features/reset/utils/getTaskForDay';

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

  const currentDay = useResetStore((state) => state.currentDay);
  const completedDays = useResetStore((state) => state.completedDays);
  const todayCompleted = useResetStore((state) => state.todayCompleted);
  const todayStarted = useResetStore((state) => state.todayStarted);
  const personalization = useResetStore((state) => state.personalization);
  const resetTypeId = useResetStore((state) => state.resetTypeId);
  const resetStartedOn = useResetStore((state) => state.resetStartedOn);
  const startToday = useResetStore((state) => state.startToday);

  const rememberLine = getResetProfile(resetTypeId).homeSupportLine;
  const chapter = getJourneyChapterForDay(currentDay);
  const currentTask = getTaskForDay(currentDay, personalization);

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
              currentDay={currentDay}
              completedCount={completedDays.length}
              thickness={spacing.xxs}
              fillColor={colors.accent.gold}
              trackColor={colors.progress.track}
              startMarker
            />
          </View>
          <JourneyLinearStage
            currentDay={currentDay}
            completedDays={completedDays}
            todayCompleted={todayCompleted}
            taskTitle={currentTask.title}
            onPressDay={onPressDay}
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
