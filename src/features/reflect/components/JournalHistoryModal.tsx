import { Modal, Pressable, ScrollView, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { RecentEntryCard } from '@/features/reflect/components/RecentEntryCard';
import { sortedReflections } from '@/features/reflect/utils/journalHistory';
import type { JournalEntry } from '@/features/reset/types';

type JournalHistoryModalProps = {
  visible: boolean;
  entries: readonly JournalEntry[];
  onClose: () => void;
};

export function JournalHistoryModal({ visible, entries, onClose }: JournalHistoryModalProps) {
  const sorted = sortedReflections(entries);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss entries"
        onPress={onClose}
        style={styles.backdrop}
      >
        <Pressable onPress={(event) => event.stopPropagation()} style={styles.sheet}>
          <AppText variant="title">entries</AppText>
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {sorted.length === 0 ? (
              <AppText variant="caption" color="helper">
                your thoughts will collect here.
              </AppText>
            ) : (
              sorted.map((item) => (
                <RecentEntryCard key={`${item.day}-${item.savedAt}`} entry={item} />
              ))
            )}
          </ScrollView>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="close"
            onPress={onClose}
            style={styles.close}
          >
            <AppText variant="optionTitle" color="secondary" align="center">
              close
            </AppText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay.scrim,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  sheet: {
    maxHeight: '80%',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface.raised,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  close: {
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
