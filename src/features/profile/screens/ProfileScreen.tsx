import { StyleSheet, View } from 'react-native';

import { AppText, Screen } from '@/components/ui';
import { spacing } from '@/design-system';

export function ProfileScreen() {
  return (
    <Screen includeBottomSafeArea={false}>
      <View style={styles.content}>
        <AppText variant="label" color="muted">
          PROFILE
        </AppText>
        <AppText variant="display">settings, when we need them.</AppText>
        <AppText variant="body" color="secondary">
          Account, reminders, and preferences will settle here. Nothing to configure yet.
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
  },
});
