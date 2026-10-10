import type { ReactNode } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontSizes, spacing, textVariants } from '@/design-system';
import {
  ONBOARDING_CHAPTERS,
  type OnboardingChapterId,
} from '@/features/onboarding/types/onboarding';
import { balanceHeading } from '@/features/onboarding/utils/balanceHeading';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';

import { MascotSlot } from './MascotSlot';

const TITLE_MAX_SCALE = 1.25;
/** Space under the last control, counting the home indicator. */
const BOTTOM_ROOM = spacing.xl - 2;

type StageLayoutProps = {
  title: string;
  /** Shown above the title; defaults to the chapter, e.g. "Where you are · 1 of 4". */
  eyebrow?: string;
  chapter?: OnboardingChapterId;
  subtitle?: string;
  /** Answers sit directly under the mascot. */
  children?: ReactNode;
  /** The primary action, pinned to the bottom. */
  footer?: ReactNode;
  avoidKeyboard?: boolean;
};

/**
 * Clean stage screen: the question on top, the mascot's space in the middle,
 * then the answers and the button. The mascot itself is drawn once by
 * StageMascot so he stays put while screens slide.
 */
export function StageLayout({
  title,
  eyebrow,
  chapter,
  subtitle,
  children,
  footer,
  avoidKeyboard = false,
}: StageLayoutProps) {
  const label = eyebrow ?? chapterLabel(chapter);
  const { width, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // Rounded heavy glyphs average a little over half the font size in width.
  const titleCharacters = Math.floor(
    (width - spacing.lg * 2 - spacing.xs * 2) /
      (fontSizes.stageTitle * Math.min(fontScale, TITLE_MAX_SCALE) * 0.56),
  );
  // Like the mockup: about 30pt under the button, counting the home indicator.
  const bottomRoom = Math.max(spacing.xxs, BOTTOM_ROOM - insets.bottom);
  const header = (
    <>
      <View style={styles.header} accessibilityRole="header">
        {label ? (
          <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
            {label}
          </Text>
        ) : null}
        <Text style={styles.title} maxFontSizeMultiplier={TITLE_MAX_SCALE}>
          {/* Step titles carry line breaks for the old illustrated layouts; here they're rebalanced. */}
          {balanceHeading(capitalizeHeading(title.replace(/\n/g, ' ')), titleCharacters)}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} maxFontSizeMultiplier={1.3}>
            {capitalizeHeading(subtitle)}
          </Text>
        ) : null}
      </View>
      <MascotSlot />
    </>
  );
  const content = (
    <View style={styles.root}>
      {avoidKeyboard ? (
        // Tapping the question or the mascot closes the keyboard. The text box sits outside
        // this area, so tapping it never blurs it.
        <Pressable accessible={false} onPress={Keyboard.dismiss} style={styles.dismissArea}>
          {header}
        </Pressable>
      ) : (
        header
      )}
      {children ? (
        // When answers outgrow the screen, the mascot shrinks first, then the answers scroll.
        <ScrollView
          style={styles.answersScroll}
          contentContainerStyle={[styles.answers, footer ? null : { paddingBottom: bottomRoom }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          bounces={false}
        >
          {children}
        </ScrollView>
      ) : null}
      {footer ? <View style={[styles.footer, { paddingBottom: bottomRoom }]}>{footer}</View> : null}
    </View>
  );

  if (!avoidKeyboard) {
    return content;
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {content}
    </KeyboardAvoidingView>
  );
}

function chapterLabel(chapter: OnboardingChapterId | undefined): string | undefined {
  const index = ONBOARDING_CHAPTERS.findIndex((item) => item.id === chapter);
  const found = ONBOARDING_CHAPTERS[index];
  if (!found) {
    return undefined;
  }
  return `${found.label} · ${index + 1} of ${ONBOARDING_CHAPTERS.length}`;
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  eyebrow: {
    ...textVariants.stageEyebrow,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  title: {
    ...textVariants.stageTitle,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...textVariants.stageSubtitle,
    color: colors.stage.copySoft,
    textAlign: 'center',
    maxWidth: 300,
  },
  root: {
    flex: 1,
    minHeight: 0,
  },
  dismissArea: {
    flex: 1,
    minHeight: 0,
  },
  answersScroll: {
    flexGrow: 0,
    flexShrink: 1,
    // Answers and the button run a little wider than the question (20pt sides).
    marginHorizontal: -spacing.xxs,
  },
  answers: {
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  footer: {
    marginHorizontal: -spacing.xxs,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
});
