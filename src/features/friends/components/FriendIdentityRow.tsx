import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontFamilies, fontSizes, fontWeights, spacing } from '@/design-system';
import { FriendAvatar } from '@/features/friends/components/FriendAvatar';
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
  /** Which warm fill the avatar uses, so neighbours differ. */
  tone?: number;
  /** Gold ring: they showed up today. */
  showedUpToday?: boolean;
};

export function friendDisplayLabel(identity: PublicFriendIdentity): string {
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
  tone = 0,
  showedUpToday = false,
}: FriendIdentityRowProps) {
  const handle = identity.username ? formatUsernameHandle(identity.username) : null;
  const label = friendDisplayLabel(identity);

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`${label}${handle ? `. ${handle}` : ''}`}
      style={styles.row}
    >
      <View accessibilityElementsHidden>
        <FriendAvatar
          letter={initial(identity)}
          tone={tone}
          size={spacing.hitTarget}
          ringed={showedUpToday}
        />
      </View>
      <View style={styles.copy}>
        <Text style={styles.name} numberOfLines={1} maxFontSizeMultiplier={1.3}>
          {label}
        </Text>
        {handle && label !== handle ? (
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
  name: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
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
