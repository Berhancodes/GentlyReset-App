import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  radius,
  spacing,
} from '@/design-system';
import { FriendIdentityRow } from '@/features/friends/components/FriendIdentityRow';
import { friendProgressCopy, type SharedFriendProgress } from '@/features/friends/progress';
import type { FriendListItem } from '@/features/friends/types';

type FriendProgressCardProps = {
  friend: FriendListItem;
  progress: SharedFriendProgress | undefined;
  busy: boolean;
  /** Which warm avatar fill to use. */
  tone: number;
  onEncourage: () => void;
  onRemove: () => void;
};

export function FriendProgressCard({
  friend,
  progress,
  busy,
  tone,
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
      <FriendIdentityRow
        identity={friend}
        accessory="remove"
        busy={busy}
        tone={tone}
        showedUpToday={progress?.completedToday ?? false}
        onRemove={onRemove}
      />
      <View style={styles.below}>
        {copy ? (
          <Text style={styles.progress} accessibilityElementsHidden maxFontSizeMultiplier={1.3}>
            {[copy.dayLabel, copy.presenceLabel, copy.streakLabel]
              .filter((part): part is string => Boolean(part))
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
              .join(' · ')}
          </Text>
        ) : (
          <View style={styles.flex} />
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Send ${friend.displayName ?? friend.username ?? 'your friend'} a postcard`}
          accessibilityState={{ disabled: busy }}
          disabled={busy}
          onPress={onEncourage}
          style={({ pressed }) => [styles.send, pressed ? styles.sendPressed : null]}
        >
          <Text style={styles.sendLabel} maxFontSizeMultiplier={1.3}>
            {busy ? '…' : 'Postcard'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingBottom: spacing.sm,
  },
  below: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingRight: spacing.md,
    paddingLeft: spacing.md + spacing.hitTarget + spacing.sm,
  },
  flex: {
    flex: 1,
  },
  progress: {
    flex: 1,
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: fontWeights.bold,
    color: colors.stage.copySoft,
  },
  send: {
    minHeight: spacing.hitTarget - spacing.xxs,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.stage.chipSelected,
  },
  sendPressed: {
    transform: [{ scale: 0.96 }],
  },
  sendLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
  },
});
