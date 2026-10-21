import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getTabBarScenePadding, MascotIcon, Screen } from '@/components/ui';
import { colors, fontWeights, radius, spacing, textVariants } from '@/design-system';
import { JourneyDayCelebration } from '@/features/journey/components/JourneyDayCelebration';
import { JourneyGarden } from '@/features/journey/components/JourneyGarden';
import { JourneyGardenSheet } from '@/features/journey/components/JourneyGardenSheet';
import {
  getJourneyChapterDays,
  getJourneyChapterForDay,
} from '@/features/journey/data/journeyChapters';
import { useJourneyProgression } from '@/features/journey/hooks/useJourneyProgression';
import { getJourneyDayState } from '@/features/journey/utils/getJourneyDayState';
import { StageBackdrop } from '@/features/onboarding/stage/StageBackdrop';
import { useJourneyVisualStore } from '@/features/journey/store/useJourneyVisualStore';
import type { JourneySeason } from '@/features/journey/utils/getJourneySeason';
import { getJourneyVisualTargetDay } from '@/features/journey/utils/getJourneyProgression';
import { getJourneySheetModel } from '@/features/journey/utils/getJourneySheetModel';
import { ReminderPromptDialog } from '@/features/notifications/components/ReminderPromptDialog';
import { useReminderPrompt } from '@/features/notifications/hooks/useReminderPrompt';
import { DAILY_LIST_CHECK_IN_COUNT } from '@/domain/reset/dailyList/buildDailyList';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { getSingleChoiceId } from '@/features/onboarding/utils/answerReaders';
import { getResetProfile } from '@/features/reset/data/resetProfiles';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { requestReviewAfterCheckIn } from '@/features/review/requestReviewAfterCheckIn';
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
      <MascotIcon name="map" size={24} />
    </Pressable>
  );
}

/** Matches the day pop-up's slide-away before the celebration starts. */
const SHEET_CLOSE_MS = 300;
/** Pause after the last step's tick so it registers before the pop-up leaves. */
const LAST_TICK_PAUSE_MS = 700;
/** Lets him settle into his nap before the reminder or rating prompt appears. */
const REVIEW_PROMPT_DELAY_MS = 1200;

/** Streak pill: only shown once there's a streak to show. */
function JourneyStreakPill({ streak }: { streak: number }) {
  if (streak <= 0) {
    return <View style={styles.topSpacer} />;
  }
  return (
    <View style={styles.streakPill} accessible accessibilityLabel={`${streak} day streak`}>
      <MascotIcon name="star" size={14} />
      <Text style={styles.streakText} maxFontSizeMultiplier={1.3}>
        {`${streak} day streak`}
      </Text>
    </View>
  );
}

