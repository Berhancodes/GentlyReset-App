import { StyleSheet, View } from 'react-native';

import { AppHeader, AppText, Screen } from '@/components/ui';
import { spacing } from '@/design-system';

export function HomeScreen() {
  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <AppHeader title="home" />
      <View style={styles.content}>
        <AppText variant="label" color="muted">
          HOME
        </AppText>
        <AppText variant="display">a quiet place to begin.</AppText>
        <AppText variant="body" color="secondary">
          Daily rituals will live here. For now this tab only proves the navigation architecture.
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
});
