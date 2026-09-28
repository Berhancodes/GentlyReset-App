import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { friendDisplayLabel } from '@/features/friends/components/FriendIdentityRow';
import {
  ENCOURAGEMENT_COPY,
  ENCOURAGEMENT_KINDS,
  type EncouragementKind,
} from '@/features/friends/encouragements';
import type { PublicFriendIdentity } from '@/features/friends/types';

type EncouragementPickerProps = {
  visible: boolean;
  friend: PublicFriendIdentity | null;
  busy: boolean;
  onSelect: (kind: EncouragementKind) => void;
  onClose: () => void;
};

export function EncouragementPicker({
  visible,
  friend,
  busy,
  onSelect,
  onClose,
}: EncouragementPickerProps) {
  const name = friend ? friendDisplayLabel(friend) : 'a friend';

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
            <AppText variant="title">{`send ${name} a little something`}</AppText>
            <AppText variant="body" color="secondary">
              a small preset note. not a chat.
            </AppText>
          </View>
          <View style={styles.kinds}>
            {ENCOURAGEMENT_KINDS.map((kind) => (
              <Pressable
                key={kind}
                accessibilityRole="button"
                accessibilityLabel={ENCOURAGEMENT_COPY[kind]}
                accessibilityState={{ disabled: busy }}
                disabled={busy || !friend}
                onPress={() => onSelect(kind)}
                style={styles.kind}
              >
                <AppText variant="optionTitle" align="center">
                  {ENCOURAGEMENT_COPY[kind]}
                </AppText>
              </Pressable>
            ))}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="close"
            onPress={onClose}
            style={styles.close}
          >
            <AppText variant="caption" color="helper" align="center">
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
  kinds: {
    gap: spacing.sm,
  },
  kind: {
    minHeight: spacing.hitTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.tint.gold,
  },
  close: {
    minHeight: spacing.hitTarget,
    justifyContent: 'center',
  },
});
