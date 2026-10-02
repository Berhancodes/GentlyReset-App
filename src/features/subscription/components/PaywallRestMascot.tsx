import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { spacing } from '@/design-system';

const REST_MASCOT = require('../../../../assets/images/onboarding/paywall-mascot-rest.png');
const ART_WIDTH = 854;
const ART_HEIGHT = 627;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;
const MAX_HEIGHT = 200;

/**
 * Sleeping mascot between the paywall plans and the unlock button.
 */
export function PaywallRestMascot() {
  const { width: windowWidth } = useWindowDimensions();
  const availableWidth = Math.round(windowWidth - spacing.lg * 2);
  const heightFromWidth = Math.round(availableWidth / ART_ASPECT);
  const artHeight = Math.min(MAX_HEIGHT, heightFromWidth);
  const artWidth = Math.round(artHeight * ART_ASPECT);

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={styles.wrap}
    >
      <Image
        source={REST_MASCOT}
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
    alignItems: 'center',
    marginTop: spacing.sm,
    pointerEvents: 'none',
  },
});
