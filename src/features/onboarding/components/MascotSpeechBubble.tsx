import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  type AnimatedStyle,
  LinearTransition,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { colors, motion, radius, shadows, spacing, type TextVariant } from '@/design-system';
import {
  type TypewriterLine,
  useStagedTypewriter,
} from '@/features/onboarding/hooks/useStagedTypewriter';
import { hapticSuccess, hapticTypewriterExcitement, hapticTypewriterTick } from '@/utils/haptics';

type BubbleHaptic = 'tick' | 'excitement' | false;

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
  tailOffset: number;
  onAskComplete?: () => void;
  onReplyComplete: () => void;
};

/** Same shape as the Home bubble: roomy padding, round corners, soft rounded tail. */
const bubblePaddingHorizontal = 20;
const bubblePaddingVertical = spacing.md;
const bubbleFill = colors.surface.raised;
const TAIL_WIDTH = 16;
const TAIL_HEIGHT = 11;
const TAIL_SQUARE = 14;
/** When the mascot switches from asking to replying, the bubble dips then springs back. */
const SWAP_DIP = 0.95;
const SWAP_SPRING = { damping: 12, stiffness: 260 } as const;
const typingStartDelayMs = motion.delay.bubbleReveal + 80;

export function MascotSpeechBubble({
  askGreeting,
  askQuestion,
  reply,
  showingReply,
  askStyle,
  replyStyle,
  tailOffset,
  onAskComplete,
  onReplyComplete,
}: MascotSpeechBubbleProps) {
  const reduceMotion = useReducedMotion();
  const [canType, setCanType] = useState(reduceMotion === true);
  const swapPop = useSharedValue(1);
  const wasShowingReply = useRef(showingReply);

  useEffect(() => {
    if (showingReply && !wasShowingReply.current && !reduceMotion) {
      swapPop.value = withSequence(
        withTiming(SWAP_DIP, { duration: motion.duration.homeBubbleSwapOut }),
        withSpring(1, SWAP_SPRING),
      );
    }
    wasShowingReply.current = showingReply;
  }, [reduceMotion, showingReply, swapPop]);

  const swapStyle = useAnimatedStyle(() => ({ transform: [{ scale: swapPop.value }] }));
  const askLines = useMemo<readonly BubbleLine[]>(
    () => [
      { id: 'greeting', text: askGreeting, variant: 'mascotSpeechGreeting' },
      { id: 'question', text: askQuestion, variant: 'mascotSpeechGreeting' },
    ],
    [askGreeting, askQuestion],
  );
  const replyLines = useMemo<readonly BubbleLine[]>(
    () => [{ id: 'reply', text: reply, variant: 'mascotSpeechGreeting' }],
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

  // The bubble is sized by whatever line is showing right now, so it hugs the
  // question first and then the reply.
  const currentLines = showingReply && reply.length > 0 ? replyLines : askLines;

  return (
    <Animated.View
      accessible
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      accessibilityLabel={showingReply ? reply : `${askGreeting}. ${askQuestion}`}
      style={[styles.root, swapStyle]}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={[styles.tailClip, { left: tailOffset - TAIL_WIDTH / 2 }]}
      >
        <View style={styles.tail} />
      </View>
      <Animated.View
        style={styles.card}
        layout={reduceMotion ? undefined : LinearTransition.springify().damping(18).stiffness(220)}
      >
        <View accessibilityElementsHidden importantForAccessibility="no" style={styles.reserve}>
          {currentLines.map((line) => (
            <AppText
              key={`reserve-${line.id}`}
              variant={line.variant}
              color="primary"
              align="center"
            >
              {line.text}
            </AppText>
          ))}
        </View>
        <Animated.View pointerEvents="none" style={[styles.copyLayer, askStyle]}>
          {canType ? (
            <TypedBubbleLines
              lines={askLines}
              haptic={showingReply ? false : 'tick'}
              onComplete={onAskComplete}
            />
          ) : null}
        </Animated.View>
        <Animated.View pointerEvents="none" style={[styles.copyLayer, replyStyle]}>
          {canType && showingReply && reply.length > 0 ? (
            <TypedBubbleLines
              key={reply}
              lines={replyLines}
              haptic="excitement"
              onComplete={onReplyComplete}
            />
          ) : null}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

function TypedBubbleLines({
  lines,
  haptic,
  onComplete,
}: {
  lines: readonly BubbleLine[];
  haptic: BubbleHaptic;
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
      if (haptic === 'excitement') {
        void hapticTypewriterExcitement();
        return;
      }
      void hapticTypewriterTick();
    }
  }, [haptic, spoken]);

  useEffect(() => {
    if (isComplete && !completedRef.current) {
      completedRef.current = true;
      if (haptic === 'excitement') {
        void hapticSuccess();
      }
      onComplete?.();
    }
  }, [haptic, isComplete, onComplete]);

  return (
    <View accessibilityElementsHidden importantForAccessibility="no" style={styles.typedLines}>
      {lines.map((line, index) => (
        <AppText key={line.id} variant={line.variant} color="primary" align="center">
          {visibleText(index)}
        </AppText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  /** Full anchor width so the tail can point at the head; the card itself hugs its text. */
  root: {
    width: '100%',
    alignItems: 'center',
    overflow: 'visible',
  },
  card: {
    zIndex: 1,
    maxWidth: '100%',
    borderRadius: radius.homeBubble,
    backgroundColor: bubbleFill,
    paddingHorizontal: bubblePaddingHorizontal,
    paddingVertical: bubblePaddingVertical,
    ...shadows.homeBubble,
  },
  /** Invisible copy of the current line; it alone decides the card's size. */
  reserve: {
    opacity: 0,
    alignItems: 'center',
  },
  /** Typed text sits over the reserve, inside the card's padding. */
  copyLayer: {
    ...StyleSheet.absoluteFill,
    paddingHorizontal: bubblePaddingHorizontal,
    paddingVertical: bubblePaddingVertical,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typedLines: {
    alignItems: 'center',
  },
  /** Rounded tail like the Home bubble: the bottom half of a soft rotated square. */
  tailClip: {
    position: 'absolute',
    zIndex: 2,
    bottom: -(TAIL_HEIGHT - 2),
    width: TAIL_WIDTH,
    height: TAIL_HEIGHT,
    overflow: 'hidden',
    alignItems: 'center',
  },
  tail: {
    width: TAIL_SQUARE,
    height: TAIL_SQUARE,
    marginTop: -(TAIL_SQUARE / 2) + 1,
    borderRadius: 2,
    backgroundColor: bubbleFill,
    transform: [{ rotate: '45deg' }],
  },
});
