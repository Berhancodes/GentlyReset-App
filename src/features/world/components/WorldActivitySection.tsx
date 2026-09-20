import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import {
  WORLD_ACTIVITY_SEE_ALL_NOTICE,
  WORLD_RECENT_ACTIVITY,
  type WorldActivityItem,
} from '@/features/world/data/worldActivity';
import type { WorldNotice } from '@/features/world/components/FriendsSection';

const MASCOT_HEAD = require('../../../../assets/images/mascot/mascot-head.png');

type WorldActivitySectionProps = {
  onNotice: (notice: WorldNotice) => void;
};

export function WorldActivitySection({ onNotice }: WorldActivitySectionProps) {
  const openSeeAll = () => {
    onNotice(WORLD_ACTIVITY_SEE_ALL_NOTICE);
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <AppText variant="optionTitle">recent activity</AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="see all activity"
          onPress={openSeeAll}
          hitSlop={spacing.md}
          style={styles.seeAll}
        >
          <AppText variant="caption" color="secondary">
            {'see all →'}
          </AppText>
        </Pressable>
      </View>
      <View style={styles.card}>
        {WORLD_RECENT_ACTIVITY.map((item, index) => (
          <View key={item.id}>
            {index > 0 ? <View style={styles.divider} /> : null}
            <ActivityRow item={item} onPress={openSeeAll} />
          </View>
        ))}
      </View>
    </View>
  );
}

function ActivityRow({ item, onPress }: { item: WorldActivityItem; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${item.subtitle}. ${item.timeLabel}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      <View style={styles.avatar} accessibilityElementsHidden importantForAccessibility="no">
        <Image
          source={MASCOT_HEAD}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
          style={styles.avatarArt}
        />
      </View>
      <View style={styles.copy}>
        <AppText variant="optionTitle" numberOfLines={2}>
          {item.title}
        </AppText>
        <AppText variant="caption" color="helper" numberOfLines={1}>
          {item.subtitle}
        </AppText>
      </View>
      <View style={styles.time}>
        <AppText variant="caption" color="helper">
          {item.timeLabel}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: spacing.hitTarget / 2,
    paddingHorizontal: spacing.xxs,
  },
  seeAll: {
    minHeight: spacing.hitTarget / 2,
    justifyContent: 'center',
    paddingVertical: spacing.xxs,
  },
  card: {
    borderRadius: radius.xxl,
    backgroundColor: colors.surface.raised,
    overflow: 'hidden',
    ...shadows.soft,
  },
  row: {
    minHeight: spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pressed: {
    opacity: 0.88,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: spacing.md + spacing.xl + spacing.sm,
    backgroundColor: colors.border.subtle,
  },
  avatar: {
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: radius.pill,
    backgroundColor: colors.background.secondary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarArt: {
    width: spacing.lg,
    height: spacing.lg,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
  time: {
    flexShrink: 0,
  },
});
