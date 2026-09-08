import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { ONBOARDING_ILLUSTRATIONS } from '@/features/onboarding/data/onboardingAssets';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useStagedLoading } from '@/features/onboarding/hooks/useStagedLoading';
import type { LoadingStep } from '@/features/onboarding/types/onboarding';

const BUILDING_RESET_ART = require('../../../../assets/images/onboarding/building-reset.png');
const BUILDING_RESET_ASPECT = 1536 / 1024;

type LoadingScreenProps = {
  step: LoadingStep;
};

export function LoadingScreen({ step }: LoadingScreenProps) {
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const completedCount = useStagedLoading({
    stageCount: step.stages.length,
    mockDurationMs: step.mockDurationMs,
    onComplete: goToNext,
  });

  const maxArtHeight = Math.min(Math.round(windowHeight * 0.22), 188);
  const artWidth = Math.min(windowWidth - spacing.lg * 2, maxArtHeight * BUILDING_RESET_ASPECT);
  const artHeight = artWidth / BUILDING_RESET_ASPECT;

  return (
    <OnboardingScreenLayout
      title={step.title}
      subtitle={step.subtitle}
      hideProgress
      onBack={canGoBack ? goBack : undefined}
    >
      <View style={styles.body}>
        <Image
          source={BUILDING_RESET_ART}
          resizeMode="contain"
          accessibilityRole="image"
          accessibilityLabel={ONBOARDING_ILLUSTRATIONS.buildingReset.label}
          style={{ width: artWidth, height: artHeight, alignSelf: 'center' }}
        />
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
      </View>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: spacing.lg,
  },
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
