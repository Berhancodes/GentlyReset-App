import { StyleSheet, View } from 'react-native';

import { AppText, PrimaryButton } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { NoticedMascot } from '@/features/onboarding/components/NoticedMascot';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { getNoticedCopy } from '@/features/onboarding/data/noticedCopy';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { ResultDetailsStep } from '@/features/onboarding/types/onboarding';
import { getResetProfileForAnswers } from '@/features/reset/data/resetProfiles';

type ResultDetailsScreenProps = {
  step: ResultDetailsStep;
};

export function ResultDetailsScreen({ step }: ResultDetailsScreenProps) {
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const answers = useOnboardingStore((state) => state.answers);
  const profile = getResetProfileForAnswers(answers);
  const copy = getNoticedCopy(profile.id);

  return (
    <OnboardingScreenLayout
      tone="story"
      title={step.title}
      subtitle={copy.insight}
      hideProgress
      skipStorySpacer
      onBack={canGoBack ? goBack : undefined}
      footer={<PrimaryButton label={step.ctaLabel} showArrow onPress={goToNext} />}
    >
      <View style={styles.body}>
        <NoticedMascot />
        <View style={styles.section}>
          <AppText variant="storyEyebrow" color="helper" align="center">
            {"what's already there"}
          </AppText>
          <View style={styles.chips}>
            <View style={styles.chipRow}>
              {profile.strengths.slice(0, 2).map((value) => (
                <View key={value} style={styles.chip}>
                  <AppText variant="caption">{value}</AppText>
                </View>
              ))}
            </View>
            {profile.strengths.length > 2 ? (
              <View style={styles.chipRow}>
                {profile.strengths.slice(2).map((value) => (
                  <View key={value} style={styles.chip}>
                    <AppText variant="caption">{value}</AppText>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.section}>
          <AppText variant="storyEyebrow" color="helper" align="center">
            the pattern
          </AppText>
          <View style={styles.pattern}>
            {copy.pattern.map((paragraph) => (
              <AppText key={paragraph} variant="body" align="center">
                {paragraph}
              </AppText>
            ))}
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.closer} accessibilityRole="text">
          <AppText variant="title" align="center">
            {copy.closerLead}
          </AppText>
          <AppText variant="title" align="center">
            {copy.closerEmphasis}
          </AppText>
          <AppText variant="title" color="secondary" align="center">
            {copy.closerRest}
          </AppText>
        </View>
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: spacing.md,
  },
  section: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  chips: {
    gap: spacing.sm,
    alignItems: 'center',
    width: '100%',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1.5,
    backgroundColor: colors.surface.raised,
    borderColor: colors.accent.gold,
  },
  pattern: {
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  divider: {
    alignSelf: 'center',
    width: spacing.xxl,
    height: 1,
    backgroundColor: colors.accent.gold,
  },
  closer: {
    gap: 0,
    paddingHorizontal: spacing.sm,
  },
});
