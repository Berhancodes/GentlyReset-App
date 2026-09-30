import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AppText, Screen } from '@/components/ui';
import { ChoiceEntranceScope } from '@/components/ui/ChoiceCard';
import { colors, spacing } from '@/design-system';
import { IllustrationPlaceholder } from '@/features/onboarding/components/IllustrationPlaceholder';
import { OnboardingHero } from '@/features/onboarding/components/OnboardingHero';
import { OnboardingProgress } from '@/features/onboarding/components/OnboardingProgress';
import { OnboardingQuestionNav } from '@/features/onboarding/components/OnboardingQuestionNav';
import { useOnboardingQuestionnaireShell } from '@/features/onboarding/components/OnboardingQuestionnaireShell';
import type {
  OnboardingIllustrationKey,
  OnboardingIllustrationSize,
} from '@/features/onboarding/types/onboarding';

type OnboardingScreenLayoutProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: ReactNode;
  footer?: ReactNode;
  illustrationKey?: OnboardingIllustrationKey;
  illustrationSize?: OnboardingIllustrationSize;
  hideProgress?: boolean;
  onBack?: () => void;
  avoidKeyboard?: boolean;
  showTitle?: boolean;
  tone?: 'default' | 'question' | 'story';
  /** Tighter vertical gaps so a compact question can fit on one phone screen. */
  compact?: boolean;
  /**
   * start: art above copy (questions).
   * afterHero: title then art then extra content (reveal, plan).
   * end: all copy, then art (story beats).
   */
  illustrationPlacement?: 'start' | 'afterHero' | 'end';
  /** Let a child (companion mascot) own the leftover story space instead of a spacer. */
  skipStorySpacer?: boolean;
};

export function OnboardingScreenLayout({
  title,
  subtitle,
  eyebrow,
  children,
  footer,
  illustrationKey,
  illustrationSize = 'default',
  hideProgress = false,
  onBack,
  avoidKeyboard = false,
  showTitle = true,
  tone = 'default',
  compact = false,
  illustrationPlacement = 'start',
  skipStorySpacer = false,
}: OnboardingScreenLayoutProps) {
  const inQuestionnaireShell = useOnboardingQuestionnaireShell();
  const showProgress = !hideProgress;
  const isQuestion = tone === 'question';
  const isStory = tone === 'story';
  const useBrandNav = isQuestion || isStory;
  const progress = showProgress ? <OnboardingProgress /> : null;

  const scroll = (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.scrollContent,
        isQuestion ? styles.questionScrollContent : null,
        isStory ? styles.storyScrollContent : null,
        compact ? styles.compactScrollContent : null,
      ]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    >
      {illustrationKey && illustrationPlacement === 'start' ? (
        <IllustrationPlaceholder illustrationKey={illustrationKey} size={illustrationSize} />
      ) : null}
      <OnboardingHero
        title={title}
        subtitle={subtitle}
        eyebrow={eyebrow}
        showTitle={showTitle}
        tone={tone}
      />
      {illustrationKey && illustrationPlacement === 'afterHero' ? (
        <IllustrationPlaceholder illustrationKey={illustrationKey} size={illustrationSize} />
      ) : null}
      <ChoiceEntranceScope>{children}</ChoiceEntranceScope>
      {illustrationKey && illustrationPlacement === 'end' ? (
        <IllustrationPlaceholder illustrationKey={illustrationKey} size={illustrationSize} />
      ) : null}
      {isStory && !skipStorySpacer ? <View style={styles.storyFlex} /> : null}
    </ScrollView>
  );

  const footerBlock = footer ? (
    <View
      style={[
        styles.footer,
        isQuestion ? styles.questionFooter : null,
        isStory ? styles.questionFooter : null,
        compact ? styles.compactFooter : null,
      ]}
    >
      {footer}
    </View>
  ) : null;

  const body = inQuestionnaireShell ? (
    <View style={styles.flex}>
      {scroll}
      {footerBlock}
    </View>
  ) : (
    <Screen>
      {useBrandNav ? (
        <OnboardingQuestionNav onBack={onBack} hideProgress={!showProgress} />
      ) : (
        <View style={styles.header}>
          {progress ?? <View style={styles.progressSpacer} />}
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
          ) : null}
        </View>
      )}
      {scroll}
      {footerBlock}
    </Screen>
  );

  if (!avoidKeyboard) {
    return body;
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {body}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.xs,
    gap: spacing.sm,
  },
  progressSpacer: {
    height: spacing.xs,
  },
  backButton: {
    minHeight: 44,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  questionScrollContent: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  storyScrollContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.lg,
  },
  storyFlex: {
    flexGrow: 1,
    minHeight: spacing.sm,
  },
  footer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
    backgroundColor: colors.background.primary,
  },
  questionFooter: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  compactScrollContent: {
    paddingTop: spacing.md,
    paddingBottom: 0,
    gap: spacing.md,
  },
  compactFooter: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
});
