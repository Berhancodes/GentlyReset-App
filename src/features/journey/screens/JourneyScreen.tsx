import { useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { MainTabHeader, Screen } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import { JourneyDayCelebration } from '@/features/journey/components/JourneyDayCelebration';
import { JourneyDaySheet } from '@/features/journey/components/JourneyDaySheet';
import { JOURNEY_DAY_STEPS } from '@/features/journey/data/journeyCopy';
import { JourneySeasonScene } from '@/features/journey/components/JourneySeasonScene';
import { JourneyLinearStage } from '@/features/journey/components/JourneyLinearStage';
import { useJourneyProgression } from '@/features/journey/hooks/useJourneyProgression';
import { useJourneyVisualStore } from '@/features/journey/store/useJourneyVisualStore';
import { getJourneySeason, type JourneySeason } from '@/features/journey/utils/getJourneySeason';
import { getJourneyVisualTargetDay } from '@/features/journey/utils/getJourneyProgression';
import { getJourneySheetModel } from '@/features/journey/utils/getJourneySheetModel';
import { getResetProfile } from '@/features/reset/data/resetProfiles';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { toLocalDateKey } from '@/features/reset/utils/calendar';
import { getCurrentResetTask } from '@/features/reset/utils/resetSelectors';

function JourneyStatsButton() {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Your stats"
      accessibilityHint="Shows your streak, consistency and check-in history"
      onPress={() => router.push('/journey-stats')}
      style={styles.mapButton}
    >
      <Ionicons name="map-outline" size={24} color={colors.text.primary} />
    </Pressable>
  );
}

/** Matches the day pop-up's slide-away before the celebration starts. */
const SHEET_CLOSE_MS = 300;
/** Pause after the last step's tick so it registers before the pop-up leaves. */
const LAST_TICK_PAUSE_MS = 700;

