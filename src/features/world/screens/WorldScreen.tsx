import { ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppText, IconRow, MainTabHeader, SceneHero, Screen } from '@/components/ui';
import { colors, spacing } from '@/design-system';

const FRIENDS_TOGETHER = require('../../../../assets/images/app/friends-together.png');

export function WorldScreen() {
  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <MainTabHeader title="friends" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="body" color="secondary">
          {"don't reset alone."}
        </AppText>
        <SceneHero
          source={FRIENDS_TOGETHER}
          accessibilityLabel="Two mascots sitting together in a meadow"
          aspectRatio={1087 / 1446}
        />
        <View style={styles.actions}>
          <IconRow
            icon={<Ionicons name="add-circle" size={28} color={colors.accent.sage} />}
            title="invite a friend"
            subtitle="reset together is better"
            onPress={() => undefined}
          />
          <IconRow
            icon={<Ionicons name="heart" size={26} color={colors.accent.peach} />}
            title="send encouragement"
            subtitle="a little support goes a long way"
            onPress={() => undefined}
          />
          <IconRow
            icon={<Ionicons name="people" size={26} color={colors.text.primary} />}
            title="view shared progress"
            subtitle="see how you're both doing"
            onPress={() => undefined}
          />
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
  actions: {
    gap: spacing.sm,
  },
});
