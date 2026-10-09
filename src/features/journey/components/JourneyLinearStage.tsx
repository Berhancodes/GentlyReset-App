import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { motion } from '@/design-system';
import { JourneyHeroCopy } from '@/features/journey/components/JourneyHeroCopy';
import type { JourneyProgressionPresentation } from '@/features/journey/hooks/useJourneyProgression';

type JourneyLinearStageProps = {
  presentation: JourneyProgressionPresentation;
  focused: boolean;
  onPressDay: (day: number) => void;
  /** Fades the heading while the day sheet is open. */
  hidden: boolean;
  /** Day number shown in the heading. */
  day: number;
};

export function JourneyLinearStage({
  presentation: _presentation,
  focused: _focused,
  onPressDay: _onPressDay,
  hidden,
  day,
}: JourneyLinearStageProps) {
  const reduceMotion = useReducedMotion() === true;
  const visibility = useSharedValue(1);

  useEffect(() => {
    visibility.value = withTiming(hidden ? 0 : 1, {
      duration: reduceMotion ? 0 : motion.duration.screen,
    });
  }, [hidden, reduceMotion, visibility]);

  const visibilityStyle = useAnimatedStyle(() => ({ opacity: visibility.value }));

  return (
    <Animated.View
      // Let taps through to the mascot in the season scene underneath.
      pointerEvents="box-none"
      style={[styles.stage, visibilityStyle]}
    >
      <JourneyHeroCopy day={day} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
  },
});
