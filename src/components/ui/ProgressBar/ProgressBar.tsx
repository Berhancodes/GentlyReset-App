import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, radius, spacing } from '@/design-system';

type ProgressBarProps = {
  progress: number;
  accessibilityLabel?: string;
};

export function ProgressBar({
  progress,
  accessibilityLabel = 'Onboarding progress',
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const [trackWidth, setTrackWidth] = useState(0);
  const fillWidth = useSharedValue(0);

  useEffect(() => {
    fillWidth.value = withTiming(trackWidth * clamped, { duration: 280 });
  }, [clamped, fillWidth, trackWidth]);

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
    height: spacing.xs,
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