export function JourneyScreen() {
  useSyncResetDay();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  // 'pending' covers the pop-up sliding away; the heading holds the old day until 'none'.
  const [celebration, setCelebration] = useState<'none' | 'pending' | 'playing'>('none');
  const devCelebrationKey = useJourneyVisualStore((state) => state.devCelebrationKey);
  const [seenCelebrationKey, setSeenCelebrationKey] = useState(devCelebrationKey);
  if (devCelebrationKey !== seenCelebrationKey) {
    setSeenCelebrationKey(devCelebrationKey);
    setCelebration('playing');
  }
  const [journeyFocused, setJourneyFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setJourneyFocused(true);
      return () => {
        setJourneyFocused(false);
      };
    }, []),
  );

  const devSeason = useJourneyVisualStore((state) => state.devSeason);
  const season = devSeason ?? getJourneySeason(new Date());
  const currentDay = useResetStore((state) => state.currentDay);
  const completedDays = useResetStore((state) => state.completedDays);
  const todayCompleted = useResetStore((state) => state.todayCompleted);
  const todayStarted = useResetStore((state) => state.todayStarted);
  const personalization = useResetStore((state) => state.personalization);
  const resetTypeId = useResetStore((state) => state.resetTypeId);
  const resetStartedOn = useResetStore((state) => state.resetStartedOn);
  const startToday = useResetStore((state) => state.startToday);
  const completeToday = useResetStore((state) => state.completeToday);

  const rememberLine = getResetProfile(resetTypeId).homeSupportLine;
  const currentTask = getCurrentResetTask({ currentDay, personalization, resetTypeId });
  const progression = useJourneyProgression({
    currentDay,
    completedDays,
    todayCompleted,
    currentTitle: currentTask.title,
    focused: journeyFocused,
    resetTypeId,
  });
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
          resetTypeId,
        });

  const onPressDay = useCallback((day: number) => {
    setSelectedDay(day);
  }, []);

  const closeSheet = useCallback(() => {
    setSelectedDay(null);
  }, []);

  /** Completes today, slides the pop-up away, then plays the celebration. */
  const finishDay = useCallback(() => {
    completeToday();
    setSelectedDay(null);
    setCelebration('pending');
    setTimeout(() => setCelebration('playing'), SHEET_CLOSE_MS);
  }, [completeToday]);

  const onPrimary = useCallback(() => {
    if (!sheetModel) {
      return;
    }
    if (sheetModel.cta === 'start') {
      startToday();
      return;
    }
    if (sheetModel.cta === 'complete') {
      finishDay();
    }
  }, [finishDay, sheetModel, startToday]);

  const onStepChecked = useCallback(
    (checkedCount: number) => {
      if (todayCompleted) {
        return;
      }
      // Ticking the first step counts as starting today.
      if (!todayStarted) {
        startToday();
      }
      if (checkedCount === JOURNEY_DAY_STEPS.length) {
        // Let the last tick and its confetti land before the pop-up slides away.
        setTimeout(finishDay, LAST_TICK_PAUSE_MS);
      }
    },
    [finishDay, startToday, todayCompleted, todayStarted],
  );

  // Finishing today moves Journey on to the next day's number (the plan day itself
  // still changes at midnight); it waits until the celebration is over.
  const headingDay =
    celebration === 'none' ? getJourneyVisualTargetDay({ currentDay, todayCompleted }) : currentDay;

  return (
    <Screen
      includeTopSafeArea={false}
      includeBottomSafeArea={false}
      padded={false}
      backgroundColor={colors.background.journey}
    >
      <JourneySeasonScene
        season={season}
        active={journeyFocused}
        mascotHidden={celebration === 'playing'}
        onPressMascot={() => setSelectedDay(currentDay)}
        onLongPressMascot={__DEV__ ? resetTodayForTesting : undefined}
      />
      <MainTabHeader
        title="journey"
        contentSpacing="roomy"
        transparent
        rightAction={<JourneyStatsButton />}
      />
      {resetStartedOn ? (
        <>
          <JourneyLinearStage
            presentation={progression}
            focused={journeyFocused}
            onPressDay={onPressDay}
            hidden={sheetModel !== null}
            day={headingDay}
          />
          <JourneyDaySheet
            visible={sheetModel !== null}
            season={season}
            model={sheetModel}
            onClose={closeSheet}
            onPrimary={onPrimary}
            onStepChecked={onStepChecked}
          />
        </>
      ) : null}
      <JourneyDayCelebration
        active={celebration === 'playing'}
        onDone={() => setCelebration('none')}
      />
    </Screen>
  );
}

/**
 * Development only: puts today back to "not started" so the step checklist and
 * the day-complete celebration can be tried again. Undoes today's completion,
 * its date, its streak bump and today's ticked steps. Never shipped.
 */
function resetTodayForTesting() {
  const state = useResetStore.getState();
  const today = toLocalDateKey(new Date());
  const day = state.currentDay;
  const completionDates = { ...state.completionDates };
  delete completionDates[day];
  const finishedToday = state.lastCompletedOn === today;
  const earlierDates = Object.values(completionDates)
    .filter((date): date is string => Boolean(date) && date !== today)
    .sort();
  useResetStore.setState({
    todayStarted: false,
    todayCompleted: false,
    completedDays: state.completedDays.filter((completedDay) => completedDay !== day),
    completionDates,
    lastCompletedOn: finishedToday
      ? (earlierDates[earlierDates.length - 1] ?? null)
      : state.lastCompletedOn,
    streak: finishedToday ? Math.max(0, state.streak - 1) : state.streak,
  });
  useJourneyVisualStore.setState({ stepChecks: null, acknowledgedDay: day });
  console.log(`Journey test: day ${day} is not started again.`);
}

if (__DEV__) {
  Object.assign(globalThis, {
    resetTodayForTesting,
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
    previewDayComplete() {
      useJourneyVisualStore.getState().previewDayComplete();
      console.log('Journey preview: day-complete celebration.');
    },
    previewJourneySeason(season: JourneySeason | null) {
      useJourneyVisualStore.getState().setDevSeason(season);
      console.log(season ? `Journey preview: ${season}.` : 'Journey season follows the date.');
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
  mapButton: {
    minWidth: spacing.hitTarget,
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
