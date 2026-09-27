import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { motion, spacing } from '@/design-system';
import { splitJourneyTaskTitle } from '@/features/journey/layout/journeyStageLayout';

type JourneyHeroCopyProps = {
  day: number;
  title: string;
};

type HeroCopy = {
  day: number;
  title: string;
};

export function JourneyHeroCopy({ day, title }: JourneyHeroCopyProps) {
  const reduceMotion = useReducedMotion() === true;
  const progress = useSharedValue(1);
  const [shown, setShown] = useState<HeroCopy>({ day, title });
  const [leaving, setLeaving] = useState<HeroCopy>({ day, title });
  const hasMounted = useRef(false);

  if (day !== shown.day || title !== shown.title) {
    setLeaving(shown);
    setShown({ day, title });
  }

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      progress.value = 1;
      return;
    }

    if (reduceMotion) {
      progress.value = 1;
      return;
    }

    progress.value = 0;
    progress.value = withTiming(1, {
      duration: motion.duration.journeyProgressHeading,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, reduceMotion, shown.day, shown.title]);

  const outgoingStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ translateY: -motion.offset.journeyHeadingShift * progress.value }],
  }));
  const incomingStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: motion.offset.journeyHeadingShift * (1 - progress.value) }],
  }));

  return (
    <View style={styles.titleBlock}>
      <View>
        <Animated.View pointerEvents="none" style={[styles.outgoing, outgoingStyle]}>
          <HeroLines day={leaving.day} title={leaving.title} />
        </Animated.View>
        <Animated.View style={incomingStyle}>
          <HeroLines day={shown.day} title={shown.title} />
        </Animated.View>
      </View>
    </View>
  );
}

function HeroLines({ day, title }: HeroCopy) {
  const lines = splitJourneyTaskTitle(title);

  return (
    <View style={styles.copy}>
      <AppText variant="journeyDay" color="primary" align="center">
        {`day ${day}`}
      </AppText>
      <View style={styles.titleLines}>
        {lines.map((line) => (
          <AppText key={line} variant="journeyTask" color="primary" align="center">
            {line}
          </AppText>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    zIndex: 2,
  },
  outgoing: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  copy: {
    alignItems: 'center',
    gap: spacing.md,
  },
  titleLines: {
    alignItems: 'center',
  },
});
