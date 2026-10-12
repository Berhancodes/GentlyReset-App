import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';

import { getTabBarScenePadding, MascotIcon, NoticeDialog, Screen } from '@/components/ui';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  radius,
  spacing,
  textVariants,
} from '@/design-system';
import { useAuth } from '@/features/auth/session/useAuth';
import { fetchOwnSocialProfile } from '@/features/friends/api/friendsApi';
import { formatUsernameHandle } from '@/features/friends/username';
import { getJourneyStats } from '@/features/journey/utils/getJourneyStats';
import { StageBackdrop } from '@/features/onboarding/stage/StageBackdrop';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';
import { shareReset } from '@/features/onboarding/utils/shareReset';
import {
  ProfileAnswersCard,
  ProfileProgressCard,
} from '@/features/profile/components/ProfileSummaryCards';
import { ResetTypeCard } from '@/features/profile/components/ResetTypeCard';
import { openLegalDocument } from '@/features/legal/utils/openLegalDocument';
import { ProfileLinkRows } from '@/features/profile/components/ProfileLinkRows';
import { getResetProfile } from '@/features/reset/data/resetProfiles';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { getOnboardingOptionLabel } from '@/features/onboarding/utils/getOnboardingOptionLabel';
import { getMultiChoiceIds, getSingleChoiceId } from '@/features/onboarding/utils/answerReaders';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { minutesFromCommitment } from '@/features/reset/utils/getTaskForDay';
import { toLocalDateKey } from '@/features/reset/utils/calendar';
import { getCurrentPlanDay } from '@/features/reset/utils/resetSelectors';
import { AddWidgetSheet } from '@/features/widgets/components/AddWidgetSheet';
import { widgetsAvailable } from '@/features/widgets/native/widgetsAvailability';

const PROFILE_COLUMN_MAX_WIDTH = 430;

type Notice = {
  title: string;
  body: string;
};

