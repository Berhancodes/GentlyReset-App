import { Modal, Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { MoodSelector } from '@/features/reflect/components/MoodSelector';
import type { JournalMood } from '@/features/reset/types';

type MoodPickerDialogProps = {
  visible: boolean;
  value: JournalMood | undefined;
  onChange: (mood: JournalMood) => void;
  onClose: () => void;
};

export function MoodPickerDialog({ visible, value, onChange, onClose }: MoodPickerDialogProps) {
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
        accessibilityLabel="Dismiss mood picker"
        onPress={onClose}
        style={styles.backdrop}
      >
        <Pressable onPress={(event) => event.stopPropagation()} style={styles.card}>
          <AppText variant="optionTitle" align="center">
            how are you feeling?
          </AppText>
          <MoodSelector
            value={value}
            onChange={(mood) => {
              onChange(mood);
              onClose();
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface.raised,
  },
});
