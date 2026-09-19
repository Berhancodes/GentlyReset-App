import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getTabBarScenePadding, MainTabHeader, Screen } from '@/components/ui';
import { spacing } from '@/design-system';
import { FriendsSection } from '@/features/world/components/FriendsSection';
import { WorldBackground } from '@/features/world/components/WorldBackground';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { getWorldStage } from '@/features/reset/utils/getWorldStage';

const COMPACT_HEIGHT = 740;

export function WorldScreen() {
  useSyncResetDay();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const compact = height < COMPACT_HEIGHT;
  const completedDays = useResetStore((state) => state.completedDays);
  const stage = getWorldStage(completedDays.length);

  return (
    <Screen
      includeTopSafeArea={false}
      includeBottomSafeArea={false}
      padded={false}
      backgroundColor="transparent"
    >
      <WorldBackground
        accessibilityLabel={`Gently Reset world, ${stage.name} stage. Two mascots sitting together by a lake at sunset.`}
      />
      <MainTabHeader title="world" subtitle="don't reset alone." transparent fade />
      <View
        style={[
          styles.overlay,
          compact ? styles.overlayCompact : null,
          {
            paddingBottom:
              getTabBarScenePadding(insets.bottom) + (compact ? spacing.md : spacing.lg),
          },
        ]}
      >
        <View style={styles.landscape} />
        <FriendsSection compact={compact} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xxs,
    gap: spacing.xs,
  },
  overlayCompact: {
    gap: spacing.xxs,
  },
  landscape: {
    flex: 1,
    minHeight: spacing.xl,
  },
});
