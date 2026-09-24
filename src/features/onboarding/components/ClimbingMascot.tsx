import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { spacing } from '@/design-system';

const CLIMBING_ART = require('../../../../assets/images/onboarding/consistency/hardest-mascot-climb.png');
const ART_WIDTH = 1218;
const ART_HEIGHT = 1050;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;

/**
 * Decorative illustration for the "what's hardest for you?" question.
 * Not interactive — does not participate in choice selection.
 */
export function ClimbingMascot() {
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
        source={CLIMBING_ART}
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
