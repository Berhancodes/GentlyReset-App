import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  radius,
  spacing,
  textVariants,
} from '@/design-system';
import { getJournalSackMood } from '@/features/reflect/data/journalSackMood';
import { formatRecentEntryDate, reflectionPreview } from '@/features/reflect/utils/journalHistory';
import type { JournalEntry } from '@/features/reset/types';

type JournalRecentListProps = {
  entries: readonly JournalEntry[];
  onSeeAll: () => void;
};

/** Your last few entries: when, how heavy it felt, and the first words. */
export function JournalRecentList({ entries, onSeeAll }: JournalRecentListProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header" maxFontSizeMultiplier={1.3}>
          Recent
        </Text>
        {entries.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="See all entries"
            onPress={onSeeAll}
            hitSlop={spacing.xs}
            style={styles.seeAll}
          >
            <Text style={styles.seeAllLabel} maxFontSizeMultiplier={1.3}>
              See all
            </Text>
          </Pressable>
        ) : null}
      </View>
      {entries.length === 0 ? (
        <Text style={styles.empty} maxFontSizeMultiplier={1.3}>
          Your entries will collect here. One line is enough.
        </Text>
      ) : (
        entries.map((entry, index) => {
          const date = formatRecentEntryDate(entry.date);
          const weight = getJournalSackMood(entry.mood).label;
          const preview = reflectionPreview(entry.text);
          return (
            <Pressable
              key={entry.savedAt}
              accessibilityRole="button"
              accessibilityLabel={`${date}, day ${entry.day}. Felt ${weight.toLowerCase()}. ${preview}`}
              onPress={onSeeAll}
              style={[styles.entry, index > 0 ? styles.divided : null]}
            >
              <View style={styles.meta}>
                <Text style={styles.date} maxFontSizeMultiplier={1.3}>
                  {`${date} · Day ${entry.day}`}
                </Text>
                <Text style={styles.pill} maxFontSizeMultiplier={1.3}>
                  {weight}
                </Text>
              </View>
              <Text style={styles.preview} numberOfLines={2} maxFontSizeMultiplier={1.3}>
                {preview}
              </Text>
            </Pressable>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xxs,
    padding: spacing.md,
    paddingTop: spacing.sm,
    borderRadius: radius.card,
    backgroundColor: colors.stage.chip,
    shadowColor: colors.stage.chipShadow,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  header: {
    minHeight: spacing.hitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
  },
  seeAll: {
    minHeight: spacing.hitTarget,
    justifyContent: 'center',
  },
  seeAllLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.heavy,
    color: colors.stage.ctaLink,
  },
  empty: {
    ...textVariants.stageSubtitle,
    color: colors.stage.copySoft,
    paddingBottom: spacing.xs,
  },
  entry: {
    gap: spacing.xxs,
    paddingVertical: spacing.sm,
  },
  divided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.stage.chipBorder,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  date: {
    ...textVariants.stageEyebrow,
    letterSpacing: 0.4,
    color: colors.stage.copySoft,
  },
  pill: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.tab,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
    backgroundColor: colors.stage.barMuted,
    borderRadius: radius.pill,
    overflow: 'hidden',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  preview: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
});
