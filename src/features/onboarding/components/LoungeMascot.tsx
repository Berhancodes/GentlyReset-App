import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { spacing } from '@/design-system';

const LOUNGE_ART = require('../../../../assets/images/onboarding/support-timing/support-mascot-lounge.png');
const ART_WIDTH = 716;
const ART_HEIGHT = 767;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;

const SHORT_PHONE_HEIGHT = 680;
const REGULAR_PHONE_HEIGHT = 900;
const MASCOT_HEIGHT_SHORT = 180;
const MASCOT_HEIGHT_REGULAR = 210;
const MASCOT_HEIGHT_TALL = 236;

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
 * Decorative lounge mascot under the support-timing tiles. Not interactive.
 */
export function LoungeMascot() {
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
        source={LOUNGE_ART}
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
    flexShrink: 0,
    pointerEvents: 'none',
  },
});
