import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/Text';
import { PrimaryButton } from '@/components/ui/Button';
import { colors, radius, spacing } from '@/design-system';

type NoticeDialogProps = {
  visible: boolean;
  title: string;
  body: string;
  onClose: () => void;
};

/** Web-safe notice. React Native Alert is silent in Expo web. */
export function NoticeDialog({ visible, title, body, onClose }: NoticeDialogProps) {
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
        accessibilityLabel="Dismiss"
        onPress={onClose}
        style={styles.backdrop}
      >
        <Pressable onPress={(event) => event.stopPropagation()} style={styles.card}>
          <View style={styles.copy}>
            <AppText variant="title">{title}</AppText>
            <AppText variant="body" color="secondary">
              {body}
            </AppText>
          </View>
          <PrimaryButton label="okay" onPress={onClose} />
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
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.surface.raised,
  },
  copy: {
    gap: spacing.sm,
  },
});
