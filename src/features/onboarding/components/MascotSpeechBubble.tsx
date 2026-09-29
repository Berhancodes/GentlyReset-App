import { StyleSheet, View } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';

type MascotSpeechBubbleProps = {
  askLines: readonly [string, string];
  reply: string;
  showingReply: boolean;
  askStyle: AnimatedStyle<{ opacity: number }>;
  replyStyle: AnimatedStyle<{ opacity: number }>;
};

export function MascotSpeechBubble({
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
      accessibilityLabel={showingReply ? reply : `${askLines[0]}. ${askLines[1]}`}
      style={styles.root}
    >
      <View style={styles.card}>
        <Animated.View style={[styles.copyLayer, askStyle]}>
          <AppText variant="onboardingChoiceTitle" color="primary" align="center">
            {askLines[0]}
          </AppText>
          <AppText variant="onboardingHelper" color="primary" align="center">
            {askLines[1]}
          </AppText>
        </Animated.View>
        <Animated.View
          pointerEvents={showingReply ? 'auto' : 'none'}
          style={[styles.copyLayer, styles.replyLayer, replyStyle]}
        >
          <AppText variant="onboardingChoiceTitle" color="primary" align="center">
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
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },
  card: {
    width: '100%',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.raised,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 92,
    justifyContent: 'center',
    ...shadows.whisper,
  },
  copyLayer: {
    gap: spacing.xs,
  },
  replyLayer: {
    ...StyleSheet.absoluteFill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: 'center',
  },
  tail: {
    width: 14,
    height: 14,
    marginTop: -8,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.raised,
    transform: [{ rotate: '45deg' }],
  },
});
