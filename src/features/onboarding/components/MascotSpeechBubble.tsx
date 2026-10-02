import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { type AnimatedStyle, useReducedMotion } from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { colors, motion, radius, shadows, spacing, type TextVariant } from '@/design-system';
import {
  type TypewriterLine,
  useStagedTypewriter,
} from '@/features/onboarding/hooks/useStagedTypewriter';
import { hapticTypewriterTick } from '@/utils/haptics';

type BubbleLine = TypewriterLine & {
  variant: TextVariant;
};

type MascotSpeechBubbleProps = {
  askGreeting: string;
  askQuestion: string;
  reply: string;
  showingReply: boolean;
  askStyle: AnimatedStyle<{ opacity: number }>;
  replyStyle: AnimatedStyle<{ opacity: number }>;
  onAskComplete?: () => void;
  onReplyComplete: () => void;
};

const bubblePaddingHorizontal = spacing.md;
const bubblePaddingVertical = spacing.sm;
const typingStartDelayMs = motion.delay.bubbleReveal + 80;

export function MascotSpeechBubble({
  askGreeting,
  askQuestion,
  reply,
  showingReply,
  askStyle,
  replyStyle,
  onAskComplete,
  onReplyComplete,
}: MascotSpeechBubbleProps) {
  const reduceMotion = useReducedMotion();
  const [canType, setCanType] = useState(reduceMotion === true);
  const askLines = useMemo<readonly BubbleLine[]>(
    () => [
      { id: 'greeting', text: askGreeting, variant: 'mascotSpeechGreeting' },
      { id: 'question', text: askQuestion, variant: 'body' },
    ],
    [askGreeting, askQuestion],
  );
  const replyLines = useMemo<readonly BubbleLine[]>(
    () => [{ id: 'reply', text: reply, variant: 'body' }],
    [reply],
  );

  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        setCanType(true);
      },
      reduceMotion ? 0 : typingStartDelayMs,
    );

    return () => {
      clearTimeout(timeoutId);
    };
  }, [reduceMotion]);

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
        <Animated.View style={[styles.copyLayer, askStyle]}>
          <View accessibilityElementsHidden importantForAccessibility="no" style={styles.reserve}>
            {askLines.map((line) => (
              <AppText
                key={`reserve-${line.id}`}
                variant={line.variant}
                color="primary"
                align="left"
              >
                {line.text}
              </AppText>
            ))}
          </View>
          <View pointerEvents="none" style={styles.typedOverlay}>
            {canType ? (
              <TypedBubbleLines
                lines={askLines}
                haptic={!showingReply}
                onComplete={onAskComplete}
              />
            ) : null}
          </View>
        </Animated.View>
        <Animated.View
          pointerEvents={showingReply ? 'auto' : 'none'}
          style={[styles.copyLayer, styles.replyLayer, replyStyle]}
        >
          {canType && showingReply && reply.length > 0 ? (
            <TypedBubbleLines key={reply} lines={replyLines} haptic onComplete={onReplyComplete} />
          ) : null}
        </Animated.View>
      </View>
    </View>
  );
}

function TypedBubbleLines({
  lines,
  haptic,
  onComplete,
}: {
  lines: readonly BubbleLine[];
  haptic: boolean;
  onComplete?: () => void;
}) {
  const { isComplete, visibleText } = useStagedTypewriter(lines);
  const spoken = lines.map((_line, index) => visibleText(index)).join('');
  const previousSpoken = useRef('');
  const completedRef = useRef(false);

  useEffect(() => {
    if (!haptic) {
      previousSpoken.current = spoken;
      return;
    }

    if (spoken.length <= previousSpoken.current.length) {
      previousSpoken.current = spoken;
      return;
    }

    const added = spoken.slice(previousSpoken.current.length);
    previousSpoken.current = spoken;
    if ([...added].some((character) => character.trim() !== '')) {
      void hapticTypewriterTick();
    }
  }, [haptic, spoken]);

  useEffect(() => {
    if (isComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [isComplete, onComplete]);

  return (
    <View accessibilityElementsHidden importantForAccessibility="no">
      {lines.map((line, index) => (
        <AppText key={line.id} variant={line.variant} color="primary" align="left">
          {visibleText(index)}
        </AppText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    overflow: 'visible',
  },
  card: {
    zIndex: 1,
    minWidth: 0,
    borderRadius: radius.xl,
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
  reserve: {
    opacity: 0,
  },
  typedOverlay: {
    ...StyleSheet.absoluteFill,
  },
  replyLayer: {
    ...StyleSheet.absoluteFill,
    paddingHorizontal: bubblePaddingHorizontal,
    paddingVertical: bubblePaddingVertical,
    justifyContent: 'center',
  },
  tail: {
    position: 'absolute',
    zIndex: 0,
    left: 18,
    bottom: -13,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 18,
    borderTopWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.surface.raised,
    transform: [{ rotate: '12deg' }],
  },
});
