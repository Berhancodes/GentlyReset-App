import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/Text';
import { colors, motion, radius, shadows, spacing } from '@/design-system';
import { hapticSelection, hapticSuccess } from '@/utils/haptics';

export type ChoiceCardVariant = 'row' | 'tile' | 'illustrated';

export type ChoiceCardProps = {
  label: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  variant?: ChoiceCardVariant;
  leading?: ReactNode;
  haptic?: 'selection' | 'success' | 'none';
  onPress: () => void;
};

const BADGE_SIZE = 20;
const BORDER_WIDTH = 2;
const CHECK_DURATION_MS = motion.duration.selection;

export function ChoiceCard({
  label,
  description,
  selected = false,
  disabled = false,
  variant = 'row',
  leading,
  haptic = 'selection',
  onPress,
}: ChoiceCardProps) {
  const isTile = variant === 'tile';
  const isIllustrated = variant === 'illustrated';
  const idleBackground = isIllustrated ? colors.surface.raised : colors.surface.choice;
  const reduceMotion = useReducedMotion();
  const selectedProgress = useSharedValue(selected ? 1 : 0);
  const pressScale = useSharedValue(1);
  const previousSelected = useRef(selected);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    selectedProgress.value = withTiming(selected ? 1 : 0, {
      duration: reduceMotion ? 0 : CHECK_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [reduceMotion, selected, selectedProgress]);

  useEffect(() => {
    if (reduceMotion) {
      pressScale.value = withTiming(pressed ? motion.scale.press : 1, { duration: 0 });
      return;
    }

    pressScale.value = pressed
      ? withTiming(motion.scale.press, {
          duration: motion.duration.press,
          easing: Easing.out(Easing.quad),
        })
      : withSpring(1, motion.spring.release);
  }, [pressScale, pressed, reduceMotion]);

  useEffect(() => {
    const becameSelected = selected && !previousSelected.current;
    previousSelected.current = selected;

    if (!becameSelected) {
      return;
    }

    if (haptic === 'selection') {
      void hapticSelection();
    }
    if (haptic === 'success') {
      void hapticSuccess();
    }
  }, [haptic, selected]);

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
    transform: [{ scale: pressScale.value }],
  }));

  const badgeMotionStyle = useAnimatedStyle(() => ({
    opacity: selectedProgress.value,
    transform: [
      {
        scale: interpolate(selectedProgress.value, [0, 1], [motion.scale.checkFrom, 1]),
      },
    ],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={description ? `${label}. ${description}` : label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPressIn={() => {
        if (!disabled) {
          setPressed(true);
        }
      }}
      onPressOut={() => {
        setPressed(false);
      }}
      onPress={onPress}
      style={[styles.pressable, (isTile || isIllustrated) && styles.pressableFill]}
    >
      <Animated.View
        style={[
          styles.card,
          isIllustrated ? styles.illustrated : isTile ? styles.tile : styles.row,
          isIllustrated ? shadows.whisper : !isTile ? shadows.soft : null,
          disabled && styles.disabled,
          cardMotionStyle,
        ]}
      >
        {leading ? <View style={styles.leading}>{leading}</View> : null}
        <View style={[styles.copy, (isTile || isIllustrated) && styles.copyTile]}>
          <AppText
            variant={
              description
                ? 'onboardingChoiceTitle'
                : isTile || isIllustrated
                  ? 'onboardingChoice'
                  : 'onboardingChoiceTitle'
            }
            color={disabled ? 'muted' : 'primary'}
            align={isTile || isIllustrated ? 'center' : 'left'}
            numberOfLines={isIllustrated ? 3 : undefined}
          >
            {label}
          </AppText>
          {description ? (
            <AppText
              variant="onboardingChoiceSubtitle"
              color="secondary"
              align={isTile ? 'center' : 'left'}
            >
              {description}
            </AppText>
          ) : null}
        </View>
        <Animated.View
          accessibilityElementsHidden
          importantForAccessibility="no"
          pointerEvents="none"
          style={[styles.badge, badgeMotionStyle]}
        >
          <View style={styles.check} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'stretch',
  },
  pressableFill: {
    flex: 1,
  },
  card: {
    borderRadius: radius.card,
    borderWidth: BORDER_WIDTH,
    overflow: 'visible',
  },
  row: {
    minHeight: 74,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tile: {
    minHeight: 129,
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  illustrated: {
    minHeight: 124,
    flex: 1,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing.xs,
  },
  disabled: {
    opacity: 0.55,
  },
  leading: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  copyTile: {
    flex: 0,
    alignItems: 'center',
    width: '100%',
  },
  badge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: radius.pill,
    backgroundColor: colors.tint.choiceBadge,
    borderWidth: 1.5,
    borderColor: colors.border.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 8,
    height: 4,
    marginTop: -1,
    borderLeftWidth: 1.8,
    borderBottomWidth: 1.8,
    borderColor: colors.text.primary,
    transform: [{ rotate: '-45deg' }],
  },
});