export function ProfileScreen() {
  useSyncResetDay();
  const router = useRouter();
  const { isAuthenticated, signOut, user } = useAuth();
  const userId = user?.id ?? null;
  const [notice, setNotice] = useState<Notice | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [widgetSheetOpen, setWidgetSheetOpen] = useState(false);
  const currentDay = useResetStore((state) => state.currentDay);
  const completedDays = useResetStore((state) => state.completedDays);
  const completionDates = useResetStore((state) => state.completionDates);
  const lastCompletedOn = useResetStore((state) => state.lastCompletedOn);
  const streak = useResetStore((state) => state.streak);
  const resetStartedOn = useResetStore((state) => state.resetStartedOn);
  const insets = useSafeAreaInsets();
  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);
  const resetTypeId = useResetStore((state) => state.resetTypeId);
  const personalization = useResetStore((state) => state.personalization);
  const answers = useOnboardingStore((state) => state.answers);
  const profile = getResetProfile(resetTypeId);
  const minutes = minutesFromCommitment(personalization.dailyCommitment);
  const identityId = getSingleChoiceId(answers, 'desiredIdentity');
  const outcomeId = getMultiChoiceIds(answers, 'thirtyDayOutcome')[0];
  const identityLabel = identityId
    ? getOnboardingOptionLabel('desiredIdentity', identityId)
    : undefined;
  const focus =
    identityLabel ??
    (outcomeId ? getOnboardingOptionLabel('thirtyDayOutcome', outcomeId) : undefined);
  const stats = getJourneyStats({
    completedDays,
    completionDates,
    lastCompletedOn,
    streak,
    resetStartedOn,
    today: toLocalDateKey(new Date()),
  });
  const answerRows = [
    { label: 'Working toward', value: focus ? capitalizeHeading(focus) : 'Not set yet' },
    {
      label: 'Each day',
      value: personalization.dailyCommitment ? `${minutes} minutes` : 'Not set yet',
    },
    ...(personalization.resetReason
      ? [{ label: 'Why', value: capitalizeHeading(personalization.resetReason) }]
      : []),
  ];
  const resetApproach =
    profile.resetApproach.trim().length > 0 ? profile.resetApproach : profile.whatUsuallyHelps;

  useFocusEffect(
    useCallback(() => {
      if (!userId) {
        return;
      }
      void fetchOwnSocialProfile(userId).then((profile) => {
        setUsername(profile.username);
      });
    }, [userId]),
  );

  const openHelpNotice = () => {
    setNotice({
      title: 'Help & support',
      body: 'this part of Gently Reset is coming later.',
    });
  };

  const returnToFirstOnboarding = () => {
    resetOnboarding();
    router.replace('/(onboarding)/flow');
    setSigningOut(false);
  };

  const handleSignOut = () => {
    if (signingOut) {
      return;
    }
    setSigningOut(true);
    if (!isAuthenticated) {
      returnToFirstOnboarding();
      return;
    }
    void signOut()
      .then((result) => {
        if (!result.ok) {
          setNotice({
            title: 'couldn’t sign out',
            body: result.message,
          });
          setSigningOut(false);
          return;
        }
        returnToFirstOnboarding();
      })
      .catch(() => {
        returnToFirstOnboarding();
      });
  };

  return (
    <Screen
      includeTopSafeArea={false}
      includeBottomSafeArea={false}
      padded={false}
      backgroundColor={colors.stage.floor}
    >
      <StageBackdrop />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.sm,
            paddingBottom: getTabBarScenePadding(insets.bottom) + spacing.lg,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow} accessibilityRole="header" maxFontSizeMultiplier={1.3}>
          you
        </Text>
        <ResetTypeCard
          name={profile.name}
          truth={profile.shortSummary}
          strengths={profile.strengths}
          challenges={profile.challenges}
          approach={resetApproach}
          helps={profile.whatUsuallyHelps}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share my reset"
          onPress={() => void shareReset(profile)}
          style={({ pressed }) => [styles.share, pressed ? styles.sharePressed : null]}
        >
          <Text style={styles.shareLabel} maxFontSizeMultiplier={1.3}>
            Share my reset
          </Text>
        </Pressable>
        <ProfileProgressCard
          day={getCurrentPlanDay({ currentDay })}
          checkIns={stats.checkIns}
          streak={stats.streak}
          onSeeAll={() => router.push('/journey-stats')}
        />
        <ProfileAnswersCard rows={answerRows} />
        <ProfileLinkRows
          links={[
            {
              icon: <MascotIcon name="tag" size={22} />,
              title: userId && username ? formatUsernameHandle(username) : 'Choose a username',
              onPress: () => router.push('/choose-username'),
            },
            ...(widgetsAvailable
              ? [
                  {
                    icon: <MascotIcon name="star" size={22} />,
                    title: 'Add the home screen widget',
                    onPress: () => setWidgetSheetOpen(true),
                  },
                ]
              : []),
            {
              icon: <MascotIcon name="help" size={22} />,
              title: 'Help & support',
              onPress: openHelpNotice,
            },
            {
              icon: <MascotIcon name="book" size={22} />,
              title: 'Terms of service',
              onPress: () => openLegalDocument('terms'),
            },
            {
              icon: <MascotIcon name="person" size={22} />,
              title: 'Privacy policy',
              onPress: () => openLegalDocument('privacy'),
            },
            {
              icon: <MascotIcon name="door" size={22} />,
              title: signingOut ? 'Signing out…' : 'Sign out',
              onPress: handleSignOut,
            },
          ]}
        />
      </ScrollView>
      <AddWidgetSheet
        visible={widgetSheetOpen}
        day={getCurrentPlanDay({ currentDay })}
        onClose={() => setWidgetSheetOpen(false)}
      />
      <NoticeDialog
        visible={notice !== null}
        title={notice?.title ?? ''}
        body={notice?.body ?? ''}
        onClose={() => setNotice(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: PROFILE_COLUMN_MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  eyebrow: {
    ...textVariants.stageEyebrow,
    color: colors.stage.copySoft,
    textAlign: 'center',
    paddingVertical: spacing.xs,
  },
  share: {
    minHeight: spacing.xxl + spacing.xxs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.stage.chipBorder,
    backgroundColor: colors.stage.chip,
  },
  sharePressed: {
    transform: [{ scale: 0.98 }],
  },
  shareLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
  },
});
