import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, MascotPlaceholder, ProgressBar, Screen } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import { useCurrentOnboardingStep } from '@/features/onboarding/hooks/useCurrentOnboardingStep';

type OnboardingScreenLayoutProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  footer?: ReactNode;
  showMascot?: boolean;
  onBack?: () => void;
};

export function OnboardingScreenLayout({
  title,
  subtitle,
  children,
  footer,
  showMascot = true,
  onBack,
}: OnboardingScreenLayoutProps) {
  const { progress, currentStepIndex, totalSteps } = useCurrentOnboardingStep();

  return (
    <Screen>
      <View style={styles.header}>
        <ProgressBar
          progress={progress}
          accessibilityLabel={`Step ${currentStepIndex + 1} of ${totalSteps}`}
        />
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack}
            hitSlop={spacing.sm}
            style={styles.backButton}
          >
            <AppText variant="caption" color="secondary">
              back
            </AppText>
          </Pressable>
        ) : (
          <View style={styles.backSpacer} />
        )}
      </View>

      <View style={styles.body}>
        {showMascot ? <MascotPlaceholder /> : null}
        <View style={styles.copy}>
          <AppText variant="display">{title}</AppText>
          {subtitle ? (
            <AppText variant="subtitle" color="secondary">
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {children}
      </View>

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.xs,
    gap: spacing.md,
  },
  backButton: {
    minHeight: 44,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  backSpacer: {
    height: spacing.xs,
  },
  body: {
    flex: 1,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  copy: {
    gap: spacing.sm,
  },
  footer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background.primary,
  },
});
