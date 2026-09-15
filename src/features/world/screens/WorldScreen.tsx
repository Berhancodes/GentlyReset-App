import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText, MainTabHeader, SceneHero, Screen } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import { FriendsSection } from '@/features/world/components/FriendsSection';
import { useSyncResetDay } from '@/features/reset/hooks/useSyncResetDay';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { getWorldStage, worldCompanionLine } from '@/features/reset/utils/getWorldStage';

const WORLD_COTTAGE = require('../../../../assets/images/app/my-world-cottage.png');

export function WorldScreen() {
  useSyncResetDay();
  const completedDays = useResetStore((state) => state.completedDays);
  const personalization = useResetStore((state) => state.personalization);
  const stage = getWorldStage(completedDays.length);
  const grown = worldCompanionLine(stage, personalization.supportStyle, completedDays.length);

  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <MainTabHeader title="world" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stageBlock}>
          <AppText variant="label" color="helper">
            {stage.name.toLowerCase()}
            {completedDays.length > 0 ? ` · ${completedDays.length} days of showing up` : ''}
          </AppText>
          <AppText variant="body" color="secondary">
            {grown}
          </AppText>
        </View>
        <View style={[styles.scene, stage.id >= 3 ? styles.sceneWarm : null]}>
          <SceneHero
            source={WORLD_COTTAGE}
            accessibilityLabel={`Gently Reset world, ${stage.name} stage. Mascot on a path toward a cottage.`}
            aspectRatio={1.28}
            borderRadius={radius.card}
          />
        </View>
        <FriendsSection />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  stageBlock: {
    gap: spacing.xxs,
  },
  scene: {
    borderRadius: radius.card,
  },
  sceneWarm: {
    padding: spacing.xxs,
    backgroundColor: colors.surface.choiceSelected,
  },
});
