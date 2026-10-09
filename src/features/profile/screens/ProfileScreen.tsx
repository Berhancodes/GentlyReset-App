import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';

import { MainTabHeader, NoticeDialog, Screen } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import { useAuth } from '@/features/auth/session/useAuth';
import { fetchOwnSocialProfile } from '@/features/friends/api/friendsApi';
import { formatUsernameHandle } from '@/features/friends/username';
import { MyResetCard } from '@/features/profile/components/MyResetCard';
import { ProfileHero } from '@/features/profile/components/ProfileHero';
import { ProfileLinkRows } from '@/features/profile/components/ProfileLinkRows';
import { ProgressLinkCard } from '@/features/profile/components/ProgressLinkCard';
import { YourResetCard } from '@/features/profile/components/YourResetCard';
import { getResetProfile } from '@/features/reset/data/resetProfiles';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { getOnboardingOptionLabel } from '@/features/onboarding/utils/getOnboardingOptionLabel';
import { getMultiChoiceIds, getSingleChoiceId } from '@/features/onboarding/utils/answerReaders';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { minutesFromCommitment } from '@/features/reset/utils/getTaskForDay';
import { getCurrentPlanDay, getResetProgress } from '@/features/reset/utils/resetSelectors';

const PROFILE_COLUMN_MAX_WIDTH = 430;
const EMPTY_VALUE = 'not set yet';

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
  const currentDay = useResetStore((state) => state.currentDay);
  const completedDays = useResetStore((state) => state.completedDays);
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
  const goalLabels = personalization.desiredFeelings
    .map((id) => getOnboardingOptionLabel('desiredFeelings', id))
    .filter((label): label is string => Boolean(label));
  const resetApproach =
    profile.resetApproach.trim().length > 0 ? profile.resetApproach : profile.whatUsuallyHelps;

  const openTypeNotice = () => {
    setNotice({
      title: profile.name,
      body: `${profile.summary}\n\n${profile.description}\n\n${profile.emphasized}`,
    });
  };

  const openGoalsNotice = () => {
    setNotice({
      title: 'goals',
      body: goalLabels.length > 0 ? goalLabels.join('\n') : 'no goals were saved from onboarding.',
    });
  };

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
      title: 'help & support',
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
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <MainTabHeader title="you" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHero
          name={profile.name}
          shortSummary={profile.shortSummary}
          currentDay={getCurrentPlanDay({ currentDay })}
          progress={getResetProgress({ completedDays })}
        />
        <YourResetCard approach={resetApproach} onPress={openTypeNotice} />
        <MyResetCard
          onOpenType={openTypeNotice}
          facts={[
            {
              icon: 'person-outline',
              tint: 'gold',
              label: 'reset type',
              value: profile.name,
              onPress: openTypeNotice,
            },
            {
              icon: 'locate-outline',
              tint: 'peach',
              label: 'main goal',
              value: focus ?? EMPTY_VALUE,
              onPress: openGoalsNotice,
            },
            {
              icon: 'time-outline',
              tint: 'blue',
              label: 'daily commitment',
              value: personalization.dailyCommitment ? `${minutes} minutes a day` : EMPTY_VALUE,
            },
            ...(personalization.resetReason
              ? [
                  {
                    icon: 'heart-outline' as const,
                    tint: 'peach' as const,
                    label: 'reason',
                    value: personalization.resetReason,
                  },
                ]
              : []),
          ]}
        />
        <ProgressLinkCard onPress={() => router.push('/journey-stats')} />
        <ProfileLinkRows
          links={[
            {
              icon: <Ionicons name="at-outline" size={22} color={colors.text.primary} />,
              title: userId && username ? formatUsernameHandle(username) : 'choose username',
              onPress: () => router.push('/choose-username'),
            },
            {
              icon: <Ionicons name="help-circle-outline" size={22} color={colors.text.primary} />,
              title: 'help & support',
              onPress: openHelpNotice,
            },
            {
              icon: <Ionicons name="log-out-outline" size={22} color={colors.text.primary} />,
              title: signingOut ? 'signing out…' : 'sign out',
              onPress: handleSignOut,
            },
          ]}
        />
      </ScrollView>
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
});