export function JourneyScreen() {
  useSyncResetDay();
  const insets = useSafeAreaInsets();
  const reminderPrompt = useReminderPrompt();
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

  const currentDay = useResetStore((state) => state.currentDay);
  const completedDays = useResetStore((state) => state.completedDays);
  const todayCompleted = useResetStore((state) => state.todayCompleted);
  const todayStarted = useResetStore((state) => state.todayStarted);
  const storedPersonalization = useResetStore((state) => state.personalization);
  const answers = useOnboardingStore((state) => state.answers);
  // Resets started before the daily list didn't save these two answers; read them from onboarding.
  const personalization = useMemo(
    () => ({
      ...storedPersonalization,
      recentFeeling:
        storedPersonalization.recentFeeling ?? getSingleChoiceId(answers, 'recentFeeling'),
      supportTiming:
        storedPersonalization.supportTiming ?? getSingleChoiceId(answers, 'supportTiming'),
    }),
    [answers, storedPersonalization],
  );
  const resetTypeId = useResetStore((state) => state.resetTypeId);
  const resetStartedOn = useResetStore((state) => state.resetStartedOn);
  const startToday = useResetStore((state) => state.startToday);
  const completeToday = useResetStore((state) => state.completeToday);
  const streak = useResetStore((state) => state.streak);

  const rememberLine = getResetProfile(resetTypeId).homeSupportLine;
  const currentTask = getCurrentResetTask({ currentDay, personalization, resetTypeId });
  // Still runs so Journey keeps acknowledging each new day as before.
  useJourneyProgression({
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

  const onStepChecked = useCallback(
    (checkedCount: number) => {
      if (todayCompleted) {
        return;
      }
      // Ticking the first step counts as starting today.
      if (!todayStarted) {
        startToday();
      }
      // Any three of the day's list check it in.
      if (checkedCount === DAILY_LIST_CHECK_IN_COUNT) {
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
  // The heading moves on to tomorrow once today is done; the garden mood follows the real day.
  const mood = todayCompleted ? 'done' : todayStarted ? 'started' : 'ready';
  const chapter = getJourneyChapterForDay(headingDay);
  const weekDays = chapter
    ? getJourneyChapterDays(chapter).map((day) => ({
        day,
        // Checked-in days turn cocoa straight away; the gold ring follows the heading day.
        kind: completedDays.includes(day)
          ? ('completed' as const)
          : day === headingDay
            ? ('current' as const)
            : getJourneyDayState(day, currentDay, completedDays, todayCompleted).kind,
      }))
    : [];
  const headingTask =
    headingDay === currentDay
      ? currentTask
      : getCurrentResetTask({ currentDay: headingDay, personalization, resetTypeId });

  return (
    <Screen
      includeTopSafeArea={false}
      includeBottomSafeArea={false}
      padded={false}
      backgroundColor={colors.stage.floor}
    >
      <StageBackdrop />
      <View
        style={[
          styles.page,
          {
            paddingTop: insets.top + spacing.xs,
            paddingBottom: getTabBarScenePadding(insets.bottom) + spacing.sm,
          },
        ]}
      >
        <View style={styles.topBar}>
          <Pressable onLongPress={__DEV__ ? resetTodayForTesting : undefined} accessible={false}>
            <JourneyStreakPill streak={streak} />
          </Pressable>
          <JourneyStatsButton />
        </View>
        {resetStartedOn ? (
          <JourneyGarden
            day={headingDay}
            eyebrow={`first season · ${chapter?.subtitle ?? 'week 1'}`}
            taskTitle={headingTask.title}
            mood={mood}
            sproutCount={completedDays.length}
            weekDays={weekDays}
            // He hops into the pop-up while it's open, and steps aside for the celebration.
            mascotHidden={celebration === 'playing' || sheetModel !== null}
            onOpenDay={setSelectedDay}
          />
        ) : null}
      </View>
      {resetStartedOn ? (
        <JourneyGardenSheet
          visible={sheetModel !== null}
          model={sheetModel}
          onClose={closeSheet}
          onStepChecked={onStepChecked}
        />
      ) : null}
      <JourneyDayCelebration
        active={celebration === 'playing'}
        day={currentDay}
        onDone={() => {
          setCelebration('none');
          // After a check-in, ask once about reminders, or (from day 3) for a rating.
          // Never both at once; a skipped rating is asked after a later check-in.
          setTimeout(() => {
            if (!reminderPrompt.showAfterCheckIn()) {
              void requestReviewAfterCheckIn(completedDays.length);
            }
          }, REVIEW_PROMPT_DELAY_MS);
        }}
      />
      <ReminderPromptDialog
        visible={reminderPrompt.visible}
        timeLabel={reminderPrompt.timeLabel}
        onAnswer={reminderPrompt.answer}
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
  page: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  topSpacer: {
    width: spacing.hitTarget,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs + 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.stage.chip,
    shadowColor: colors.stage.chipShadow,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  streakText: {
    ...textVariants.stageEyebrow,
    letterSpacing: 0.2,
    textTransform: 'none',
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
  },
  mapButton: {
    minWidth: spacing.hitTarget,
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
