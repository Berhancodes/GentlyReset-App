import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { spacing } from '@/design-system';

const ROCK_ART = require('../../../../assets/images/onboarding/reason/reason-mascot-rock.png');
const ART_WIDTH = 796;
const ART_HEIGHT = 422;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;

/**
 * Decorative environment illustration for the "what brought you here today?" question.
 * Not interactive — does not participate in choice selection.
 */
export function ThinkingLogMascot() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const availableWidth = Math.round(windowWidth - spacing.lg * 2);
  const maxHeight = Math.round(windowHeight * 0.26);
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
        source={ROCK_ART}
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
