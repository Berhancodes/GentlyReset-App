import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, MainTabHeader, Screen } from '@/components/ui';
import { spacing } from '@/design-system';
import { DayProgressHeader } from '@/features/home/components/DayProgressHeader';
import { JourneyDaySheet } from '@/features/journey/components/JourneyDaySheet';
import { JourneyGroundDecor } from '@/features/journey/components/JourneyGroundDecor';
import { JourneyPath } from '@/features/journey/components/JourneyPath';
import { JourneyQuoteCard } from '@/features/journey/components/JourneyQuoteCard';
import { JourneySceneDecor } from '@/features/journey/components/JourneySceneDecor';
import { getJourneyChapterForDay } from '@/features/journey/data/journeyChapters';
import { getJourneyQuote } from '@/features/journey/data/journeyCopy';
import { getJourneySheetModel } from '@/features/journey/utils/getJourneySheetModel';
import { getResetProfile } from '@/features/reset/data/resetProfiles';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { getTaskForDay } from '@/features/reset/utils/getTaskForDay';

export function JourneyScreen() {
  useSyncResetDay();
  const router = useRouter();
  const [canvasWidth, setCanvasWidth] = useState(0);
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
      <MainTabHeader title="journey" />
      {resetStartedOn ? (
        <>
          <View style={styles.progress}>
            <DayProgressHeader currentDay={currentDay} completedCount={completedDays.length} />
          </View>
          <View
            style={styles.canvas}
            onLayout={(event) => {
              const nextWidth = event.nativeEvent.layout.width;
              if (nextWidth !== canvasWidth) {
                setCanvasWidth(nextWidth);
              }
            }}
          >
            <JourneySceneDecor />
            <View style={styles.titleBlock}>
              <AppText variant="display">{`day ${currentDay}`}</AppText>
              <AppText variant="optionTitle" color="secondary" numberOfLines={2}>
                {currentTask.title}
              </AppText>
            </View>
            <View style={styles.spacer} />
            {canvasWidth > 0 && chapter ? (
              <JourneyPath
                width={canvasWidth}
                currentDay={currentDay}
                completedDays={completedDays}
                todayCompleted={todayCompleted}
                chapterId={chapter.id}
                onPressDay={onPressDay}
              />
            ) : null}
            {chapter ? <JourneyQuoteCard quote={getJourneyQuote(chapter.id)} /> : null}
            <JourneyGroundDecor width={canvasWidth} />
          </View>
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  canvas: {
    flex: 1,
  },
  titleBlock: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.xxs,
    maxWidth: 280,
  },
  spacer: {
    flex: 1,
  },
});
