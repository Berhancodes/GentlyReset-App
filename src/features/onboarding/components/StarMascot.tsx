import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { spacing } from '@/design-system';

const STAR_ART = require('../../../../assets/images/onboarding/reset-reason/reset-mascot-star.png');
const ART_WIDTH = 1165;
const ART_HEIGHT = 1218;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;

/**
 * Decorative illustration for the "I'm doing this because..." question.
 * Not interactive — does not participate in text entry.
 */
export function StarMascot() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const availableWidth = Math.round(windowWidth - spacing.lg * 2);
  const maxHeight = Math.round(windowHeight * 0.28);
  const widthFromHeight = Math.round(maxHeight * ART_ASPECT);
  const artWidth = Math.max(spacing.xxxl, Math.min(availableWidth, widthFromHeight));
  const artHeight = Math.round(artWidth / ART_ASPECT);

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={styles.wrap}
    >
      <Image
        source={STAR_ART}
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
