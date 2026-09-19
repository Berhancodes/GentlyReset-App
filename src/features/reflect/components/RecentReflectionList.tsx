import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import { MoodFace } from '@/features/reflect/components/MoodSelector';
import { formatReflectionListDate, MOOD_LABELS } from '@/features/reflect/utils/journalHistory';
import type { JournalEntry } from '@/features/reset/types';

const ROW_FACE = spacing.xl;

type RecentReflectionListProps = {
  entries: readonly JournalEntry[];
};

export function RecentReflectionList({ entries }: RecentReflectionListProps) {
  if (entries.length === 0) {
    return (
      <AppText variant="caption" color="helper">
        your thoughts will collect here.
      </AppText>
    );
  }

  return (
    <View>
      {entries.map((item, index) => (
        <View
          key={`${item.day}-${item.savedAt}`}
          style={[styles.row, index < entries.length - 1 ? styles.rowDivider : null]}
          accessibilityLabel={`${formatReflectionListDate(item.date)}, ${MOOD_LABELS[item.mood]}. ${item.text}`}
        >
          <MoodFace mood={item.mood} selected={false} size={ROW_FACE} />
          <View style={styles.copy}>
            <AppText variant="label" color="helper">
              {formatReflectionListDate(item.date)}
            </AppText>
            <AppText variant="caption" color="primary" numberOfLines={1}>
              {item.text}
            </AppText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.text.helper}
            accessibilityElementsHidden
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: spacing.hitTarget,
    paddingVertical: spacing.sm,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.subtle,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
});
