import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, fontSizes, fontWeights, radius, spacing } from '@/design-system';
import type { JourneyDayKind } from '@/features/journey/utils/getJourneyDayState';

const DAY_SIZE = 34;

type GardenWeekStripProps = {
  days: readonly { day: number; kind: JourneyDayKind }[];
  onPressDay: (day: number) => void;
};

/** This week's days: cocoa once checked in, gold for today, pale for days ahead. */
export function GardenWeekStrip({ days, onPressDay }: GardenWeekStripProps) {
  return (
    <View style={styles.row} accessibilityLabel="This week">
      {days.map(({ day, kind }) => {
        const state =
          kind === 'completed' ? 'checked in' : kind === 'current' ? 'today' : 'coming up';
        return (
          <Pressable
            key={day}
            accessibilityRole="button"
            accessibilityLabel={`Day ${day}, ${state}`}
            onPress={() => onPressDay(day)}
            hitSlop={spacing.xxs}
            style={styles.hit}
          >
            <View
              style={[
                styles.day,
                kind === 'completed' ? styles.dayDone : null,
                kind === 'current' ? styles.dayNow : null,
              ]}
            >
              <Text
                maxFontSizeMultiplier={1.2}
                style={[
                  styles.number,
                  kind === 'completed' ? styles.numberDone : null,
                  kind === 'current' ? styles.numberNow : null,
                ]}
              >
                {day}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    // Seven 44pt targets fit side by side on the narrowest phones.
    paddingTop: spacing.xxs,
  },
  hit: {
    minWidth: spacing.hitTarget,
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.stage.track,
  },
  /** Same cocoa as the buttons and the stats calendar's checked-in days. */
  dayDone: {
    backgroundColor: colors.stage.cta,
  },
  dayNow: {
    backgroundColor: colors.accent.gold,
    borderWidth: 3,
    borderColor: colors.stage.chipSelected,
  },
  number: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.heavy,
    color: colors.stage.copySoft,
  },
  numberDone: {
    color: colors.text.inverse,
  },
  numberNow: {
    color: colors.text.primary,
  },
});
