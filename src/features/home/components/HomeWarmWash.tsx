import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/design-system';

const FADE_MS = 1200;

/** Once today is checked in, the top of the sky warms a little for the rest of the day. */
export function HomeWarmWash({ warm }: { warm: boolean }) {
  const reduceMotion = useReducedMotion();
  const level = useSharedValue(warm ? 1 : 0);

  useEffect(() => {
    level.value = withTiming(warm ? 1 : 0, { duration: reduceMotion ? 0 : FADE_MS });
  }, [level, reduceMotion, warm]);

  const style = useAnimatedStyle(() => ({ opacity: level.value }));

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[StyleSheet.absoluteFill, style]}
    >
      <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1 1">
        <Defs>
          <LinearGradient id="warmWash" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.stage.chipSelected} stopOpacity={0.55} />
            <Stop offset="0.55" stopColor={colors.stage.chipSelected} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="1" height="1" fill="url(#warmWash)" />
      </Svg>
    </Animated.View>
  );
}
