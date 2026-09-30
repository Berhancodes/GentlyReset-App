import { StyleSheet, View } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';

type MascotSpeechBubbleProps = {
  askGreeting: string;
  askQuestion: string;
  reply: string;
  showingReply: boolean;
  greetingStyle: AnimatedStyle<{ opacity: number }>;
  questionStyle: AnimatedStyle<{ opacity: number }>;
  replyStyle: AnimatedStyle<{ opacity: number }>;
};

export function MascotSpeechBubble({
  askGreeting,
  askQuestion,
  reply,
  showingReply,
  greetingStyle,
  questionStyle,
  replyStyle,
}: MascotSpeechBubbleProps) {
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      accessibilityLabel={showingReply ? reply : `${askGreeting}. ${askQuestion}`}
      style={styles.root}
    >
      <View accessibilityElementsHidden importantForAccessibility="no" style={styles.tail} />
      <View style={styles.card}>
        <View style={styles.copyLayer}>
          <Animated.View style={greetingStyle}>
            <AppText variant="optionTitle" color="primary" align="left">
              {askGreeting}
            </AppText>
          </Animated.View>
          <Animated.View style={questionStyle}>
            <AppText variant="caption" color="primary" align="left">
              {askQuestion}
            </AppText>
          </Animated.View>
        </View>
        <Animated.View
          pointerEvents={showingReply ? 'auto' : 'none'}
          style={[styles.copyLayer, styles.replyLayer, replyStyle]}
        >
          <AppText variant="caption" color="primary" align="left">
            {reply}
          </AppText>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    width: '100%',
  },
  card: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.raised,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm - spacing.xxs / 2,
  },
  copyLayer: {
    gap: spacing.xxs,
    width: '100%',
  },
  replyLayer: {
    ...StyleSheet.absoluteFill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm - spacing.xxs / 2,
    justifyContent: 'center',
  },
  tail: {
    width: 11,
    height: 11,
    marginTop: 38,
    marginRight: -6,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.raised,
    transform: [{ rotate: '38deg' }],
  },
});
