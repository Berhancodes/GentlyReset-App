import { Image, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { colors, radius, shadows, spacing } from '@/design-system';

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
      <View style={[styles.stage, { width: artWidth, height: artHeight }]}>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[
            styles.glowOuter,
            {
              width: Math.round(artWidth * 1.18),
              height: Math.round(artHeight * 0.88),
            },
          ]}
        />
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[
            styles.glowInner,
            {
              width: Math.round(artWidth * 0.78),
              height: Math.round(artHeight * 0.62),
            },
          ]}
        />
        <Image
          source={reduceMotion ? WAVE_STILL : WAVE_LOOP}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{ width: artWidth, height: artHeight }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    width: '100%',
    pointerEvents: 'none',
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOuter: {
    position: 'absolute',
    borderRadius: radius.pill,
    backgroundColor: colors.overlay.mascotGlow,
    ...shadows.mascotGlow,
    ...(Platform.OS === 'web' ? { filter: 'blur(22px)' } : null),
  },
  glowInner: {
    position: 'absolute',
    borderRadius: radius.pill,
    backgroundColor: colors.overlay.mascotGlowCore,
    ...(Platform.OS === 'web' ? { filter: 'blur(16px)' } : null),
  },
});
