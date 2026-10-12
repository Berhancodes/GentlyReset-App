import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, textVariants } from '@/design-system';
import { BackChevron } from '@/features/onboarding/components/BackChevron';
import { UnlockStepsBar } from '@/features/onboarding/components/UnlockStepsBar';
import type { UNLOCK_STEP_IDS } from '@/features/onboarding/data/onboardingSteps';

type UnlockLayoutProps = {
  stepId: (typeof UNLOCK_STEP_IDS)[number];
  eyebrow?: string;
  title: string;
  onBack?: () => void;
  /** The main message, centred in the space between the title and the bottom. */
  children: ReactNode;
  /** Sits just above the button, with it, where the thumb is. */
  anchored?: ReactNode;
  footer: ReactNode;
};

/**
 * The plan and promise screens. The title stays at the top, the action (button and
 * whatever it's about) stays at the bottom, and only the main message is centred
 * in the space between, so nothing floats with a gap above and below.
 */
export function UnlockLayout({
  stepId,
  eyebrow,
  title,
  onBack,
  children,
  anchored,
  footer,
}: UnlockLayoutProps) {
  return (
    <SafeAreaView edges={['top', 'right', 'left', 'bottom']} style={styles.root}>
      <View style={styles.top}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack}
            hitSlop={spacing.sm}
            style={styles.back}
          >
            <BackChevron />
          </Pressable>
        ) : null}
        <UnlockStepsBar stepId={stepId} />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.header} accessibilityRole="header">
          {eyebrow ? (
            <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
              {eyebrow}
            </Text>
          ) : null}
          <Text style={styles.title} maxFontSizeMultiplier={1.25}>
            {title}
          </Text>
        </View>
        <View style={styles.main}>{children}</View>
        {anchored ? <View style={styles.anchored}>{anchored}</View> : null}
      </ScrollView>
      <View style={styles.footer}>{footer}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.unlock.background,
    paddingHorizontal: spacing.lg - 2,
  },
  top: {
    minHeight: spacing.hitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  back: {
    width: spacing.lg,
    height: spacing.hitTarget,
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  /** Fills the space above the button; scrolls only if it can't fit. */
  content: {
    flexGrow: 1,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.lg,
  },
  main: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: spacing.sm + 2,
  },
  anchored: {
    gap: spacing.sm + 2,
  },
  header: {
    gap: spacing.xxs + 2,
    paddingBottom: spacing.xxs,
  },
  eyebrow: {
    ...textVariants.unlockEyebrow,
    color: colors.unlock.kicker,
  },
  title: {
    ...textVariants.unlockTitle,
    color: colors.unlock.ink,
  },
  footer: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
});
