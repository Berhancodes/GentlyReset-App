import { createContext, useContext, useLayoutEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { MOTION_EASING_STANDARD, motion } from '@/design-system/motion';

const StageOutgoingContext = createContext(false);

/** True inside the screen that is sliding away; it must not drive the mascot. */
export function useIsOutgoingStage(): boolean {
  return useContext(StageOutgoingContext);
}

type StageTransitionProps = {
  contentKey: string;
  outgoingKey?: string;
  outgoing?: ReactNode;
  onSettled: () => void;
  children: ReactNode;
};

const slideEasing = Easing.bezier(
  MOTION_EASING_STANDARD[0],
  MOTION_EASING_STANDARD[1],
  MOTION_EASING_STANDARD[2],
  MOTION_EASING_STANDARD[3],
);

/**
 * The question copy and answers slide sideways while the mascot stays put:
 * outgoing moves left and fades, incoming arrives from the right.
 */
export function StageTransition({
  contentKey,
  outgoingKey,
  outgoing,
  onSettled,
  children,
}: StageTransitionProps) {
  const reduceMotion = useReducedMotion();
  const incoming = useSharedValue(1);
  const leaving = useSharedValue(0);

  useLayoutEffect(() => {
    if (!outgoingKey || reduceMotion) {
      incoming.value = 1;
      leaving.value = 1;
      return;
    }
    incoming.value = 0;
    leaving.value = 0;
    leaving.value = withTiming(1, { duration: motion.duration.stageLeave, easing: slideEasing });
    incoming.value = withTiming(
      1,
      { duration: motion.duration.stageEnter, easing: slideEasing },
      (finished) => {
        if (finished) {
          runOnJS(onSettled)();
        }
      },
    );
  }, [contentKey, incoming, leaving, onSettled, outgoingKey, reduceMotion]);

  const incomingStyle = useAnimatedStyle(() => ({
    opacity: incoming.value,
    transform: [{ translateX: (1 - incoming.value) * motion.offset.stageSlide }],
  }));

  const outgoingStyle = useAnimatedStyle(() => ({
    opacity: 1 - leaving.value,
    transform: [{ translateX: -leaving.value * motion.offset.stageSlide }],
  }));

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.layer, incomingStyle]}>{children}</Animated.View>
      {outgoing ? (
        <Animated.View pointerEvents="none" style={[styles.outgoing, outgoingStyle]}>
          <StageOutgoingContext.Provider value={true}>{outgoing}</StageOutgoingContext.Provider>
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
