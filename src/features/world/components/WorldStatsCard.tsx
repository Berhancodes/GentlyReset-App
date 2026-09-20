import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { WorldStatIcon } from '@/features/world/components/WorldIcons';
import { WORLD_COMMUNITY_STATS } from '@/features/world/data/worldStats';
import { WORLD_STATS_CARD_HEIGHT } from '@/features/world/layout/worldHeroLayout';

export function WorldStatsCard() {
  return (
    <View
      testID="world-stats-card"
      accessibilityRole="text"
      accessibilityLabel={WORLD_COMMUNITY_STATS.map((stat) => `${stat.value} ${stat.label}`).join(
        '. ',
      )}
      style={styles.card}
    >
      {WORLD_COMMUNITY_STATS.map((stat, index) => (
        <Fragment key={stat.id}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <View style={styles.stat}>
            <WorldStatIcon glyph={stat.glyph} />
            <View style={styles.copy}>
              <AppText variant="worldStatValue" numberOfLines={1}>
                {stat.value}
              </AppText>
              <AppText variant="worldStatLabel" color="helper" numberOfLines={1}>
                {stat.label}
              </AppText>
            </View>
          </View>
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: WORLD_STATS_CARD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderRadius: radius.statsPanel,
    backgroundColor: colors.surface.quote,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.subtle,
    overflow: 'visible',
    zIndex: 3,
    ...shadows.whisper,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 0,
  },
  separator: {
    width: StyleSheet.hairlineWidth,
    height: spacing.xl,
    backgroundColor: colors.border.subtle,
    flexShrink: 0,
  },
  copy: {
    justifyContent: 'center',
    gap: 0,
  },
});
