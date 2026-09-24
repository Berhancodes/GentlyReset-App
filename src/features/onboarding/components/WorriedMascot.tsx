import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { spacing } from '@/design-system';

const WORRIED_ART = require('../../../../assets/images/onboarding/support-timing/support-mascot-worried.png');
const ART_WIDTH = 333;
const ART_HEIGHT = 323;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;

const SHORT_PHONE_HEIGHT = 680;
const REGULAR_PHONE_HEIGHT = 800;
const MASCOT_HEIGHT_SHORT = 132;
const MASCOT_HEIGHT_REGULAR = 155;
const MASCOT_HEIGHT_TALL = 168;

function mascotHeightForWindow(windowHeight: number): number {
  if (windowHeight < SHORT_PHONE_HEIGHT) {
    return MASCOT_HEIGHT_SHORT;
  }

  if (windowHeight < REGULAR_PHONE_HEIGHT) {
    return MASCOT_HEIGHT_REGULAR;
  }

  return MASCOT_HEIGHT_TALL;
}

/**
 * Decorative reaction under the support-timing catch-all. Not interactive.
 */
export function WorriedMascot() {
  const { height: windowHeight } = useWindowDimensions();
  const artHeight = mascotHeightForWindow(windowHeight);
  const artWidth = Math.round(artHeight * ART_ASPECT);

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={styles.wrap}
    >
      <Image
        source={WORRIED_ART}
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
    marginTop: spacing.xs,
    pointerEvents: 'none',
  },
});
