import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { WorldActionCard } from '@/features/world/components/WorldActionCard';

type AddFriendDialogProps = {
  visible: boolean;
  onFindFriend: () => void;
  onInviteFriend: () => void;
  onClose: () => void;
};

const MAX_WIDTH = 380;

/**
 * Behind every "+" once you have friends: the same two ways in as the empty
 * World screen, so searching by @username never disappears.
 */
export function AddFriendDialog({
  visible,
  onFindFriend,
  onInviteFriend,
  onClose,
}: AddFriendDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <View style={styles.backdrop}>
        {/* Behind the card, not around it, so its buttons aren't nested in another. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.card}>
          <View style={styles.copy}>
            <AppText variant="title" accessibilityRole="header">
              add a friend
            </AppText>
            <AppText variant="body" color="secondary">
              find them by their @username, or send a private invite link.
            </AppText>
          </View>
          <WorldActionCard
            glyph="group"
            title="find a friend"
            subtitle="search an exact @username"
            onPress={() => {
              onClose();
              onFindFriend();
            }}
          />
          <WorldActionCard
            glyph="plus"
            title="invite a friend"
            subtitle="share a private invite link"
            onPress={() => {
              onClose();
              onInviteFriend();
            }}
          />
        </View>
      </View>
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
    maxWidth: MAX_WIDTH,
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.background.home,
  },
  copy: {
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
});
