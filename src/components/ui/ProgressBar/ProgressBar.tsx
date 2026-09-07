import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, radius } from '@/design-system';

const FILL_DURATION_MS = 300;

type ProgressBarProps = {
  progress: number;
  /**
   * Where the fill should start after remounting, so step transitions
   * can animate from the previous value instead of 0.
   */
  initialProgress?: number;
  accessibilityLabel?: string;
};

export function ProgressBar({
  progress,
  initialProgress = 0,
  accessibilityLabel = 'Onboarding progress',
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const clampedInitial = Math.min(1, Math.max(0, initialProgress));
  const [trackWidth, setTrackWidth] = useState(0);
  const fillWidth = useSharedValue(0);
  const hasInitialized = useRef(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (trackWidth <= 0) {
      return;
    }

    if (!hasInitialized.current) {
      fillWidth.value = trackWidth * clampedInitial;
      hasInitialized.current = true;
    }

    fillWidth.value = withTiming(trackWidth * clamped, {
      duration: reduceMotion ? 0 : FILL_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped, clampedInitial, fillWidth, reduceMotion, trackWidth]);

  const fillStyle = useAnimatedStyle(() => ({
    width: fillWidth.value,
  }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{
        min: 0,
        max: 100,
        now: Math.round(clamped * 100),
      }}
      onLayout={(event) => {
        setTrackWidth(event.nativeEvent.layout.width);
      }}
      style={styles.track}
    >
      <Animated.View style={[styles.fill, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.progress.track,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.progress.fill,
  },
});
