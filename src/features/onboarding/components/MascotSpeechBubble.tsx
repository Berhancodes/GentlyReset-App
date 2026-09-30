import { StyleSheet, View } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';

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
            <AppText variant="mascotSpeechGreeting" color="primary" align="left">
              {askGreeting}
            </AppText>
          </Animated.View>
          <Animated.View style={questionStyle}>
            <AppText variant="body" color="primary" align="left">
              {askQuestion}
            </AppText>
          </Animated.View>
        </View>
        <Animated.View
          pointerEvents={showingReply ? 'auto' : 'none'}
          style={[styles.copyLayer, styles.replyLayer, replyStyle]}
        >
          <AppText variant="body" color="primary" align="left">
            {reply}
          </AppText>
        </Animated.View>
      </View>
    </View>
  );
}

const bubblePaddingHorizontal = spacing.xs + spacing.xxs / 2;
const bubblePaddingVertical = spacing.xs;

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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.whisper,
    backgroundColor: colors.surface.raised,
    paddingHorizontal: bubblePaddingHorizontal,
    paddingVertical: bubblePaddingVertical,
    ...shadows.whisper,
  },
  copyLayer: {
    gap: spacing.none,
    minWidth: 0,
    width: '100%',
  },
  replyLayer: {
    ...StyleSheet.absoluteFill,
    paddingHorizontal: bubblePaddingHorizontal,
    paddingVertical: bubblePaddingVertical,
    justifyContent: 'center',
  },
  tail: {
    width: 10,
    height: 10,
    marginTop: 16,
    marginRight: -5,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.whisper,
    backgroundColor: colors.surface.raised,
    transform: [{ rotate: '38deg' }],
  },
});
