import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';

const HERO_MESSAGE = 'good\npeople\nbrighter\ndays';

/**
 * Native overlay — not baked into the landscape. Rotated and placed in the sky
 * so it does not sit on the mascots.
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
    position: 'absolute',
    left: '34%',
    top: '20%',
    transform: [{ rotate: '-7deg' }],
  },
});
