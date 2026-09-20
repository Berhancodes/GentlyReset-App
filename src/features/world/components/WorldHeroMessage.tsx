import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { spacing } from '@/design-system';

const HERO_MESSAGE = 'good\npeople\nbrighter\ndays';

/**
 * Native overlay — not baked into the landscape. Rotated and placed in the
 * open sky below the header so it does not sit on the mascots.
 */
export function WorldHeroMessage() {
  return (
    <View
      pointerEvents="none"
      accessible
      accessibilityRole="text"
      accessibilityLabel="good people brighter days"
      style={styles.root}
    >
      <AppText variant="worldHeroQuote" color="primary" align="center">
        {HERO_MESSAGE}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginLeft: -spacing.md,
    transform: [{ rotate: '-8deg' }],
  },
});
