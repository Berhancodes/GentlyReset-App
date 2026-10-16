import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOut, useReducedMotion } from 'react-native-reanimated';

import { colors, fontFamilies, fontSizes, fontWeights, radius, spacing } from '@/design-system';
import type { FocusAreaId, NextSeasonOption } from '@/domain/reset/roadmap';
import {
  getDeeperLabel,
  getNextFocusLabel,
  getSeasonCompleteKicker,
  getSeasonCompleteLine,
} from '@/features/season/data/seasonCopy';

type SeasonCompleteCardProps = {
  seasonNumber: number;
  deeper: NextSeasonOption;
  next: NextSeasonOption;
  top: number;
  onChoose: (focusAreaId: FocusAreaId) => void;
};

/** After day 30: the season is done, and the user picks what the next one is about. */
export function SeasonCompleteCard({
  seasonNumber,
  deeper,
  next,
  top,
  onChoose,
}: SeasonCompleteCardProps) {
  const reduceMotion = useReducedMotion();
  const choices = [
    { option: next, label: getNextFocusLabel(next), primary: true },
    { option: deeper, label: getDeeperLabel(deeper), primary: false },
  ];

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInUp.springify().damping(14)}
      exiting={reduceMotion ? undefined : FadeOut}
      style={[styles.wrap, { top }]}
    >
      <View style={styles.card}>
        <Text style={styles.kicker} accessibilityRole="header" maxFontSizeMultiplier={1.3}>
          {getSeasonCompleteKicker(seasonNumber)}
        </Text>
        <Text style={styles.text} maxFontSizeMultiplier={1.3}>
          {getSeasonCompleteLine(seasonNumber)}
        </Text>
        <View style={styles.choices}>
          {choices.map((choice) => (
            <Pressable
              key={choice.label}
              accessibilityRole="button"
              accessibilityLabel={choice.label}
              accessibilityHint={`Starts season ${seasonNumber + 1}`}
              onPress={() => onChoose(choice.option.focusAreaId)}
              style={({ pressed }) => [
                styles.choice,
                choice.primary ? styles.choicePrimary : null,
                pressed ? styles.pressed : null,
              ]}
            >
              <Text
                style={[styles.choiceLabel, choice.primary ? styles.choiceLabelPrimary : null]}
                maxFontSizeMultiplier={1.3}
              >
                {choice.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.lg - 2,
    right: spacing.lg - 2,
    zIndex: 4,
  },
  card: {
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 3,
    borderColor: colors.room.ink,
    backgroundColor: colors.room.cream,
    shadowColor: colors.room.milestoneShadow,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  kicker: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs - 1,
    fontWeight: fontWeights.heavy,
    letterSpacing: 1.2,
    color: colors.room.kicker,
  },
  text: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md - 1,
    fontWeight: fontWeights.heavy,
    color: colors.room.ink,
  },
  choices: {
    gap: spacing.xs,
    paddingTop: spacing.xxs,
  },
  choice: {
    minHeight: spacing.hitTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 2.5,
    borderColor: colors.room.ink,
    backgroundColor: colors.room.butter,
  },
  choicePrimary: {
    backgroundColor: colors.room.ink,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  choiceLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.heavy,
    color: colors.room.ink,
    textAlign: 'center',
  },
  choiceLabelPrimary: {
    color: colors.room.cream,
  },
});
