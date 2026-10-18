import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
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
import { clearDeviceData } from '@/features/account/clearDeviceData';
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
import { LEGAL_DETAILS } from '@/features/legal/data/legalDetails';
import { openLegalDocument } from '@/features/legal/utils/openLegalDocument';
import { hasSupportEmail, openSupportEmail } from '@/features/legal/utils/openSupport';
import { NotificationSettingsCard } from '@/features/notifications/components/NotificationSettingsCard';
import { releasePushToken } from '@/features/notifications/sync/releasePushToken';
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
import { useSubscription } from '@/features/subscription/session/useSubscription';
import { openManageSubscriptions } from '@/features/subscription/utils/openManageSubscriptions';
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
  const { isAuthenticated, signOut, deleteAccount, user } = useAuth();
  const userId = user?.id ?? null;
  const [notice, setNotice] = useState<Notice | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { restorePurchases } = useSubscription();
  const [widgetSheetOpen, setWidgetSheetOpen] = useState(false);
  const currentDay = useResetStore((state) => state.currentDay);
  const completedDays = useResetStore((state) => state.completedDays);
  const completionDates = useResetStore((state) => state.completionDates);
  const lastCompletedOn = useResetStore((state) => state.lastCompletedOn);
  const streak = useResetStore((state) => state.streak);
  const resetStartedOn = useResetStore((state) => state.resetStartedOn);
  const insets = useSafeAreaInsets();
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

  const openHelp = () => {
    void openSupportEmail().then((opened) => {
      if (opened) {
        return;
      }
      setNotice({
        title: 'Help & support',
        body: hasSupportEmail()
          ? `email us at ${LEGAL_DETAILS.contactEmail} and we’ll get back to you.`
          : 'support isn’t set up yet. please try again later.',
      });
    });
  };

  const restore = () => {
    if (restoring) {
      return;
    }
    setRestoring(true);
    void restorePurchases()
      .then((result) => {
        if (!result.ok) {
          setNotice({ title: 'couldn’t restore', body: result.message });
          return;
        }
        setNotice(
          result.unlocked
            ? { title: 'all set', body: 'your Gently Reset Pro is active on this device.' }
            : {
                title: 'nothing to restore',
                body: 'there’s no Gently Reset Pro purchase on this Apple ID.',
              },
        );
      })
      .finally(() => setRestoring(false));
  };

  const manageSubscription = () => {
    void openManageSubscriptions().then((opened) => {
      if (!opened) {
        setNotice({
          title: 'Manage subscription',
          body: 'open Settings, tap your name, then Subscriptions.',
        });
      }
    });
  };

  const returnToFirstOnboarding = () => {
    clearDeviceData();
    router.replace('/(onboarding)/flow');
    setSigningOut(false);
  };

  /** Apple requires deleting the account in the app. Two clear asks, since it can't be undone. */
  const confirmDeleteAccount = () => {
    if (deleting) {
      return;
    }
    Alert.alert(
      'Delete your account?',
      'This permanently deletes your account, progress, journal and friends. It can’t be undone.\n\nDeleting your account doesn’t cancel your subscription. To stop being charged, cancel it in Settings › your name › Subscriptions.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete account', style: 'destructive', onPress: handleDeleteAccount },
      ],
    );
  };

  const handleDeleteAccount = () => {
    setDeleting(true);
    void deleteAccount()
      .then((result) => {
        if (!result.ok) {
          setNotice({ title: 'couldn’t delete your account', body: result.message });
          return;
        }
        clearDeviceData();
        router.replace('/(onboarding)/flow');
      })
      .finally(() => setDeleting(false));
  };

  /** Only shown with an account; asks first, since signing out clears this device. */
  const confirmSignOut = () => {
    if (signingOut) {
      return;
    }
    Alert.alert(
      'Sign out?',
      'This clears Gently Reset from this device and takes you back to the start.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign out', style: 'destructive', onPress: handleSignOut },
      ],
    );
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
    void releasePushToken()
      .then(() => signOut())
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
        <NotificationSettingsCard signedIn={isAuthenticated} />
        <ProfileLinkRows
          links={[
            ...(isAuthenticated
              ? []
              : [
                  {
                    icon: <MascotIcon name="personAdd" size={22} />,
                    title: 'Save your progress (not backed up yet)',
                    onPress: () => router.push('/save-progress'),
                  },
                ]),
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
              icon: <MascotIcon name="heart" size={22} />,
              title: 'Manage subscription',
              onPress: manageSubscription,
            },
            {
              icon: <MascotIcon name="checkCircle" size={22} />,
              title: restoring ? 'Restoring…' : 'Restore purchases',
              onPress: restore,
            },
            {
              icon: <MascotIcon name="help" size={22} />,
              title: 'Help & support',
              onPress: openHelp,
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
            ...(isAuthenticated
              ? [
                  {
                    icon: <MascotIcon name="door" size={22} />,
                    title: signingOut ? 'Signing out…' : 'Sign out',
                    onPress: confirmSignOut,
                  },
                  {
                    icon: <MascotIcon name="leaf" size={22} />,
                    title: deleting ? 'Deleting account…' : 'Delete account',
                    onPress: confirmDeleteAccount,
                  },
                ]
              : []),
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
