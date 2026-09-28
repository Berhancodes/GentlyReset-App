import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { friendDisplayLabel } from '@/features/friends/components/FriendIdentityRow';
import {
  ENCOURAGEMENT_COPY,
  encouragementTimeLabel,
  isEncouragementKind,
} from '@/features/friends/encouragements';
import type { ReceivedEncouragement } from '@/features/friends/types';

type ReceivedEncouragementListProps = {
  items: readonly ReceivedEncouragement[];
  nowMs: number;
  onOpen: (item: ReceivedEncouragement) => void;
};

export function ReceivedEncouragementList({
  items,
  nowMs,
  onOpen,
}: ReceivedEncouragementListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.block} testID="received-encouragements">
      <AppText variant="optionTitle">little things people sent you</AppText>
      <View style={styles.card}>
        {items.map((item, index) => {
          const copy = isEncouragementKind(item.kind) ? ENCOURAGEMENT_COPY[item.kind] : null;
          if (!copy) {
            return null;
          }
          const name = friendDisplayLabel(item.sender);
          const time = encouragementTimeLabel(item.createdAt, nowMs);
          return (
            <View key={item.id}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${name}. ${copy}. ${time}`}
                onPress={() => onOpen(item)}
                style={styles.row}
              >
                <View style={styles.copy}>
                  <AppText variant="optionTitle" numberOfLines={1}>
                    {name}
                  </AppText>
                  <AppText variant="body" color="secondary">
                    {copy}
                  </AppText>
                  {time ? (
                    <AppText variant="caption" color="helper">
                      {time}
                    </AppText>
                  ) : null}
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: spacing.sm,
  },
  card: {
    borderRadius: radius.xxl,
    backgroundColor: colors.surface.raised,
    overflow: 'hidden',
    ...shadows.soft,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: spacing.md,
    backgroundColor: colors.border.subtle,
  },
  row: {
    minHeight: spacing.hitTarget,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  copy: {
    gap: spacing.xxs,
  },
});
