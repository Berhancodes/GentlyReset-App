import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { lineHeights, spacing } from '@/design-system';

type JourneyHeroCopyProps = {
  day: number;
};

/** One line's height; the old number slides this far up as the new one arrives. */
const ROLL_DISTANCE = lineHeights.journeyDay;
const ROLL_SPRING = { damping: 14, stiffness: 160 } as const;

/** "Day N" heading. When N changes, only the number rolls up to the new one. */
export function JourneyHeroCopy({ day }: JourneyHeroCopyProps) {
  return (
    <View style={styles.titleBlock}>
      <View
        style={styles.row}
        accessible
        accessibilityRole="header"
        accessibilityLabel={`Day ${day}`}
      >
        <AppText variant="journeyDay" color="primary">
          {'Day '}
        </AppText>
        <RollingNumber value={day} />
      </View>
    </View>
  );
}

function RollingNumber({ value }: { value: number }) {
  const reduceMotion = useReducedMotion() === true;
  const [shown, setShown] = useState({ latest: value, previous: value });
  const roll = useSharedValue(1);
  const hasMounted = useRef(false);

  if (value !== shown.latest) {
    setShown({ latest: value, previous: shown.latest });
  }

  useEffect(() => {
    if (!hasMounted.current || reduceMotion) {
      hasMounted.current = true;
      roll.value = 1;
      return;
    }
    roll.value = 0;
    roll.value = withSpring(1, ROLL_SPRING);
  }, [reduceMotion, roll, shown.latest]);

  const outgoingStyle = useAnimatedStyle(() => ({
    opacity: Math.max(0, 1 - roll.value * 1.4),
    transform: [{ translateY: -roll.value * ROLL_DISTANCE }],
  }));
  const incomingStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, roll.value * 1.4),
    transform: [{ translateY: (1 - roll.value) * ROLL_DISTANCE }],
  }));

  return (
    <View style={styles.numberClip}>
      {shown.previous !== shown.latest ? (
        <Animated.View pointerEvents="none" style={[styles.outgoing, outgoingStyle]}>
          <AppText variant="journeyDay" color="primary">
            {`${shown.previous}`}
          </AppText>
        </Animated.View>
      ) : null}
      <Animated.View style={incomingStyle}>
        <AppText variant="journeyDay" color="primary">
          {`${shown.latest}`}
        </AppText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    // Optical nudge: the heavy "D" and thin "1" make the exact center read as left-leaning.
    transform: [{ translateX: spacing.xs }],
    paddingHorizontal: spacing.lg,
    zIndex: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  /** Hides the numbers outside their own line while they roll. */
  numberClip: {
    height: ROLL_DISTANCE,
    overflow: 'hidden',
  },
  outgoing: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
