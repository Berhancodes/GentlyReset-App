import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { WORLD_STATS_CARD_HEIGHT } from '@/features/world/layout/worldHeroLayout';

type WorldStatusCardProps = {
  title: string;
  body: string;
};

export function WorldStatusCard({ title, body }: WorldStatusCardProps) {
  return (
    <View
      testID="world-status-card"
      accessibilityRole="text"
      accessibilityLabel={`${title}. ${body}`}
      style={styles.card}
    >
      <AppText variant="optionTitle" align="center" numberOfLines={2}>
        {title}
      </AppText>
      <AppText variant="caption" color="helper" align="center" numberOfLines={2}>
        {body}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: WORLD_STATS_CARD_HEIGHT,
    justifyContent: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.statsPanel,
    backgroundColor: colors.surface.quote,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.subtle,
    overflow: 'visible',
    zIndex: 3,
    ...shadows.whisper,
  },
});
