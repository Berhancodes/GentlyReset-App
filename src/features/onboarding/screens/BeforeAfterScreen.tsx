import { StyleSheet, View } from 'react-native';

import { AppText, PrimaryButton } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { BeforeAfterStep } from '@/features/onboarding/types/onboarding';
import { deriveBeforeAfterSummary } from '@/features/onboarding/utils/deriveBeforeAfterSummary';

type BeforeAfterScreenProps = {
  step: BeforeAfterStep;
};

export function BeforeAfterScreen({ step }: BeforeAfterScreenProps) {
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const answers = useOnboardingStore((state) => state.answers);
  const summary = deriveBeforeAfterSummary(answers);

  return (
    <OnboardingScreenLayout
      title={step.title}
      eyebrow={step.eyebrow}
      illustrationKey={step.illustrationKey}
      illustrationSize={step.illustrationSize}
      hideProgress
      showTitle={false}
      onBack={canGoBack ? goBack : undefined}
      footer={<PrimaryButton label={step.ctaLabel} onPress={goToNext} />}
    >
      <View style={styles.stack}>
        <View style={styles.group}>
          <AppText variant="label" color="muted">
            Today
          </AppText>
          <View style={styles.chips}>
            {summary.today.map((item) => (
              <View key={`today-${item}`} style={styles.chip}>
                <AppText variant="body">{item}</AppText>
              </View>
            ))}
          </View>
        </View>

        <AppText variant="title" align="center" color="muted">
          ↓
        </AppText>

        <View style={styles.group}>
          <AppText variant="label" color="muted">
            30 days
          </AppText>
          <View style={styles.chips}>
            {summary.later.map((item) => (
              <View key={`later-${item}`} style={styles.chipLater}>
                <AppText variant="body">{item}</AppText>
              </View>
            ))}
          </View>
        </View>
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.lg,
  },
  group: {
    gap: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface.selected,
  },
  chipLater: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.accent.sage,
  },
});
