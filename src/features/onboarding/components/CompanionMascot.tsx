import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { spacing } from '@/design-system';

const WAVE_LOOP = require('../../../../assets/images/mascot/mascot-companion-loop.gif');
const WAVE_STILL = require('../../../../assets/images/mascot/mascot-companion-still.png');

const ART_WIDTH = 306;
const ART_HEIGHT = 291;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;
const MASCOT_MAX_WIDTH = 280;
const MASCOT_HEIGHT_FRACTION = 0.34;

/**
 * Companion-story mascot. Plays the wave loop unless Reduce Motion is on.
 */
export function CompanionMascot() {
  const reduceMotion = useReducedMotion();
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
      accessibilityLabel="Gently Reset companion"
      style={styles.root}
    >
      <Image
        source={reduceMotion ? WAVE_STILL : WAVE_LOOP}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{ width: artWidth, height: artHeight }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    width: '100%',
    pointerEvents: 'none',
  },
});
