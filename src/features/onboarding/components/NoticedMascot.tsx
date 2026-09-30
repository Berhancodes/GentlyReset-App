import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { spacing } from '@/design-system';

const NOTICED_ART = require('../../../../assets/images/onboarding/noticed/noticed-mascot.png');
const ART_WIDTH = 597;
const ART_HEIGHT = 331;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;
const MASCOT_MAX_WIDTH = 320;
const MASCOT_HEIGHT_FRACTION = 0.24;

/**
 * Decorative notepad mascot for the "here's what I noticed" screen.
 */
export function NoticedMascot() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const availableWidth = Math.round(windowWidth - spacing.lg * 2);
  const maxHeight = Math.round(windowHeight * MASCOT_HEIGHT_FRACTION);
  const widthFromHeight = Math.round(maxHeight * ART_ASPECT);
  const artWidth = Math.max(
    spacing.xxxl,
    Math.min(availableWidth, widthFromHeight, MASCOT_MAX_WIDTH),
  );
  const artHeight = Math.round(artWidth / ART_ASPECT);

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Mascot taking notes about what they noticed"
      style={styles.wrap}
    >
      <Image
        source={NOTICED_ART}
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
    width: '100%',
    pointerEvents: 'none',
  },
});
