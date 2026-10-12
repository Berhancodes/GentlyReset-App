import { Pressable, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, fontFamilies, fontSizes, fontWeights, radius, spacing } from '@/design-system';

type SeasonPillProps = {
  label: string;
  onPress: () => void;
};

/** "Season 1 ›" under the day; opens the year of seasons. */
export function SeasonPill({ label, onPress }: SeasonPillProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}. Open your year of seasons`}
      onPress={onPress}
      hitSlop={spacing.xs}
      style={({ pressed }) => [styles.pill, pressed ? styles.pressed : null]}
    >
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 11l8-7 8 7v9H4z"
          stroke={colors.room.ink}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
        <Path d="M10 20v-5h4v5" stroke={colors.room.ink} strokeWidth={2.2} strokeLinejoin="round" />
      </Svg>
      <Text style={styles.label} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
      <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
        <Path
          d="M9 6l6 6-6 6"
          stroke={colors.room.ink}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs + 2,
    minHeight: 34,
    paddingLeft: spacing.xs + 2,
    paddingRight: spacing.sm,
    marginTop: spacing.xxs,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.room.ink,
    backgroundColor: colors.room.butter,
    shadowColor: colors.room.gold,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 3 },
  },
  pressed: {
    transform: [{ translateY: 2 }],
    shadowOffset: { width: 0, height: 1 },
  },
  label: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.heavy,
    color: colors.room.ink,
  },
});
