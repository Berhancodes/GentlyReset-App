import { StyleSheet, View } from 'react-native';

import { AppHeader, AppText, Screen } from '@/components/ui';
import { spacing } from '@/design-system';

export function JourneyScreen() {
  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <AppHeader title="my world" />
      <View style={styles.content}>
        <AppText variant="label" color="muted">
          JOURNEY
        </AppText>
        <AppText variant="display">your path, in chapters.</AppText>
        <AppText variant="body" color="secondary">
          Programs and sequences will appear here once the foundation is in place.
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
