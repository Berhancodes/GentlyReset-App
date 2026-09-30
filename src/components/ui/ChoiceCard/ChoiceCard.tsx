import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AppText } from '@/components/ui/Text';
import { colors, radius, shadows, spacing } from '@/design-system';
import {
  useSelectionFeedback,
  type SelectionHaptic,
} from '@/components/ui/ChoiceCard/SelectionFeedback';

export type ChoiceCardVariant = 'row' | 'tile' | 'illustrated';

export type ChoiceCardProps = {
  label: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  variant?: ChoiceCardVariant;
  leading?: ReactNode;
  /**
   * Illustrated tiles only. Tighter padding for a trial layout on one question.
   * Defaults stay unchanged for every other screen.
   */
  compact?: boolean;
  haptic?: SelectionHaptic;
  onPress: () => void;
};

const BADGE_SIZE = 20;
const BORDER_WIDTH = 2;

export function AnimatedChoiceCard({
  label,
  description,
  selected = false,
  disabled = false,
  variant = 'row',
  leading,
  compact = false,
  haptic = 'selection',
  onPress,
}: ChoiceCardProps) {
  const isTile = variant === 'tile';
  const isIllustrated = variant === 'illustrated';
  const idleBackground = isIllustrated ? colors.surface.raised : colors.surface.choice;
  const { onPressIn, onPressOut, cardMotionStyle, checkMotionStyle, iconMotionStyle } =
    useSelectionFeedback({
      selected,
      disabled,
      haptic,
      idleBackground,
    });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={description ? `${label}. ${description}` : label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      style={[styles.pressable, (isTile || isIllustrated) && styles.pressableFill]}
    >
      <Animated.View
        style={[
          styles.card,
          isIllustrated
            ? compact
              ? styles.illustratedCompact
              : styles.illustrated
            : isTile
              ? styles.tile
              : styles.row,
          isIllustrated ? shadows.whisper : !isTile ? shadows.soft : null,
          disabled && styles.disabled,
          cardMotionStyle,
        ]}
      >
        {leading ? (
          <Animated.View style={[styles.leading, iconMotionStyle]}>{leading}</Animated.View>
        ) : null}
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
          style={[styles.badge, checkMotionStyle]}
        >
          <View style={styles.check} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

/** Existing questionnaire screens import ChoiceCard; keep that name as the shared card. */
export const ChoiceCard = AnimatedChoiceCard;

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
  illustratedCompact: {
    minHeight: 100,
    flex: 1,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
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
    pointerEvents: 'none',
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
