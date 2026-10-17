import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, getTabBarScenePadding, Screen, TAB_BAR_CONTENT_INSET } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import { DayProgressHeader } from '@/features/home/components/DayProgressHeader';
import { HomeMascot } from '@/features/home/components/HomeMascot';
import { HomeDriftingClouds } from '@/features/home/components/HomeDriftingClouds';
import { HomeSeasonDrift } from '@/features/home/components/HomeSeasonDrift';
import { HomeSky } from '@/features/home/components/HomeSky';
import { HomeStars } from '@/features/home/components/HomeStars';
import { HomeWarmWash } from '@/features/home/components/HomeWarmWash';
import { useJourneyVisualStore } from '@/features/journey/store/useJourneyVisualStore';
import { getJourneySeason } from '@/features/journey/utils/getJourneySeason';
import { getHomeMascotDayState } from '@/features/home/utils/getHomeMascotReaction';
import { HOME_STREAK_REMINDER } from '@/features/home/utils/homeCopy';
import { getCompanionPresentation } from '@/features/home/utils/getCompanionPresentation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { HomeRoomBackdrop, type RoomLook } from '@/features/room/components/HomeRoom';
import { RoomMilestoneCard } from '@/features/room/components/RoomMilestoneCard';
import { SeasonMapSheet } from '@/features/room/components/SeasonMapSheet';
import { SeasonPill } from '@/features/room/components/SeasonPill';
import { ROOM_INTRO } from '@/features/room/data/roomStages';
import { getCelebratedStageIndex, useRoomStore } from '@/features/room/store/useRoomStore';
import {
  fillMascotName,
  getPendingRoomMilestone,
  getRoomState,
  getSeasonLabel,
} from '@/features/room/utils/getRoomState';
import { getMascotIntroName } from '@/features/onboarding/utils/answerReaders';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { AddWidgetSheet } from '@/features/widgets/components/AddWidgetSheet';
import { widgetsAvailable } from '@/features/widgets/native/widgetsAvailability';
import { useWidgetStore } from '@/features/widgets/store/useWidgetStore';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { isSeasonFinished } from '@/features/reset/utils/dailyResetActions';
import { SeasonCompleteCard } from '@/features/season/components/SeasonCompleteCard';
import { getNextSeasonOptions, resolveSeason } from '@/domain/reset/roadmap';
import { hapticCelebration } from '@/utils/haptics';
import {
  getCompletedDayCount,
  getCurrentPlanDay,
  getResetProgress,
} from '@/features/reset/utils/resetSelectors';

const HOME_COLUMN_MAX_WIDTH = 430;
/** The greeting starts this far below the safe area, a little below the top of the sun. */
const HERO_TOP_GAP = spacing.xxl;
/** Walled room, or the room's pieces placed straight on the background. */
const HOME_ROOM_LOOK: RoomLook = 'open';
/** The room's upgrade card puts itself away after this long. */
const MILESTONE_CARD_MS = 6000;

function homeGreetingLines(greeting: string): readonly string[] {
  const commaIndex = greeting.lastIndexOf(', ');
  if (commaIndex < 0) {
    return [capitalizeHeading(greeting)];
  }

  return [
    capitalizeHeading(`${greeting.slice(0, commaIndex)},`),
    capitalizeHeading(greeting.slice(commaIndex + 2)),
  ];
}

