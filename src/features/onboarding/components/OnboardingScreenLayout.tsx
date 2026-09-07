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
import { IllustrationPlaceholder } from '@/features/onboarding/components/IllustrationPlaceholder';
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
}: OnboardingScreenLayoutProps) {
  const showProgress = !hideProgress;

  const body = (
    <Screen>
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {illustrationKey ? (
          <IllustrationPlaceholder illustrationKey={illustrationKey} size={illustrationSize} />
        ) : null}
        <View style={styles.copy}>
          {eyebrow ? (
            <AppText variant="label" color="muted">
              {eyebrow}
            </AppText>
          ) : null}
          {showTitle ? <AppText variant="display">{title}</AppText> : null}
          {subtitle ? (
            <AppText variant="subtitle" color="secondary">
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {children}
      </ScrollView>

      {footer ? <View style={styles.footer}>{footer}</View> : null}
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  copy: {
    gap: spacing.sm,
  },
  footer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
    backgroundColor: colors.background.primary,
  },
});
