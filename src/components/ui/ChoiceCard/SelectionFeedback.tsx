import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors, getChoiceStaggerDelay, motion } from '@/design-system';
import { hapticDeselection, hapticSelection, hapticSuccess } from '@/utils/haptics';

export type SelectionHaptic = 'selection' | 'success' | 'none';

const ChoiceEntranceRegistryContext = createContext<(() => number) | null>(null);
const ChoiceEntranceActiveContext = createContext(true);

/**
 * Assigns stable 0-based stagger indices to descendant choice cards.
 * Remount with the question so numbering starts at 0.
 */
export function ChoiceEntranceScope({ children }: { children: ReactNode }) {
  const nextIndex = useRef(0);

  const register = useCallback(() => {
    const index = nextIndex.current;
    nextIndex.current += 1;
    return index;
  }, []);

  return (
    <ChoiceEntranceRegistryContext.Provider value={register}>
      {children}
    </ChoiceEntranceRegistryContext.Provider>
  );
}

/** Outgoing question snapshots should not replay card entrance. */
export function ChoiceEntranceFrozen({ children }: { children: ReactNode }) {
  return (
    <ChoiceEntranceActiveContext.Provider value={false}>
      {children}
    </ChoiceEntranceActiveContext.Provider>
  );
}

export function useChoiceEntranceIndex(): number {
  const register = useContext(ChoiceEntranceRegistryContext);
  const [index] = useState(() => register?.() ?? 0);
  return index;
}

type UseSelectionFeedbackArgs = {
  selected: boolean;
  disabled: boolean;
  haptic: SelectionHaptic;
  idleBackground: string;
};

export function useSelectionFeedback({
  selected,
  disabled,
  haptic,
  idleBackground,
}: UseSelectionFeedbackArgs) {
  const reduceMotion = useReducedMotion();
  const entranceActive = useContext(ChoiceEntranceActiveContext);
  const entranceIndex = useChoiceEntranceIndex();
  const selectedProgress = useSharedValue(selected ? 1 : 0);
  const pressAmount = useSharedValue(0);
  const checkScale = useSharedValue(selected ? 1 : motion.scale.checkFrom);
  const iconScale = useSharedValue(1);
  const entranceY = useSharedValue(
    reduceMotion || !entranceActive ? 0 : motion.offset.choiceEntrance,
  );
  const previousSelected = useRef(selected);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    selectedProgress.value = withTiming(selected ? 1 : 0, {
      duration: reduceMotion ? 0 : motion.duration.choiceFill,
      easing: Easing.out(Easing.cubic),
    });

    if (reduceMotion) {
      checkScale.value = selected ? 1 : motion.scale.checkFrom;
      iconScale.value = 1;
      return;
    }

    if (selected) {
      checkScale.value = withSpring(1, motion.spring.check);
      if (!previousSelected.current) {
        const riseMs = Math.round(motion.duration.iconReact * 0.44);
        const settleMs = motion.duration.iconReact - riseMs;
        iconScale.value = withSequence(
          withTiming(motion.scale.iconSelect, {
            duration: riseMs,
            easing: Easing.out(Easing.quad),
          }),
          withTiming(1, { duration: settleMs, easing: Easing.inOut(Easing.quad) }),
        );
      }
    } else {
      checkScale.value = withTiming(motion.scale.checkFrom, {
        duration: motion.duration.selection,
        easing: Easing.out(Easing.quad),
      });
    }
  }, [checkScale, iconScale, reduceMotion, selected, selectedProgress]);

  useEffect(() => {
    const becameSelected = selected && !previousSelected.current;
    const becameUnselected = !selected && previousSelected.current;
    previousSelected.current = selected;

    if (haptic === 'none') {
      return;
    }

    if (becameSelected) {
      if (haptic === 'success') {
        void hapticSuccess();
        return;
      }
      void hapticSelection();
      return;
    }

    if (becameUnselected) {
      void hapticDeselection();
    }
  }, [haptic, selected]);

  useEffect(() => {
    if (!entranceActive || reduceMotion) {
      entranceY.value = 0;
      return;
    }

    entranceY.value = motion.offset.choiceEntrance;
    entranceY.value = withDelay(
      getChoiceStaggerDelay(entranceIndex, false),
      withTiming(0, {
        duration: motion.duration.choiceEntrance,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [entranceActive, entranceIndex, entranceY, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      pressAmount.value = withTiming(pressed ? 1 : 0, { duration: 0 });
      return;
    }

    pressAmount.value = pressed
      ? withTiming(1, {
          duration: motion.duration.pressDown,
          easing: Easing.out(Easing.quad),
        })
      : withSpring(0, motion.spring.release);
  }, [pressAmount, pressed, reduceMotion]);

  const onPressIn = useCallback(() => {
    if (!disabled) {
      setPressed(true);
    }
  }, [disabled]);

  const onPressOut = useCallback(() => {
    setPressed(false);
  }, []);

  const cardMotionStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      selectedProgress.value,
      [0, 1],
      [idleBackground, colors.surface.choiceSelected],
    ),
    borderColor: interpolateColor(
      selectedProgress.value,
      [0, 1],
      [colors.border.default, colors.border.choiceSelected],
    ),
    transform: [
      {
        translateY:
          entranceY.value + interpolate(pressAmount.value, [0, 1], [0, motion.offset.pressDown]),
      },
      {
        scale: interpolate(pressAmount.value, [0, 1], [1, motion.scale.press]),
      },
    ],
  }));

  const checkMotionStyle = useAnimatedStyle(() => ({
    opacity: selectedProgress.value,
    transform: [{ scale: checkScale.value }],
  }));

  const iconMotionStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return {
    onPressIn,
    onPressOut,
    cardMotionStyle,
    checkMotionStyle,
    iconMotionStyle,
  };
}
