import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, MascotIcon } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import {
  formatRecentEntryDate,
  reflectionPreview,
  reflectionTitle,
} from '@/features/reflect/utils/journalHistory';
import type { JournalEntry } from '@/features/reset/types';

type RecentEntryCardProps = {
  entry: JournalEntry;
  onPress?: () => void;
};

export function RecentEntryCard({ entry, onPress }: RecentEntryCardProps) {
  const title = reflectionTitle(entry.text);
  const preview = reflectionPreview(entry.text);
  const dateLabel = formatRecentEntryDate(entry.date);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${dateLabel}. ${title}. ${preview}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <View style={styles.copy}>
        <AppText variant="label" color="secondary">
          {dateLabel}
        </AppText>
        <AppText variant="optionTitle" numberOfLines={1}>
          {title}
        </AppText>
        <AppText variant="caption" color="secondary" numberOfLines={2}>
          {preview}
        </AppText>
      </View>
      <MascotIcon name="chevron" size={20} color={colors.text.helper} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.surface.quote,
    ...shadows.whisper,
  },
  pressed: {
    opacity: 0.88,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
});
