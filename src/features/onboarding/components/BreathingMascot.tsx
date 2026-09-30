import { Image, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';

const BREATHE_LOOP = require('../../../../assets/images/mascot/mascot-breathe.gif');
const BREATHE_STILL = require('../../../../assets/images/mascot/mascot-breathe-still.png');

const ART_WIDTH = 384;
const ART_HEIGHT = 408;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;
const MASCOT_SIZE_SCALE = 1.2;
const MASCOT_MAX_WIDTH = Math.round(200 * MASCOT_SIZE_SCALE);
const MASCOT_HEIGHT_FRACTION = 0.24 * MASCOT_SIZE_SCALE;
const MASCOT_LOWER_OFFSET_FRACTION = 0.1;

/**
 * Reminder-screen mascot. Plays the supplied breath loop unless Reduce Motion is on.
 */
export function BreathingMascot() {
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
      accessibilityLabel="Take a deep breath"
      style={[styles.root, { marginTop: Math.round(windowHeight * MASCOT_LOWER_OFFSET_FRACTION) }]}
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
          source={reduceMotion ? BREATHE_STILL : BREATHE_LOOP}
          resizeMode="contain"
          fadeDuration={0}
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{ width: artWidth, height: artHeight }}
        />
      </View>
      <AppText variant="onboardingHelper" color="helper" align="center">
        Take a deep breath
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing.sm,
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
