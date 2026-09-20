import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { MainTabHeader, Screen } from '@/components/ui';
import { spacing } from '@/design-system';
import { DayProgressHeader } from '@/features/home/components/DayProgressHeader';
import { JourneyChapter } from '@/features/journey/components/JourneyChapter';
import { JourneyDaySheet } from '@/features/journey/components/JourneyDaySheet';
import {
  getJourneyChapterIndexForDay,
  JOURNEY_CHAPTERS,
  type JourneyChapterDefinition,
} from '@/features/journey/data/journeyChapters';
import { getJourneySheetModel } from '@/features/journey/utils/getJourneySheetModel';
import { PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';
import { getResetProfile } from '@/features/reset/data/resetProfiles';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { getTaskForDay } from '@/features/reset/utils/getTaskForDay';
import type { TodayTask } from '@/features/reset/types';

export function JourneyScreen() {
  useSyncResetDay();
  const router = useRouter();
  const listRef = useRef<FlatList<JourneyChapterDefinition>>(null);
  const didHonorInitialChapter = useRef(false);
  const [chapterSize, setChapterSize] = useState({ width: 0, height: 0 });
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
  const initialChapterIndex = getJourneyChapterIndexForDay(currentDay);

  const tasksByDay = useMemo(() => {
    const map = new Map<number, TodayTask>();
    for (let day = 1; day <= PLAN_DAY_COUNT; day += 1) {
      map.set(day, getTaskForDay(day, personalization));
    }
    return map;
  }, [personalization]);

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

  useEffect(() => {
    if (chapterSize.height <= 0 || didHonorInitialChapter.current) {
      return;
    }
    listRef.current?.scrollToOffset({
      offset: initialChapterIndex * chapterSize.height,
      animated: false,
    });
    didHonorInitialChapter.current = true;
  }, [chapterSize.height, initialChapterIndex]);

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
            style={styles.listWrap}
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              if (width !== chapterSize.width || height !== chapterSize.height) {
                setChapterSize({ width, height });
              }
            }}
          >
            {chapterSize.height > 0 ? (
              <FlatList
                ref={listRef}
                data={[...JOURNEY_CHAPTERS]}
                keyExtractor={(chapter) => chapter.id}
                renderItem={({ item }) => (
                  <JourneyChapter
                    chapter={item}
                    width={chapterSize.width}
                    height={chapterSize.height}
                    currentDay={currentDay}
                    completedDays={completedDays}
                    todayCompleted={todayCompleted}
                    tasksByDay={tasksByDay}
                    onPressDay={onPressDay}
                  />
                )}
                getItemLayout={(_data, index) => ({
                  length: chapterSize.height,
                  offset: chapterSize.height * index,
                  index,
                })}
                showsVerticalScrollIndicator={false}
                snapToInterval={chapterSize.height}
                snapToAlignment="start"
                decelerationRate="fast"
                disableIntervalMomentum
              />
            ) : null}
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
  listWrap: {
    flex: 1,
  },
});
