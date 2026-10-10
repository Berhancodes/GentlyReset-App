import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

const CLOUD = require('../../../../assets/home/home-cloud-small.png');
const CLOUD_ASPECT = 56 / 99;
/**
 * Two far-off clouds crossing the sky very slowly. `top` is a fraction of the
 * screen height, `width` a fraction of its width; each takes `ms` to cross.
 */
const CLOUDS = [
  { top: 0.2, width: 0.2, ms: 70000, delay: 0, opacity: 0.55 },
  { top: 0.34, width: 0.14, ms: 95000, delay: 30000, opacity: 0.4 },
] as const;

/** Soft clouds drifting left to right behind the greeting, far slower than you notice. */
export function HomeDriftingClouds() {
  const reduceMotion = useReducedMotion();
  const { width, height } = useWindowDimensions();

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}
    >
      {CLOUDS.map((cloud) => (
        <DriftingCloud
          key={cloud.ms}
          screenWidth={width}
          top={cloud.top * height}
          cloudWidth={cloud.width * width}
          ms={cloud.ms}
          delay={cloud.delay}
          opacity={cloud.opacity}
          still={reduceMotion}
        />
      ))}
    </View>
  );
}

type DriftingCloudProps = {
  screenWidth: number;
  top: number;
  cloudWidth: number;
  ms: number;
  delay: number;
  opacity: number;
  still: boolean;
};

function DriftingCloud({
  screenWidth,
  top,
  cloudWidth,
  ms,
  delay,
  opacity,
  still,
}: DriftingCloudProps) {
  // 0 is just off the left edge, 1 just off the right. Each cloud starts part-way across.
  const progress = useSharedValue(delay === 0 ? 0.35 : 0.1);

  useEffect(() => {
    if (still) {
      return;
    }
    const start = progress.value;
    progress.value = withTiming(1, { duration: ms * (1 - start), easing: Easing.linear }, () => {
      progress.value = 0;
      progress.value = withDelay(
        delay,
        withRepeat(withTiming(1, { duration: ms, easing: Easing.linear }), -1, false),
      );
    });
  }, [delay, ms, progress, still]);

  const style = useCloudStyle(progress, screenWidth, cloudWidth);

  return (
    <Animated.Image
      source={CLOUD}
      resizeMode="contain"
      style={[
        styles.cloud,
        { top, width: cloudWidth, height: cloudWidth * CLOUD_ASPECT, opacity },
        style,
      ]}
    />
  );
}

function useCloudStyle(progress: SharedValue<number>, screenWidth: number, cloudWidth: number) {
  return useAnimatedStyle(() => ({
    transform: [{ translateX: -cloudWidth + progress.value * (screenWidth + cloudWidth) }],
  }));
}

const styles = StyleSheet.create({
  cloud: {
    position: 'absolute',
    left: 0,
  },
});
