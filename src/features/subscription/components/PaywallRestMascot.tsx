import { Image, StyleSheet, View } from 'react-native';

import { spacing } from '@/design-system';
import { PAYWALL_MASCOT_ART } from '@/features/onboarding/data/onboardingAssets';

/**
 * Sleeping mascot in the leftover column between plans and the unlock button.
 * Flexes with the viewport — never claims a large fixed height.
 */
export function PaywallRestMascot() {
  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={styles.wrap}
    >
      <Image
        source={PAYWALL_MASCOT_ART}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={styles.art}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    marginHorizontal: -spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  art: {
    width: '100%',
    height: '100%',
  },
});
