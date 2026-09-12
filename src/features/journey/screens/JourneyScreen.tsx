import { ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText, MainTabHeader, ProgressBar, SceneHero, Screen } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';

const WORLD_COTTAGE = require('../../../../assets/images/app/my-world-cottage.png');

/** Placeholder until a real journey day exists. */
const PREVIEW_DAY = 7;
const PREVIEW_PROGRESS = 0.58;

export function JourneyScreen() {
  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <MainTabHeader title="my world" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="body" color="secondary">
          your progress grows a brighter place.
        </AppText>
        <SceneHero
          source={WORLD_COTTAGE}
          accessibilityLabel="Mascot standing on a path toward a cottage"
          aspectRatio={1086 / 1448}
        />
        <View style={styles.card}>
          <View style={styles.dayRow}>
            <AppText variant="optionTitle">day {PREVIEW_DAY}</AppText>
            <Ionicons name="leaf" size={18} color={colors.accent.sage} />
          </View>
          <ProgressBar
            progress={PREVIEW_PROGRESS}
            fillColor={colors.accent.sage}
            accessibilityLabel="World progress"
          />
          <AppText variant="caption" color="helper" align="right">
            keep going!
          </AppText>
        </View>
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
    gap: spacing.md,
  },
  card: {
    marginTop: -spacing.sm,
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.surface.raised,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.soft,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
