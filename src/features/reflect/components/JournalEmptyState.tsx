import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import {
  JOURNAL_EMPTY_ART,
  JOURNAL_SITTING_MASCOT,
  JOURNAL_SITTING_MASCOT_ASPECT,
} from '@/features/reflect/data/journalSeasonArt';
import type { JourneySeason } from '@/features/journey/utils/getJourneySeason';

const ART_WIDTH = 120;
const TAIL_SIZE = 14;

/** Shown before the first entry: the mascot with a gentle note. */
export function JournalEmptyState({ season }: { season: JourneySeason }) {
  const art = JOURNAL_EMPTY_ART[season];
  const source = art?.source ?? JOURNAL_SITTING_MASCOT;
  const aspect = art ? art.width / art.height : JOURNAL_SITTING_MASCOT_ASPECT;

  return (
    <View style={styles.row}>
      <Image
        source={source}
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{ width: ART_WIDTH, height: ART_WIDTH / aspect }}
      />
      <View style={styles.bubble}>
        {/* Small tail pointing back at the mascot. */}
        <View style={styles.tail} />
        <AppText variant="journalSave">Your thoughts will collect here.</AppText>
        <AppText variant="caption" color="secondary">
          One line is enough.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bubble: {
    flex: 1,
    gap: spacing.xxs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.xxl,
    backgroundColor: colors.journal.bubble,
  },
  tail: {
    position: 'absolute',
    left: -TAIL_SIZE / 2 + 2,
    top: '50%',
    marginTop: -TAIL_SIZE / 2,
    width: TAIL_SIZE,
    height: TAIL_SIZE,
    borderRadius: 3,
    transform: [{ rotate: '45deg' }],
    backgroundColor: colors.journal.bubble,
  },
});
