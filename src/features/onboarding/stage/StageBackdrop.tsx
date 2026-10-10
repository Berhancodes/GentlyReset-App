import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/design-system';

/** The stage's soft warm sky, fading into the cream floor. */
export function StageBackdrop() {
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      aria-hidden
      preserveAspectRatio="none"
      viewBox="0 0 1 1"
    >
      <Defs>
        <LinearGradient id="stageSky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.stage.sky} />
          <Stop offset="0.6" stopColor={colors.stage.floor} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="1" height="1" fill="url(#stageSky)" />
    </Svg>
  );
}
