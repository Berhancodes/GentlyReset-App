import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { formatUsernameHandle } from '@/features/friends/username';
import type { PublicFriendIdentity } from '@/features/friends/types';

type FriendIdentityRowProps = {
  identity: PublicFriendIdentity;
  accessory?: 'acceptDecline' | 'cancel' | 'remove' | 'pending' | 'none';
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
  onRemove?: () => void;
  busy?: boolean;
};

function displayLabel(identity: PublicFriendIdentity): string {
  if (identity.displayName && identity.displayName.trim().length > 0) {
    return identity.displayName.trim();
  }
  if (identity.username) {
    return formatUsernameHandle(identity.username);
  }
  return 'a friend';
}

function initial(identity: PublicFriendIdentity): string {
  const source = identity.displayName ?? identity.username ?? '?';
  return source.slice(0, 1).toUpperCase();
}

export function FriendIdentityRow({
  identity,
  accessory = 'none',
  onAccept,
  onDecline,
  onCancel,
  onRemove,
  busy = false,
}: FriendIdentityRowProps) {
  const handle = identity.username ? formatUsernameHandle(identity.username) : null;

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`${displayLabel(identity)}${handle ? `. ${handle}` : ''}`}
      style={styles.row}
    >
      <View style={styles.avatar} accessibilityElementsHidden>
        <AppText variant="label" color="primary">
          {initial(identity)}
        </AppText>
      </View>
      <View style={styles.copy}>
        <AppText variant="optionTitle" numberOfLines={1}>
          {displayLabel(identity)}
        </AppText>
        {handle && displayLabel(identity) !== handle ? (
          <AppText variant="caption" color="helper" numberOfLines={1}>
            {handle}
          </AppText>
        ) : null}
      </View>
      {accessory === 'acceptDecline' ? (
        <View style={styles.actions}>
          <TextAction label={busy ? '…' : 'accept'} onPress={onAccept} disabled={busy} />
          <TextAction label="decline" onPress={onDecline} disabled={busy} muted />
        </View>
      ) : null}
      {accessory === 'cancel' ? (
        <TextAction label={busy ? '…' : 'cancel'} onPress={onCancel} disabled={busy} muted />
      ) : null}
      {accessory === 'remove' ? (
        <TextAction label={busy ? '…' : 'remove'} onPress={onRemove} disabled={busy} muted />
      ) : null}
      {accessory === 'pending' ? (
        <AppText variant="caption" color="helper">
          pending
        </AppText>
      ) : null}
    </View>
  );
}

function TextAction({
  label,
  onPress,
  disabled,
  muted = false,
}: {
  label: string;
  onPress?: () => void;
  disabled: boolean;
  muted?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled || !onPress}
      onPress={onPress}
      hitSlop={spacing.xs}
      style={styles.action}
    >
      <AppText variant="caption" color={muted ? 'helper' : 'gold'}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: spacing.hitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  avatar: {
    width: spacing.hitTarget,
    height: spacing.hitTarget,
    borderRadius: radius.pill,
    backgroundColor: colors.tint.gold,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 0,
  },
  action: {
    minHeight: spacing.hitTarget / 2,
    justifyContent: 'center',
    paddingVertical: spacing.xxs,
  },
});
