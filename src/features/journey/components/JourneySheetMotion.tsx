import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type AccessibilityState } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { MascotIcon } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';

/** Gap between sections gliding in, and the first section's wait for the sheet. */
const REVEAL_STAGGER_MS = 45;
const REVEAL_DELAY_MS = 90;
const REVEAL_RISE = 14;
const PRESS_SCALE = 0.98;
/** Height of the darker lip under the main button. */
const BUTTON_LIP = 4;
const SOFT_SPRING = { damping: 18, stiffness: 220 } as const;
const POP_SPRING = { damping: 9, stiffness: 320 } as const;

/** Fades and rises a section into place after the sheet opens, in order. */
export function Reveal({
  visible,
  order,
  children,
}: {
  visible: boolean;
  order: number;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    if (!visible) {
      progress.value = 0;
      return;
    }
    progress.value = reduceMotion
      ? 1
      : withDelay(
          REVEAL_DELAY_MS + order * REVEAL_STAGGER_MS,
          withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) }),
        );
  }, [order, progress, reduceMotion, visible]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * REVEAL_RISE }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

/** Pressable that sinks very slightly while held. */
export function PressableScale({
  children,
  onPress,
  onLayoutChange,
  accessibilityRole,
  accessibilityState,
  accessibilityLabel,
  accessibilityHint,
  style,
  disabled = false,
}: {
  children: ReactNode;
  onPress: () => void;
  /** Done rows stop responding to presses. */
  disabled?: boolean;
  onLayoutChange?: (layout: { y: number; height: number; width: number }) => void;
  accessibilityRole: 'checkbox' | 'button';
  accessibilityState?: AccessibilityState;
  accessibilityLabel: string;
  accessibilityHint?: string;
  style: object;
}) {
  const reduceMotion = useReducedMotion();
  const [pressed, setPressed] = useState(false);
  const animatedStyle = usePressScaleStyle(pressed && !reduceMotion);

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onLayout={(event) => onLayoutChange?.(event.nativeEvent.layout)}
      disabled={disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}

/** Springs to a slightly smaller scale while `pressed`. */
function usePressScaleStyle(pressed: boolean) {
  const pressScale = useSharedValue(1);

  useEffect(() => {
    pressScale.value = withSpring(pressed ? PRESS_SCALE : 1, SOFT_SPRING);
  }, [pressScale, pressed]);

  return useAnimatedStyle(() => ({ transform: [{ scale: pressScale.value }] }));
}

/** Round tick box that pops when it becomes checked. */
export function PopCheckBox({ checked, size }: { checked: boolean; size: number }) {
  const reduceMotion = useReducedMotion();
  const pop = useSharedValue(1);
  const wasChecked = useRef(checked);

  useEffect(() => {
    if (checked && !wasChecked.current && !reduceMotion) {
      pop.value = withSequence(withTiming(0.7, { duration: 70 }), withSpring(1, POP_SPRING));
    }
    wasChecked.current = checked;
  }, [checked, pop, reduceMotion]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));

  return (
    <Animated.View
      style={[styles.box, { width: size, height: size }, checked ? styles.boxChecked : null, style]}
    >
      {checked ? <MascotIcon name="check" size={size * 0.56} color={colors.text.inverse} /> : null}
    </Animated.View>
  );
}

/** Thin bar under "TODAY" that fills as steps are ticked. */
export function StepsProgressBar({ fraction }: { fraction: number }) {
  const reduceMotion = useReducedMotion();
  const [trackWidth, setTrackWidth] = useState(0);
  const fill = useSharedValue(fraction);

  useEffect(() => {
    fill.value = reduceMotion ? fraction : withSpring(fraction, SOFT_SPRING);
  }, [fill, fraction, reduceMotion]);

  const style = useAnimatedStyle(() => ({ width: trackWidth * fill.value }));

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={styles.track}
      onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
    >
      <Animated.View style={[styles.trackFill, style]} />
    </View>
  );
}

/**
 * Duolingo-style raised button: the face sits on a darker lip and sinks into it
 * while pressed. `celebrate` gives one gentle pulse when it becomes true.
 */
export function TactileButton({
  children,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  celebrate,
  disabled = false,
}: {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  celebrate: boolean;
  /** Faded and not pressable. */
  disabled?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const press = useSharedValue(0);
  const pulse = useSharedValue(1);
  const wasCelebrating = useRef(celebrate);

  useEffect(() => {
    if (celebrate && !wasCelebrating.current && !reduceMotion) {
      pulse.value = withSequence(
        withTiming(1.04, { duration: 160, easing: Easing.out(Easing.quad) }),
        withSpring(1, POP_SPRING),
      );
    }
    wasCelebrating.current = celebrate;
  }, [celebrate, pulse, reduceMotion]);

  const wrapStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: press.value * BUTTON_LIP }],
  }));

  return (
    <Animated.View style={wrapStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPressIn={() => {
          press.value = reduceMotion ? 1 : withTiming(1, { duration: 60 });
        }}
        onPressOut={() => {
          press.value = reduceMotion ? 0 : withSpring(0, SOFT_SPRING);
        }}
        onPress={onPress}
        style={[styles.buttonWrap, disabled ? styles.buttonDisabled : null]}
      >
        <View style={styles.buttonLip} />
        <Animated.View style={[styles.buttonFace, faceStyle]}>{children}</Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.journeySteps.boxBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    borderColor: colors.journeySteps.boxChecked,
    backgroundColor: colors.journeySteps.boxChecked,
  },
  track: {
    height: spacing.xxs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.journeySheet.progressTrack,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.journeySheet.progressFill,
  },
  buttonWrap: {
    paddingBottom: BUTTON_LIP,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonLip: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: BUTTON_LIP,
    bottom: 0,
    borderRadius: radius.pill,
    backgroundColor: colors.journeySheet.buttonLip,
  },
  buttonFace: {
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: spacing.hitTarget + spacing.sm,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.journeySheet.button,
    paddingHorizontal: spacing.lg,
  },
});
