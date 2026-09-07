import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useStagedLoading } from '@/features/onboarding/hooks/useStagedLoading';
import type { LoadingStep } from '@/features/onboarding/types/onboarding';

type LoadingScreenProps = {
  step: LoadingStep;
};

export function LoadingScreen({ step }: LoadingScreenProps) {
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const completedCount = useStagedLoading({
    stageCount: step.stages.length,
    mockDurationMs: step.mockDurationMs,
    onComplete: goToNext,
  });

  return (
    <OnboardingScreenLayout
      title={step.title}
      subtitle={step.subtitle}
      illustrationKey={step.illustrationKey}
      illustrationSize={step.illustrationSize}
      hideProgress
      onBack={canGoBack ? goBack : undefined}
    >
      <View accessibilityRole="progressbar" accessibilityLabel={step.title} style={styles.list}>
        {step.stages.map((stage, index) => {
          const done = index < completedCount;
          return (
            <View key={stage.id} style={styles.row}>
              <View style={[styles.mark, done ? styles.markDone : styles.markIdle]}>
                {done ? (
                  <AppText variant="label" color="inverse">
                    ✓
                  </AppText>
                ) : null}
              </View>
              <AppText variant="body" color={done ? 'primary' : 'muted'}>
                {stage.label}
              </AppText>
            </View>
          );
        })}
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
  },
  mark: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markIdle: {
    borderWidth: 1.5,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.primary,
  },
  markDone: {
    backgroundColor: colors.accent.sage,
  },
});
