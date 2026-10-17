import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';

import { colors, fontFamilies, fontWeights } from '@/design-system';

const C = colors.stage.nap;
const INK = colors.stage.bubbleBorder;

/** The armchair art is drawn in a 220 × 200 box. */
const CHAIR_VIEW_WIDTH = 220;
const CHAIR_VIEW_HEIGHT = 200;
/** The chair is this much wider than he is. */
export const NAP_CHAIR_WIDTH_RATIO = 1.57;
/** How far up the chair he sits, as a share of its height (on the seat cushion). */
export const NAP_SEAT_RISE = 0.23;
const TABLE_VIEW_WIDTH = 70;
const TABLE_VIEW_HEIGHT = 100;
/** The side table is this share of the chair's height. */
const TABLE_HEIGHT_RATIO = 0.5;
const ZZZ_CYCLE_MS = 3000;
const ZZZ_RISE = 26;

export function napChairSize(mascotWidth: number): { width: number; height: number } {
  const width = mascotWidth * NAP_CHAIR_WIDTH_RATIO;
  return { width, height: (width * CHAIR_VIEW_HEIGHT) / CHAIR_VIEW_WIDTH };
}

type JourneyNapChairProps = {
  centerX: number;
  bottom: number;
  width: number;
  height: number;
};

/** The armchair he naps in once today is checked in, with a side table and a warm mug. */
export function JourneyNapChair({ centerX, bottom, width, height }: JourneyNapChairProps) {
  const tableHeight = height * TABLE_HEIGHT_RATIO;
  const tableWidth = (tableHeight * TABLE_VIEW_WIDTH) / TABLE_VIEW_HEIGHT;
  return (
    <>
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${CHAIR_VIEW_WIDTH} ${CHAIR_VIEW_HEIGHT}`}
        style={[styles.absolute, { left: centerX - width / 2, bottom }]}
      >
        <Path
          d="M30 30 Q30 6 60 6 H160 Q190 6 190 30 V120 H30 Z"
          fill={C.chair}
          stroke={INK}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <Path d="M70 20 V110 M110 18 V110 M150 20 V110" stroke={C.stripe} strokeWidth={3} />
        <Rect
          x={34}
          y={112}
          width={152}
          height={40}
          rx={14}
          fill={C.seat}
          stroke={INK}
          strokeWidth={4}
        />
        <Rect
          x={4}
          y={78}
          width={46}
          height={90}
          rx={20}
          fill={C.chair}
          stroke={INK}
          strokeWidth={4}
        />
        <Rect
          x={170}
          y={78}
          width={46}
          height={90}
          rx={20}
          fill={C.chair}
          stroke={INK}
          strokeWidth={4}
        />
        <Rect
          x={20}
          y={166}
          width={14}
          height={26}
          rx={5}
          fill={C.woodDark}
          stroke={INK}
          strokeWidth={3}
        />
        <Rect
          x={186}
          y={166}
          width={14}
          height={26}
          rx={5}
          fill={C.woodDark}
          stroke={INK}
          strokeWidth={3}
        />
      </Svg>
      <Svg
        width={tableWidth}
        height={tableHeight}
        viewBox={`0 0 ${TABLE_VIEW_WIDTH} ${TABLE_VIEW_HEIGHT}`}
        style={[styles.absolute, { left: centerX + width / 2 - tableWidth * 0.1, bottom }]}
      >
        <Rect
          x={4}
          y={34}
          width={62}
          height={12}
          rx={5}
          fill={C.wood}
          stroke={INK}
          strokeWidth={3}
        />
        <Rect x={30} y={44} width={10} height={52} fill={C.woodDark} stroke={INK} strokeWidth={3} />
        <Rect
          x={20}
          y={12}
          width={26}
          height={22}
          rx={6}
          fill={C.mug}
          stroke={INK}
          strokeWidth={3}
        />
        <Path d="M46 16 q10 6 0 14" fill="none" stroke={INK} strokeWidth={3} />
        <Path
          d="M28 6 q-3 -4 0 -8 M37 6 q-3 -4 0 -8"
          stroke={C.steam}
          strokeWidth={2}
          fill="none"
        />
      </Svg>
    </>
  );
}

type SleepyZProps = { delay: number; size: number; left: number; bottom: number };

function SleepyZ({ delay, size, left, bottom }: SleepyZProps) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: ZZZ_CYCLE_MS, easing: Easing.out(Easing.quad) }), -1),
    );
  }, [delay, progress, reduceMotion]);

  const style = useAnimatedStyle(() =>
    reduceMotion
      ? { opacity: 0.7 }
      : {
          opacity: progress.value < 0.3 ? progress.value / 0.3 : 1 - (progress.value - 0.3) / 0.7,
          transform: [
            { translateX: progress.value * 14 },
            { translateY: -progress.value * ZZZ_RISE },
          ],
        },
  );

  return (
    <Animated.View style={[styles.absolute, { left, bottom }, style]}>
      <Text style={[styles.zzz, { fontSize: size }]}>z</Text>
    </Animated.View>
  );
}

/** Three Zs drifting up from his head while he naps. */
export function JourneySleepyZs({ left, bottom }: { left: number; bottom: number }) {
  return (
    <>
      <SleepyZ delay={0} size={18} left={left} bottom={bottom} />
      <SleepyZ delay={1000} size={21} left={left + 10} bottom={bottom + 10} />
      <SleepyZ delay={2000} size={24} left={left + 22} bottom={bottom + 22} />
    </>
  );
}

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
  zzz: {
    fontFamily: fontFamilies.rounded,
    fontWeight: fontWeights.heavy,
    color: C.zzz,
  },
});
