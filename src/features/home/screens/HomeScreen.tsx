import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText, MainTabHeader, SceneHero, Screen } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';

const HOME_MORNING_SCENE = require('../../../../assets/images/app/home-morning-scene.png');

export function HomeScreen() {
  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <MainTabHeader title="home" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greeting}>
          <AppText variant="title">good morning</AppText>
          <AppText variant="body" color="secondary">
            small steps still move you forward.
          </AppText>
        </View>
        <SceneHero
          source={HOME_MORNING_SCENE}
          accessibilityLabel="Mascot sipping tea on a log at sunrise"
          aspectRatio={1.08}
        />
        <View style={styles.card}>
          <AppText variant="label" color="helper">
            {"today's reset"}
          </AppText>
          <View style={styles.task}>
            <View style={styles.indicator} />
            <View style={styles.taskCopy}>
              <AppText variant="optionTitle">journal for 5 minutes</AppText>
              <AppText variant="caption" color="helper">
                a calmer mind starts here.
              </AppText>
            </View>
          </View>
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
  greeting: {
    gap: spacing.xxs,
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
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  indicator: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border.default,
  },
  taskCopy: {
    flex: 1,
    gap: 2,
  },
});
