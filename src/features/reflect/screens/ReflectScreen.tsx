import { StyleSheet, View } from 'react-native';

import { AppHeader, AppText, Screen } from '@/components/ui';
import { spacing } from '@/design-system';

export function ReflectScreen() {
  return (
    <Screen includeTopSafeArea={false} includeBottomSafeArea={false} padded={false}>
      <AppHeader title="journal" />
      <View style={styles.content}>
        <AppText variant="label" color="muted">
          REFLECT
        </AppText>
        <AppText variant="display">a softer kind of journal.</AppText>
        <AppText variant="body" color="secondary">
          Prompts and notes will land here. The tab exists so routing can stay stable as we build.
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
