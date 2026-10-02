import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { spacing } from '@/design-system';
import { PAYWALL_MASCOT_ART } from '@/features/onboarding/data/onboardingAssets';

const ART_WIDTH = 854;
const ART_HEIGHT = 472;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;
const HEIGHT_FRACTION = 0.28;
const MAX_HEIGHT = 228;
const MIN_HEIGHT = 168;

/**
 * Sleeping mascot reserved between the paywall plans and the unlock button.
 * Sized from the viewport so the full rest scene stays in frame.
 */
export function PaywallRestMascot() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const maxHeight = Math.min(MAX_HEIGHT, Math.round(windowHeight * HEIGHT_FRACTION));
  const heightFromWidth = Math.round(windowWidth / ART_ASPECT);
  const artHeight = Math.max(MIN_HEIGHT, Math.min(maxHeight, heightFromWidth));
  const artWidth = Math.min(windowWidth, Math.round(artHeight * ART_ASPECT));

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
        style={{ width: artWidth, height: artHeight }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 0,
    flexShrink: 0,
    width: '100%',
    marginHorizontal: -spacing.lg,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
    pointerEvents: 'none',
  },
});
