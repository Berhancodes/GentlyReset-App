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
import { colors, spacing } from '@/design-system';
import { BackChevron } from '@/features/onboarding/components/BackChevron';
import { IllustrationPlaceholder } from '@/features/onboarding/components/IllustrationPlaceholder';
import { OnboardingHero } from '@/features/onboarding/components/OnboardingHero';
import { OnboardingProgress } from '@/features/onboarding/components/OnboardingProgress';
import type { OnboardingIllustrationKey } from '@/features/onboarding/types/onboarding';

type OnboardingScreenLayoutProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: ReactNode;
  footer?: ReactNode;
  illustrationKey?: OnboardingIllustrationKey;
  illustrationSize?: 'default' | 'large';
  hideProgress?: boolean;
  onBack?: () => void;
  avoidKeyboard?: boolean;
  showTitle?: boolean;
  tone?: 'default' | 'question' | 'story';
  /** Tighter vertical gaps so a compact question can fit on one phone screen. */
  compact?: boolean;
  /** Place artwork under the title — used for the reset-type reveal. */
  illustrationAfterCopy?: boolean;
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
  illustrationAfterCopy = false,
}: OnboardingScreenLayoutProps) {
  const showProgress = !hideProgress;
  const isQuestion = tone === 'question';
  const isStory = tone === 'story';
  const useBrandNav = isQuestion || isStory;

  const body = (
    <Screen>
      {useBrandNav ? (
        <View style={styles.questionNav}>
          {onBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={onBack}
              hitSlop={spacing.sm}
              style={styles.navSide}
            >
              <BackChevron />
            </Pressable>
          ) : (
            <View style={styles.navSide} />
          )}
          <View style={styles.navCenter}>{showProgress ? <OnboardingProgress /> : null}</View>
          <View style={styles.navSide} />
        </View>
      ) : (
        <View style={styles.header}>
          {showProgress ? <OnboardingProgress /> : <View style={styles.progressSpacer} />}
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
        {illustrationKey && !illustrationAfterCopy ? (
          <IllustrationPlaceholder illustrationKey={illustrationKey} size={illustrationSize} />
        ) : null}
        <OnboardingHero
          title={title}
          subtitle={subtitle}
          eyebrow={eyebrow}
          showTitle={showTitle}
          tone={tone}
        />
        {illustrationKey && illustrationAfterCopy ? (
          <IllustrationPlaceholder illustrationKey={illustrationKey} size={illustrationSize} />
        ) : null}
        {children}
      </ScrollView>

      {footer ? (
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
      ) : null}
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
  questionNav: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  navSide: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  navCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    gap: spacing.xl,
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
    paddingTop: spacing.sm,
    paddingBottom: 0,
    gap: spacing.sm,
  },
  compactFooter: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
});
