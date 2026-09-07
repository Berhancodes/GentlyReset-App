import { StyleSheet, View } from 'react-native';

import { AppText, PrimaryButton } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import type { FinalStep } from '@/features/onboarding/types/onboarding';
import { finishOnboarding } from '@/features/onboarding/utils/finishOnboarding';

type FinalScreenProps = {
  step: FinalStep;
};

export function FinalScreen({ step }: FinalScreenProps) {
  const { router, goBack, canGoBack } = useOnboardingNavigation();

  return (
    <OnboardingScreenLayout
      title={step.title}
      subtitle={step.subtitle}
      eyebrow={step.eyebrow}
      hideProgress
      onBack={canGoBack ? goBack : undefined}
      footer={
        <PrimaryButton
          label={step.ctaLabel}
          haptic="success"
          onPress={() => {
            finishOnboarding(router);
          }}
        />
      }
    >
      <View style={styles.preview}>
        {step.preview.map((item) => (
          <View key={item.dayLabel} style={styles.row}>
            <AppText variant="label" color="muted">
              {item.dayLabel}
            </AppText>
            <AppText variant="body">{item.title}</AppText>
          </View>
        ))}
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  preview: {
    gap: spacing.sm,
  },
  row: {
    minHeight: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.surface.raised,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
    gap: spacing.xxs,
  },
});
