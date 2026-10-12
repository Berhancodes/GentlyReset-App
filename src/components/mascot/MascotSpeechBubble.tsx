import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { colors, motion, radius, shadows } from '@/design-system';

type MascotSpeechBubbleProps = {
  text: string;
  visible?: boolean;
  /**
   * Pause before a new line pops in, so the mascot reacts first and then
   * speaks. Only applies when the text changes.
   */
  swapDelay?: number;
};

const BUBBLE_PADDING_HORIZONTAL = 15;
const BUBBLE_PADDING_VERTICAL = 9;
const OUTLINE_WIDTH = 2.5;
/** The tail is a small rotated square: outline on its two lower sides only. */
const TAIL_SQUARE = 12;
/** Roughly one space at the bubble's font size. */
const WORD_GAP = 4;
const POP_SPRING = { damping: 12, stiffness: 260 } as const;
const bubbleFill = colors.speechBubble.fill;
const bubbleOutline = colors.speechBubble.outline;

/**
 * Soft Home speech bubble. Sits above the mascot without owning playback.
 * When the text changes, the old line shrinks away, the bubble pops back in
 * and the words ripple in one by one. Onboarding keeps its own typewriter bubble.
 */
export function MascotSpeechBubble({
  text,
  visible = true,
  swapDelay = 0,
}: MascotSpeechBubbleProps) {
  const reduceMotion = useReducedMotion() === true;
  const progress = useSharedValue(0);
  const showing = useSharedValue(visible);
  // 1 = settled; dips to 0 while one line swaps for the next.
  const swap = useSharedValue(1);
  const exiting = useSharedValue(false);
  const reveal = useSharedValue(1);
  const [shownText, setShownText] = useState(text);
  const firstShown = useRef(true);

  if (reduceMotion && text !== shownText) {
    setShownText(text);
  }

  useEffect(() => {
    showing.value = visible;

    if (reduceMotion) {
      progress.value = visible ? 1 : 0;
      return;
    }

    progress.value = withTiming(visible ? 1 : 0, {
      duration: visible ? motion.duration.homeBubbleShow : motion.duration.homeBubbleHide,
      easing: Easing.bezier(...motion.easing.standard),
    });
  }, [progress, reduceMotion, showing, visible]);

  // One effect runs both halves of a swap: while `text` is ahead of the shown
  // line the old line bows out; once it is committed, the new one pops in.
  useEffect(() => {
    if (firstShown.current) {
      firstShown.current = false;
      return;
    }
    if (reduceMotion) {
      return;
    }
    if (text !== shownText) {
      exiting.value = true;
      swap.value = withTiming(
        0,
        { duration: motion.duration.homeBubbleSwapOut, easing: Easing.in(Easing.quad) },
        (finished) => {
          if (finished) {
            runOnJS(setShownText)(text);
          }
        },
      );
      return;
    }
    const wordCount = shownText.split(/\s+/).filter(Boolean).length;
    exiting.value = false;
    swap.value = withDelay(swapDelay, withSpring(1, POP_SPRING));
    reveal.value = 0;
    reveal.value = withDelay(
      swapDelay + motion.duration.homeBubbleWord,
      withTiming(1, {
        duration: wordCount * motion.duration.homeBubbleWord + motion.duration.homeBubbleWordFade,
        easing: Easing.linear,
      }),
    );
  }, [exiting, reduceMotion, reveal, shownText, swap, swapDelay, text]);

  const animatedStyle = useAnimatedStyle(() => {
    const hiddenY = showing.value ? motion.offset.homeBubbleShow : motion.offset.homeBubbleHide;
    const hiddenScale = showing.value ? motion.scale.bubbleFrom : motion.scale.homeBubbleHide;
    const swapScale = exiting.value
      ? interpolate(swap.value, [0, 1], [motion.scale.homeBubbleSwapOut, 1])
      : interpolate(swap.value, [0, 1], [motion.scale.homeBubbleSwapFrom, 1]);

    return {
      opacity: progress.value * Math.min(1, swap.value * 1.6),
      transform: [
        { translateY: interpolate(progress.value, [0, 1], [hiddenY, 0]) },
        { scale: interpolate(progress.value, [0, 1], [hiddenScale, 1]) * swapScale },
      ],
    };
  });

  const words = shownText.split(/\s+/).filter(Boolean);

  return (
    <Animated.View
      accessible
      accessibilityRole="text"
      accessibilityLabel={shownText}
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'yes' : 'no-hide-descendants'}
      pointerEvents="none"
      style={[styles.root, animatedStyle]}
    >
      <View style={styles.body}>
        <View style={styles.words}>
          {words.map((word, index) => (
            <BubbleWord
              key={`${shownText}-${index}`}
              word={word}
              index={index}
              count={words.length}
              reveal={reveal}
            />
          ))}
        </View>
      </View>
      <View style={styles.tail} />
    </Animated.View>
  );
}

type BubbleWordProps = {
  word: string;
  index: number;
  count: number;
  reveal: SharedValue<number>;
};

/** One word that fades and rises in during its slice of the reveal. */
function BubbleWord({ word, index, count, reveal }: BubbleWordProps) {
  const style = useAnimatedStyle(() => {
    const step = motion.duration.homeBubbleWord;
    const total = count * step + motion.duration.homeBubbleWordFade;
    const start = (index * step) / total;
    const end = (index * step + motion.duration.homeBubbleWordFade) / total;
    const shown = Math.min(1, Math.max(0, (reveal.value - start) / (end - start)));
    return {
      opacity: shown,
      transform: [{ translateY: (1 - shown) * motion.offset.homeBubbleWordRise }],
    };
  });

  return (
    <Animated.View style={style}>
      <AppText variant="homeBubble" color="home" align="center" maxFontSizeMultiplier={1.25}>
        {word}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'center',
    alignItems: 'center',
    maxWidth: '68%',
  },
  body: {
    zIndex: 1,
    alignSelf: 'center',
    minHeight: 0,
    flexShrink: 1,
    maxWidth: '100%',
    paddingHorizontal: BUBBLE_PADDING_HORIZONTAL,
    paddingVertical: BUBBLE_PADDING_VERTICAL,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.homeBubble,
    borderWidth: OUTLINE_WIDTH,
    borderColor: bubbleOutline,
    backgroundColor: bubbleFill,
    ...shadows.homeBubble,
  },
  words: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: WORD_GAP,
  },
  tail: {
    zIndex: 2,
    width: TAIL_SQUARE,
    height: TAIL_SQUARE,
    // Sits over the bubble's bottom outline so the two join without a seam.
    marginTop: -(TAIL_SQUARE / 2) - OUTLINE_WIDTH / 2,
    borderRightWidth: OUTLINE_WIDTH,
    borderBottomWidth: OUTLINE_WIDTH,
    borderColor: bubbleOutline,
    borderBottomRightRadius: 3,
    backgroundColor: bubbleFill,
    transform: [{ rotate: '45deg' }],
  },
});
