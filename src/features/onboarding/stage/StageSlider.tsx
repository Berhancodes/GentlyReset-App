import { forwardRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  radius,
  spacing,
} from '@/design-system';
import type { OnboardingOption } from '@/features/onboarding/types/onboarding';

const KNOB = 30;
const TRACK = 6;
const DOT = 6;
const SNAP_MS = 140;

type StageSliderProps = {
  options: readonly OnboardingOption[];
  selectedIndex: number;
  accessibilityLabel: string;
  onChange: (index: number) => void;
  /** Shown above the track until something is picked; the knob rests in the middle. */
  unsetLabel?: string;
};

/**
 * A slim track with a dot per answer and a cream knob that snaps between them.
 * The label above is what flies to the mascot, so it takes the ref.
 */
export const StageSlider = forwardRef<View, StageSliderProps>(function StageSlider(
  { options, selectedIndex, accessibilityLabel, onChange, unsetLabel },
  labelRef,
) {
  const reduceMotion = useReducedMotion();
  const [trackWidth, setTrackWidth] = useState(0);
  const last = Math.max(1, options.length - 1);
  const knob = useSharedValue(Math.max(0, selectedIndex) / last);
  const answered = !(unsetLabel !== undefined && selectedIndex < 0);
  const shownIndex = answered ? selectedIndex : Math.round(last / 2);
  const selected = answered ? options[selectedIndex] : undefined;

  useEffect(() => {
    knob.value = withTiming(shownIndex / last, { duration: reduceMotion ? 0 : SNAP_MS });
  }, [knob, last, reduceMotion, shownIndex]);

  const pick = (x: number) => {
    if (trackWidth <= 0) {
      return;
    }
    const ratio = Math.min(1, Math.max(0, (x - KNOB / 2) / (trackWidth - KNOB)));
    const index = Math.round(ratio * last);
    if (index !== selectedIndex || !answered) {
      onChange(index);
    }
  };

  const gesture = Gesture.Simultaneous(
    Gesture.Pan()
      .runOnJS(true)
      .minDistance(0)
      .onBegin((event) => pick(event.x))
      .onUpdate((event) => pick(event.x)),
    Gesture.Tap()
      .runOnJS(true)
      .onEnd((event) => pick(event.x)),
  );

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: knob.value * Math.max(0, trackWidth - KNOB) }],
  }));
  const fillStyle = useAnimatedStyle(() => ({
    width: knob.value * Math.max(0, trackWidth - KNOB),
  }));

  return (
    <View style={styles.root}>
      <View ref={labelRef} style={styles.label}>
        <Text style={styles.labelText} maxFontSizeMultiplier={1.3}>
          {selected?.label ?? unsetLabel}
        </Text>
        {selected?.description ? (
          <Text style={styles.labelDetail} maxFontSizeMultiplier={1.3}>
            {selected.description}
          </Text>
        ) : null}
      </View>
      <GestureDetector gesture={gesture}>
        <View
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={accessibilityLabel}
          accessibilityValue={{ text: selected?.label }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === 'increment' && shownIndex < last) {
              onChange(answered ? shownIndex + 1 : shownIndex);
            }
            if (event.nativeEvent.actionName === 'decrement' && shownIndex > 0) {
              onChange(answered ? shownIndex - 1 : shownIndex);
            }
          }}
          style={styles.track}
          onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        >
          <View style={styles.rail} />
          <Animated.View style={[styles.fill, fillStyle]} />
          {options.map((option, index) => (
            <View
              key={option.id}
              style={[
                styles.dot,
                index < shownIndex ? styles.dotPassed : null,
                { left: KNOB / 2 + (Math.max(0, trackWidth - KNOB) * index) / last - DOT / 2 },
              ]}
            />
          ))}
          <Animated.View style={[styles.knob, knobStyle]} />
        </View>
      </GestureDetector>
      <View style={styles.ends}>
        <Text style={styles.endText} maxFontSizeMultiplier={1.3}>
          {options[0]?.label}
        </Text>
        <Text style={styles.endText} maxFontSizeMultiplier={1.3}>
          {options[options.length - 1]?.label}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    gap: spacing.xs,
  },
  label: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.nav,
    lineHeight: lineHeights.nav,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  labelDetail: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: fontWeights.semibold,
    color: colors.text.helper,
    textAlign: 'center',
  },
  track: {
    height: spacing.hitTarget,
    justifyContent: 'center',
  },
  rail: {
    position: 'absolute',
    left: KNOB / 2,
    right: KNOB / 2,
    height: TRACK,
    borderRadius: radius.pill,
    backgroundColor: colors.stage.track,
  },
  fill: {
    position: 'absolute',
    left: KNOB / 2,
    height: TRACK,
    borderRadius: radius.pill,
    backgroundColor: colors.stage.trackFill,
  },
  dot: {
    position: 'absolute',
    width: DOT,
    height: DOT,
    borderRadius: radius.pill,
    backgroundColor: colors.stage.trackDot,
  },
  dotPassed: {
    backgroundColor: colors.stage.trackDotPassed,
  },
  knob: {
    position: 'absolute',
    left: 0,
    width: KNOB,
    height: KNOB,
    borderRadius: radius.pill,
    borderWidth: 2.5,
    borderColor: colors.stage.trackFill,
    backgroundColor: colors.stage.knob,
    shadowColor: colors.stage.chipShadow,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  ends: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxs,
  },
  endText: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.tab,
    lineHeight: lineHeights.tab,
    fontWeight: fontWeights.bold,
    color: colors.text.helper,
  },
});
