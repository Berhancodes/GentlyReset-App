import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { MainTabHeader, NoticeDialog, Screen } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import { AboutResetTypeCard } from '@/features/profile/components/AboutResetTypeCard';
import { MyResetCard } from '@/features/profile/components/MyResetCard';
import { ProfileHero } from '@/features/profile/components/ProfileHero';
import { ProfileLinkRows } from '@/features/profile/components/ProfileLinkRows';
import { WorkingTowardCard } from '@/features/profile/components/WorkingTowardCard';
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
  const [notice, setNotice] = useState<Notice | null>(null);
  const currentDay = useResetStore((state) => state.currentDay);
  const completedDays = useResetStore((state) => state.completedDays);
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
  const identityQuote = formatIdentityQuote(identityLabel);
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

  const openSettingsNotice = () => {
    setNotice({
      title: 'settings',
      body: 'this part of Gently Reset is coming later.',
    });
  };

  const openHelpNotice = () => {
    setNotice({
      title: 'help & support',
      body: 'this part of Gently Reset is coming later.',
    });
  };

  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <MainTabHeader
        title="you"
        rightAction={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="settings"
            onPress={openSettingsNotice}
            style={styles.headerGear}
          >
            <Ionicons name="settings-outline" size={22} color={colors.text.secondary} />
          </Pressable>
        }
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHero
          name={profile.name}
          shortSummary={profile.shortSummary}
          resetApproach={resetApproach}
          currentDay={getCurrentPlanDay({ currentDay })}
          progress={getResetProgress({ completedDays })}
        />
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
        <WorkingTowardCard
          goalLabels={goalLabels}
          identityQuote={identityQuote}
          onEdit={openGoalsNotice}
        />
        <AboutResetTypeCard
          strength={profile.strength}
          pattern={profile.pattern || profile.biggestPattern}
          approach={profile.resetApproach}
          onPress={openTypeNotice}
        />
        <ProfileLinkRows
          links={[
            {
              icon: <Ionicons name="settings-outline" size={22} color={colors.text.primary} />,
              title: 'settings',
              onPress: openSettingsNotice,
            },
            {
              icon: <Ionicons name="help-circle-outline" size={22} color={colors.text.primary} />,
              title: 'help & support',
              onPress: openHelpNotice,
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

function formatIdentityQuote(label: string | undefined): string | undefined {
  if (!label) {
    return undefined;
  }
  if (label.startsWith('someone')) {
    return `I want to become ${label}.`;
  }
  return label;
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
  headerGear: {
    width: spacing.hitTarget,
    height: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
