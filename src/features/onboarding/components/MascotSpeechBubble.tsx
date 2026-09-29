import { StyleSheet, View } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { MASCOT_INTRO_LAYOUT } from '@/features/onboarding/utils/mascotIntroLayout';

type MascotSpeechBubbleProps = {
  askGreeting: string;
  askLines: readonly string[];
  reply: string;
  showingReply: boolean;
  askStyle: AnimatedStyle<{ opacity: number }>;
  replyStyle: AnimatedStyle<{ opacity: number }>;
};

export function MascotSpeechBubble({
  askGreeting,
  askLines,
  reply,
  showingReply,
  askStyle,
  replyStyle,
}: MascotSpeechBubbleProps) {
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      accessibilityLabel={showingReply ? reply : `${askGreeting}. ${askLines.join(' ')}`}
      style={styles.root}
    >
      <View style={styles.card}>
        <Animated.View style={[styles.copyLayer, askStyle]}>
          <AppText variant="onboardingChoiceTitle" color="primary" align="left">
            {askGreeting}
          </AppText>
          {askLines.map((line) => (
            <AppText key={line} variant="onboardingChoiceSubtitle" color="primary" align="left">
              {line}
            </AppText>
          ))}
        </Animated.View>
        <Animated.View
          pointerEvents={showingReply ? 'auto' : 'none'}
          style={[styles.copyLayer, styles.replyLayer, replyStyle]}
        >
          <AppText variant="onboardingChoiceTitle" color="primary" align="left">
            {reply}
          </AppText>
        </Animated.View>
      </View>
      <View accessibilityElementsHidden importantForAccessibility="no" style={styles.tail} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'flex-start',
  },
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.raised,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.whisper,
  },
  copyLayer: {
    gap: spacing.xxs,
  },
  replyLayer: {
    ...StyleSheet.absoluteFill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  tail: {
    width: 12,
    height: 12,
    marginTop: -7,
    marginLeft: MASCOT_INTRO_LAYOUT.bubbleTailInset - 4,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.raised,
    transform: [{ rotate: '45deg' }],
  },
});
