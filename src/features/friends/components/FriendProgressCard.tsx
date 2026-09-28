import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { spacing } from '@/design-system';
import { FriendIdentityRow } from '@/features/friends/components/FriendIdentityRow';
import { friendProgressCopy, type SharedFriendProgress } from '@/features/friends/progress';
import type { FriendListItem } from '@/features/friends/types';

type FriendProgressCardProps = {
  friend: FriendListItem;
  progress: SharedFriendProgress | undefined;
  busy: boolean;
  onEncourage: () => void;
  onRemove: () => void;
};

export function FriendProgressCard({
  friend,
  progress,
  busy,
  onEncourage,
  onRemove,
}: FriendProgressCardProps) {
  const copy = progress ? friendProgressCopy(progress) : null;
  const accessibilityBits = [
    friend.displayName ?? friend.username ?? 'a friend',
    copy?.dayLabel,
    copy?.presenceLabel,
    copy?.streakLabel,
  ].filter((item): item is string => Boolean(item));

  return (
    <View
      testID={`friend-progress-${friend.userId}`}
      accessibilityRole="text"
      accessibilityLabel={accessibilityBits.join('. ')}
      style={styles.root}
    >
      <FriendIdentityRow identity={friend} accessory="remove" busy={busy} onRemove={onRemove} />
      {copy ? (
        <View style={styles.progress} accessibilityElementsHidden>
          <AppText variant="caption" color="secondary">
            {copy.dayLabel}
          </AppText>
          {copy.presenceLabel ? (
            <AppText variant="caption" color="helper">
              {copy.presenceLabel}
            </AppText>
          ) : null}
          {copy.streakLabel ? (
            <AppText variant="caption" color="gold">
              {copy.streakLabel}
            </AppText>
          ) : null}
        </View>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`encourage ${friend.displayName ?? friend.username ?? 'friend'}`}
        accessibilityState={{ disabled: busy }}
        disabled={busy}
        onPress={onEncourage}
        style={styles.encourage}
      >
        <AppText variant="caption" color="gold">
          {busy ? '…' : 'encourage'}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingBottom: spacing.sm,
  },
  progress: {
    paddingHorizontal: spacing.md,
    paddingLeft: spacing.md + spacing.hitTarget + spacing.sm,
    gap: spacing.xxs,
  },
  encourage: {
    minHeight: spacing.hitTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingLeft: spacing.md + spacing.hitTarget + spacing.sm,
  },
});
