import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { spacing } from '@/design-system';

const BUILD_LOOP = require('../../../../assets/images/mascot/mascot-building-loop.gif');
const BUILD_STILL = require('../../../../assets/images/mascot/mascot-building-still.png');

const ART_WIDTH = 347;
const ART_HEIGHT = 212;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;
const MASCOT_MAX_WIDTH = 320;
const MASCOT_HEIGHT_FRACTION = 0.24;

/**
 * Combined build-reset mascot. Plays the desk loop unless Reduce Motion is on.
 */
export function BuildingMascot() {
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
      accessibilityLabel="Mascot studying your answers"
      style={styles.root}
    >
      <Image
        source={reduceMotion ? BUILD_STILL : BUILD_LOOP}
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
