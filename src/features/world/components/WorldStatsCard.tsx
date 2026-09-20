import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { WORLD_COMMUNITY_STATS } from '@/features/world/data/worldStats';

const STAT_ICON_SIZE = 18;

export function WorldStatsCard() {
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={WORLD_COMMUNITY_STATS.map((stat) => `${stat.value} ${stat.label}`).join(
        '. ',
      )}
      style={styles.card}
    >
      {WORLD_COMMUNITY_STATS.map((stat, index) => (
        <View key={stat.id} style={styles.stat}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <View style={styles.cluster}>
            <Ionicons
              name={stat.icon}
              size={STAT_ICON_SIZE}
              color={colors.text.primary}
              accessibilityElementsHidden
            />
            <View style={styles.copy}>
              <AppText variant="optionTitle" numberOfLines={1}>
                {stat.value}
              </AppText>
              <AppText variant="caption" color="helper" numberOfLines={1}>
                {stat.label}
              </AppText>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: spacing.xxl,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface.raised,
    ...shadows.soft,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  separator: {
    width: StyleSheet.hairlineWidth,
    height: spacing.xl,
    marginRight: spacing.xs,
    backgroundColor: colors.border.subtle,
  },
  cluster: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minWidth: 0,
    paddingHorizontal: spacing.xxs,
  },
  copy: {
    minWidth: 0,
    gap: 1,
  },
});
