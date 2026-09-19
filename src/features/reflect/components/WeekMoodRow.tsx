import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { spacing } from '@/design-system';
import { MoodFace } from '@/features/reflect/components/MoodSelector';
import { MOOD_LABELS, weekdayLetter } from '@/features/reflect/utils/journalHistory';
import { toLocalDateKey } from '@/features/reset/utils/calendar';
import type { JournalMood } from '@/features/reset/types';

const COMPACT_FACE = spacing.xl;

type WeekMoodRowProps = {
  week: readonly string[];
  moodForDate: (dateKey: string) => JournalMood | undefined;
};

export function WeekMoodRow({ week, moodForDate }: WeekMoodRowProps) {
  const today = toLocalDateKey(new Date());

  return (
    <View style={styles.row}>
      {week.map((dateKey) => {
        const weekMood = moodForDate(dateKey);
        const isToday = dateKey === today;
        const dayLetter = weekdayLetter(dateKey);

        return (
          <View
            key={dateKey}
            style={styles.slot}
            accessibilityLabel={
              weekMood ? `${dayLetter}, ${MOOD_LABELS[weekMood]}` : `${dayLetter}, no reflection`
            }
          >
            <AppText variant="moodLabel" color={isToday ? 'primary' : 'helper'} align="center">
              {dayLetter}
            </AppText>
            {weekMood ? (
              <MoodFace mood={weekMood} selected={false} size={COMPACT_FACE} />
            ) : (
              <View style={styles.empty}>
                <AppText variant="moodLabel" color="helper" align="center">
                  –
                </AppText>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  slot: {
    alignItems: 'center',
    gap: spacing.xxs,
    minWidth: spacing.xl,
  },
  empty: {
    width: COMPACT_FACE,
    height: COMPACT_FACE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
