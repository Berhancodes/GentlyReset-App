import {
  Image,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  type ImageStyle,
} from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { colors, shadows, spacing } from '@/design-system';

const WAVE_LOOP = require('../../../../assets/images/mascot/mascot-companion-loop.gif');
const WAVE_STILL = require('../../../../assets/images/mascot/mascot-companion-still.png');

const ART_WIDTH = 307;
const ART_HEIGHT = 291;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;
const MASCOT_SIZE_SCALE = 1.29;
const MASCOT_MAX_WIDTH = Math.round(280 * MASCOT_SIZE_SCALE);
const MASCOT_HEIGHT_FRACTION = 0.34 * MASCOT_SIZE_SCALE;

const WEB_WRAP_GLOW = {
  filter: [
    `drop-shadow(0 0 8px ${colors.overlay.mascotGlow})`,
    `drop-shadow(0 0 18px ${colors.overlay.mascotGlowCore})`,
    `drop-shadow(0 0 34px ${colors.overlay.mascotGlow})`,
  ].join(' '),
} as const;

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
  const artStyle = { width: artWidth, height: artHeight };

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Gently Reset companion"
      style={styles.root}
    >
      <View style={[styles.stage, artStyle]}>
        <Image
          source={WAVE_STILL}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[artStyle, styles.glowSilhouette]}
        />
        <Image
          source={reduceMotion ? WAVE_STILL : WAVE_LOOP}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[artStyle, Platform.OS === 'web' ? (WEB_WRAP_GLOW as ImageStyle) : null]}
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
  glowSilhouette: {
    position: 'absolute',
    tintColor: colors.accent.gold,
    opacity: 0.55,
    transform: [{ scale: 1.08 }],
    ...(Platform.OS === 'web' ? { filter: 'blur(14px)' } : shadows.mascotGlow),
  },
});
