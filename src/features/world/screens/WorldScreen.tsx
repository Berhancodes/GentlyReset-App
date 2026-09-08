import { StyleSheet, View } from 'react-native';

import { AppHeader, AppText, Screen } from '@/components/ui';
import { spacing } from '@/design-system';

export function WorldScreen() {
  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <AppHeader title="friends" />
      <View style={styles.content}>
        <AppText variant="label" color="muted">
          WORLD
        </AppText>
        <AppText variant="display">a small world, later.</AppText>
        <AppText variant="body" color="secondary">
          Illustrated scenes and collections will live here. This is only a placeholder.
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});
