import { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText, IconRow, MainTabHeader, NoticeDialog, Screen } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import { getResetProfile } from '@/features/onboarding/data/mockResetProfile';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { getOnboardingOptionLabel } from '@/features/onboarding/utils/getOnboardingOptionLabel';
import { getMultiChoiceIds, getSingleChoiceId } from '@/features/onboarding/utils/answerReaders';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { minutesFromCommitment } from '@/features/reset/utils/getTaskForDay';

const PROFILE_MASCOT = require('../../../../assets/images/app/profile-mascot.png');

type Notice = {
  title: string;
  body: string;
};

export function ProfileScreen() {
  useSyncResetDay();
  const [notice, setNotice] = useState<Notice | null>(null);
  const currentDay = useResetStore((state) => state.currentDay);
  const resetTypeId = useResetStore((state) => state.resetTypeId);
  const personalization = useResetStore((state) => state.personalization);
  const answers = useOnboardingStore((state) => state.answers);
  const profile = getResetProfile(resetTypeId);
  const minutes = minutesFromCommitment(personalization.dailyCommitment);
  const identityId = getSingleChoiceId(answers, 'desiredIdentity');
  const outcomeId = getMultiChoiceIds(answers, 'thirtyDayOutcome')[0];
  const focus =
    (identityId ? getOnboardingOptionLabel('desiredIdentity', identityId) : undefined) ??
    (outcomeId ? getOnboardingOptionLabel('thirtyDayOutcome', outcomeId) : undefined);
  const goalLabels = personalization.desiredFeelings
    .map((id) => getOnboardingOptionLabel('desiredFeelings', id))
    .filter((label): label is string => Boolean(label));

  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <MainTabHeader title="you" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Image
              source={PROFILE_MASCOT}
              accessibilityLabel={`${profile.name} artwork`}
              accessibilityIgnoresInvertColors
              resizeMode="cover"
              style={styles.avatarImage}
            />
          </View>
          <AppText variant="title" align="center">
            {profile.name}
          </AppText>
          <AppText variant="caption" color="helper" align="center">
            Day {currentDay} of your reset
          </AppText>
          <AppText variant="body" color="secondary" align="center">
            {profile.summary}
          </AppText>
        </View>

        <View style={styles.facts}>
          {focus ? <Fact label="Focus" value={focus} /> : null}
          {personalization.resetReason ? (
            <Fact label="Reason" value={personalization.resetReason} />
          ) : null}
          {personalization.dailyCommitment ? (
            <Fact label="Pace" value={`${minutes} minutes a day`} />
          ) : null}
          {goalLabels.length > 0 ? <Fact label="Goals" value={goalLabels.join(' · ')} /> : null}
        </View>

        <View style={styles.rows}>
          <IconRow
            icon={<Ionicons name="people-outline" size={22} color={colors.text.primary} />}
            title="my reset type"
            showChevron
            onPress={() => {
              setNotice({
                title: profile.name,
                body: `${profile.summary}\n\n${profile.description}\n\n${profile.emphasized}`,
              });
            }}
          />
          <IconRow
            icon={<Ionicons name="heart-outline" size={22} color={colors.text.primary} />}
            title="goals"
            showChevron
            onPress={() => {
              setNotice({
                title: 'goals',
                body:
                  goalLabels.length > 0
                    ? goalLabels.join('\n')
                    : 'no goals were saved from onboarding.',
              });
            }}
          />
          <IconRow
            icon={<Ionicons name="options-outline" size={22} color={colors.text.primary} />}
            title="settings"
            showChevron
            onPress={() =>
              setNotice({
                title: 'settings',
                body: 'this part of Gently Reset is coming later.',
              })
            }
          />
          <IconRow
            icon={
              <Ionicons name="information-circle-outline" size={22} color={colors.text.primary} />
            }
            title="help & support"
            showChevron
            onPress={() =>
              setNotice({
                title: 'help & support',
                body: 'this part of Gently Reset is coming later.',
              })
            }
          />
        </View>
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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <AppText variant="label" color="helper">
        {label}
      </AppText>
      <AppText variant="body">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.xl,
  },
  identity: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  avatar: {
    width: 148,
    height: 148,
    borderRadius: 74,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    backgroundColor: colors.surface.choice,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  facts: {
    gap: spacing.md,
  },
  fact: {
    gap: spacing.xxs,
  },
  rows: {
    gap: spacing.sm,
  },
});
