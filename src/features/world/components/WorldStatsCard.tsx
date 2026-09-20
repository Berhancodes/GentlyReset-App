import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { WorldStatIcon } from '@/features/world/components/WorldIcons';
import { WORLD_COMMUNITY_STATS } from '@/features/world/data/worldStats';

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
        <Fragment key={stat.id}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <View style={styles.stat}>
            <WorldStatIcon glyph={stat.glyph} />
            <View style={styles.copy}>
              <AppText variant="optionTitle" numberOfLines={1}>
                {stat.value}
              </AppText>
              <AppText variant="label" color="helper" numberOfLines={2}>
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
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: spacing.xxxl,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surface.raised,
    overflow: 'visible',
    zIndex: 3,
    ...shadows.soft,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    minWidth: 0,
    paddingHorizontal: spacing.xxs,
  },
  separator: {
    width: StyleSheet.hairlineWidth,
    height: spacing.xl,
    backgroundColor: colors.border.subtle,
    alignSelf: 'center',
  },
  copy: {
    minWidth: 0,
    flexShrink: 1,
    gap: 2,
  },
});
