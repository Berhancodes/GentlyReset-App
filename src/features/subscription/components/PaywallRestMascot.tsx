import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { PAYWALL_MASCOT_ART } from '@/features/onboarding/data/onboardingAssets';

const ART_WIDTH = 854;
const ART_HEIGHT = 472;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;

/**
 * Full-bleed rest scene pinned to the bottom of the paywall.
 * Width matches the screen so grass, bags, and flowers fill the lower edge.
 */
export function PaywallRestMascot() {
  const { width: windowWidth } = useWindowDimensions();
  const artHeight = Math.round(windowWidth / ART_ASPECT);

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no"
      pointerEvents="none"
      style={[styles.wrap, { height: artHeight }]}
    >
      <Image
        source={PAYWALL_MASCOT_ART}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{ width: windowWidth, height: artHeight }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