export function HomeScreen() {
  useSyncResetDay();
  const insets = useSafeAreaInsets();
  const resetStartedOn = useResetStore((state) => state.resetStartedOn);
  const currentDay = useResetStore((state) => state.currentDay);
  const completedDays = useResetStore((state) => state.completedDays);
  const todayCompleted = useResetStore((state) => state.todayCompleted);
  const todayStarted = useResetStore((state) => state.todayStarted);
  const missedYesterday = useResetStore((state) => state.missedYesterday);
  const streak = useResetStore((state) => state.streak);
  const resetTypeId = useResetStore((state) => state.resetTypeId);
  const personalization = useResetStore((state) => state.personalization);
  const startNextSeason = useResetStore((state) => state.startNextSeason);
  const devSeason = useJourneyVisualStore((state) => state.devSeason);
  const season = devSeason ?? getJourneySeason(new Date());
  const onboardingAnswers = useOnboardingStore((state) => state.answers);
  const firstName = getMascotIntroName(onboardingAnswers);
  const bubbleContext = {
    firstName,
    dayState: getHomeMascotDayState({ todayStarted, todayCompleted, missedYesterday }),
    streak,
  };

  const room = getRoomState(getCompletedDayCount({ completedDays }));
  const introSeen = useRoomStore((state) => state.introSeen);
  const finishIntro = useRoomStore((state) => state.finishIntro);
  const celebratedStageIndex = useRoomStore((state) =>
    getCelebratedStageIndex(state, resetStartedOn ?? ''),
  );
  const markCelebrated = useRoomStore((state) => state.markCelebrated);
  const widgetPromptSeen = useWidgetStore((state) => state.promptSeen);
  const markWidgetPromptSeen = useWidgetStore((state) => state.markPromptSeen);
  const [seasonMapOpen, setSeasonMapOpen] = useState(false);
  /** The upgrade card sits just under the greeting block, over the top of the room. */
  const [heroBottom, setHeroBottom] = useState(0);
  /** The space under the greeting; the room never grows past its top. */
  const [stageHeight, setStageHeight] = useState(0);
  const stagePaddingBottom = getTabBarScenePadding(insets.bottom);
  const pendingStage = resetStartedOn ? getPendingRoomMilestone(room, celebratedStageIndex) : null;
  // When the room reaches a new stage, its card shows (and the mascot says so) until dismissed.
  const milestone =
    pendingStage?.milestone && resetStartedOn
      ? { key: `${resetStartedOn}-${pendingStage.id}`, milestone: pendingStage.milestone }
      : null;
  const stageIndex = room.stageIndex;
  const dismissMilestone = () => {
    if (resetStartedOn) {
      markCelebrated(stageIndex, resetStartedOn);
    }
  };

  const milestoneKey = milestone?.key ?? null;
  useEffect(() => {
    if (!milestoneKey || !resetStartedOn) {
      return;
    }
    const timer = setTimeout(() => markCelebrated(stageIndex, resetStartedOn), MILESTONE_CARD_MS);
    return () => clearTimeout(timer);
  }, [markCelebrated, milestoneKey, resetStartedOn, stageIndex]);

  const seasonNumber = resolveSeason(personalization, resetTypeId).number;
  const seasonChoices =
    resetStartedOn && isSeasonFinished({ completedDays }) && !milestone
      ? getNextSeasonOptions(personalization, resetTypeId)
      : null;

  const roomIntro = introSeen
    ? undefined
    : ROOM_INTRO.map((beat) => ({ ...beat, line: fillMascotName(beat.line, firstName) }));

  if (!resetStartedOn) {
    return (
      <Screen
        includeTopSafeArea={false}
        includeBottomSafeArea={false}
        padded={false}
        backgroundColor={colors.background.home}
      >
        <HomeStars />
        <HomeDriftingClouds />
        <HomeSeasonDrift season={season} />
        <HomeSky top={insets.top + spacing.xs} />
        <View style={[styles.hero, { paddingTop: insets.top + HERO_TOP_GAP }]}>
          <View style={styles.greetingLines}>
            {homeGreetingLines(firstName ? `welcome, ${firstName}` : 'welcome').map((line) => (
              <AppText key={line} variant="homeGreeting" color="home">
                {line}
              </AppText>
            ))}
          </View>
        </View>
        <View style={[styles.stage, { paddingBottom: getTabBarScenePadding(insets.bottom) }]}>
          <HomeMascot bubbleContext={bubbleContext} />
        </View>
      </Screen>
    );
  }

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
    firstName,
  });

  return (
    <Screen
      includeTopSafeArea={false}
      includeBottomSafeArea={false}
      padded={false}
      backgroundColor={colors.background.home}
    >
      <HomeWarmWash warm={todayCompleted} />
      <HomeStars />
      <HomeDriftingClouds />
      <HomeSeasonDrift season={season} />
      <HomeSky top={insets.top + spacing.xs} glowing={todayCompleted} />
      <View
        style={[styles.hero, { paddingTop: insets.top + HERO_TOP_GAP }]}
        onLayout={(event) =>
          setHeroBottom(event.nativeEvent.layout.y + event.nativeEvent.layout.height)
        }
      >
        <View style={styles.greetingLines}>
          {homeGreetingLines(companion.greeting).map((line) => (
            <AppText key={line} variant="homeGreeting" color="home">
              {line}
            </AppText>
          ))}
        </View>
        <DayProgressHeader
          currentDay={planDay}
          completedCount={completedCount}
          progress={progress}
          showCount={false}
          layout="hero"
        />
        <AppText variant="homeStatus" color="homeMuted">
          {HOME_STREAK_REMINDER}
        </AppText>
        <SeasonPill
          label={getSeasonLabel(room, seasonNumber)}
          onPress={() => setSeasonMapOpen(true)}
        />
      </View>
      <View
        style={[styles.stage, { paddingBottom: stagePaddingBottom }]}
        onLayout={(event) => setStageHeight(event.nativeEvent.layout.height)}
      >
        <HomeMascot
          bubbleContext={bubbleContext}
          script={roomIntro}
          onScriptDone={finishIntro}
          announcement={
            milestone
              ? {
                  key: milestone.key,
                  reaction: milestone.milestone.reaction,
                  line: milestone.milestone.line,
                }
              : undefined
          }
          backdrop={(layout) => (
            <HomeRoomBackdrop
              layout={layout}
              look={HOME_ROOM_LOOK}
              maxRise={
                stageHeight > 0
                  ? (stageHeight - stagePaddingBottom - layout.frameHeight) / 2 +
                    layout.feetY -
                    spacing.xs
                  : undefined
              }
              stageIndex={room.stageIndex}
              itemCount={room.itemCount}
              newestItem={todayCompleted ? room.newestItem : null}
              seasonIndex={seasonNumber - 1}
            />
          )}
        />
      </View>
      {milestone ? (
        <RoomMilestoneCard
          milestone={milestone.milestone}
          top={heroBottom + spacing.xs}
          onDismiss={dismissMilestone}
        />
      ) : null}
      {seasonChoices ? (
        <SeasonCompleteCard
          seasonNumber={seasonNumber}
          deeper={seasonChoices.deeper}
          next={seasonChoices.next}
          top={heroBottom + spacing.xs}
          onChoose={(focusAreaId) => {
            hapticCelebration();
            startNextSeason(focusAreaId);
          }}
        />
      ) : null}
      <AddWidgetSheet
        visible={
          widgetsAvailable &&
          !widgetPromptSeen &&
          introSeen &&
          !milestone &&
          !seasonChoices &&
          !seasonMapOpen &&
          room.checkIns >= 1
        }
        day={planDay}
        onClose={markWidgetPromptSeen}
      />
      <SeasonMapSheet
        visible={seasonMapOpen}
        room={room}
        seasonNumber={seasonNumber}
        onClose={() => setSeasonMapOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    maxWidth: HOME_COLUMN_MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: TAB_BAR_CONTENT_INSET,
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  greetingLines: {
    alignItems: 'flex-start',
  },
  stage: {
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
