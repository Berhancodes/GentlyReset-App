import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, getTabBarScenePadding, Screen, TAB_BAR_CONTENT_INSET } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import { DayProgressHeader } from '@/features/home/components/DayProgressHeader';
import { HomeMascot } from '@/features/home/components/HomeMascot';
import { HomeSky } from '@/features/home/components/HomeSky';
import { getHomeMascotDayState } from '@/features/home/utils/getHomeMascotReaction';
import { HOME_STREAK_REMINDER } from '@/features/home/utils/homeCopy';
import { getCompanionPresentation } from '@/features/home/utils/getCompanionPresentation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { getMascotIntroName } from '@/features/onboarding/utils/answerReaders';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import {
  getCompletedDayCount,
  getCurrentPlanDay,
  getResetProgress,
} from '@/features/reset/utils/resetSelectors';

const HOME_COLUMN_MAX_WIDTH = 430;
/** The greeting starts this far below the safe area, a little below the top of the sun. */
const HERO_TOP_GAP = spacing.xxl;

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
  const onboardingAnswers = useOnboardingStore((state) => state.answers);
  const firstName = getMascotIntroName(onboardingAnswers);
  const bubbleContext = {
    firstName,
    dayState: getHomeMascotDayState({ todayStarted, todayCompleted, missedYesterday }),
    streak,
  };

  if (!resetStartedOn) {
    return (
      <Screen
        includeTopSafeArea={false}
        includeBottomSafeArea={false}
        padded={false}
        backgroundColor={colors.background.home}
      >
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
      <HomeSky top={insets.top + spacing.xs} />
      <View style={[styles.hero, { paddingTop: insets.top + HERO_TOP_GAP }]}>
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
      </View>
      <View style={[styles.stage, { paddingBottom: getTabBarScenePadding(insets.bottom) }]}>
        <HomeMascot bubbleContext={bubbleContext} />
      </View>
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
