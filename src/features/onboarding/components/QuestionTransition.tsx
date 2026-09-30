import { useLayoutEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ChoiceEntranceFrozen } from '@/components/ui/ChoiceCard';
import { MOTION_EASING_STANDARD, motion } from '@/design-system/motion';

type QuestionTransitionProps = {
  contentKey: string;
  outgoingKey?: string;
  outgoing?: ReactNode;
  onSettled: () => void;
  children: ReactNode;
};

const questionEasing = Easing.bezier(
  MOTION_EASING_STANDARD[0],
  MOTION_EASING_STANDARD[1],
  MOTION_EASING_STANDARD[2],
  MOTION_EASING_STANDARD[3],
);

const QUESTION_MS = motion.duration.question;
const QUESTION_OFFSET = motion.offset.question;

/**
 * Crossfades questionnaire body while header/progress stay in the parent shell.
 * Outgoing: opacity 1→0, translateY 0→-8. Incoming: opacity 0→1, translateY 8→0.
 */
export function QuestionTransition({
  contentKey,
  outgoingKey,
  outgoing,
  onSettled,
  children,
}: QuestionTransitionProps) {
  const reduceMotion = useReducedMotion();
  const incomingOpacity = useSharedValue(1);
  const incomingY = useSharedValue(0);
  const outgoingOpacity = useSharedValue(1);
  const outgoingY = useSharedValue(0);

  useLayoutEffect(() => {
    if (!outgoingKey || reduceMotion) {
      incomingOpacity.value = 1;
      incomingY.value = 0;
      outgoingOpacity.value = 1;
      outgoingY.value = 0;
      return;
    }

    const timing = { duration: QUESTION_MS, easing: questionEasing };
    incomingOpacity.value = 0;
    incomingY.value = QUESTION_OFFSET;
    outgoingOpacity.value = 1;
    outgoingY.value = 0;
    outgoingOpacity.value = withTiming(0, timing);
    outgoingY.value = withTiming(-QUESTION_OFFSET, timing);
    incomingY.value = withTiming(0, timing);
    incomingOpacity.value = withTiming(1, timing, (finished) => {
      if (finished) {
        runOnJS(onSettled)();
      }
    });
  }, [
    contentKey,
    incomingOpacity,
    incomingY,
    onSettled,
    outgoingKey,
    outgoingOpacity,
    outgoingY,
    reduceMotion,
  ]);

  const incomingStyle = useAnimatedStyle(() => ({
    opacity: incomingOpacity.value,
    transform: [{ translateY: incomingY.value }],
  }));

  const outgoingStyle = useAnimatedStyle(() => ({
    opacity: outgoingOpacity.value,
    transform: [{ translateY: outgoingY.value }],
  }));

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.layer, incomingStyle]}>{children}</Animated.View>
      {outgoing ? (
        <Animated.View pointerEvents="none" style={[styles.outgoing, outgoingStyle]}>
          <ChoiceEntranceFrozen>{outgoing}</ChoiceEntranceFrozen>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 0,
  },
  layer: {
    flex: 1,
    minHeight: 0,
  },
  outgoing: {
    ...StyleSheet.absoluteFill,
  },
});
