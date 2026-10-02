import { memo, useMemo } from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { spacing } from '@/design-system';

const HANG_LOOP = require('../../../../assets/images/onboarding/consistency/hardest-mascot-hang.gif');
const HANG_STILL = require('../../../../assets/images/onboarding/consistency/hardest-mascot-hang-still.png');

const GIF_WIDTH = 720;
const GIF_HEIGHT = 1280;
const GIF_ASPECT = GIF_WIDTH / GIF_HEIGHT;
/** Opaque hang + bar, measured from hardest-mascot-hang-still.png. */
const CONTENT_TOP = 343;
const CONTENT_BOTTOM = 1257;
const CONTENT_HEIGHT = CONTENT_BOTTOM - CONTENT_TOP;
const MASCOT_MAX_WIDTH = 280;
const MASCOT_HEIGHT_FRACTION = 0.38;
/** How much of the hang loop stays in view under the last choice card. */
const PEEK_FRACTION = 0.5;

/**
 * "What's hardest" mascot. Plays the hang loop unless Reduce Motion is on.
 */
export const ClimbingMascot = memo(function ClimbingMascot() {
  const reduceMotion = useReducedMotion();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const availableWidth = Math.round(windowWidth - spacing.lg * 2);
  const maxVisibleHeight = Math.round(windowHeight * MASCOT_HEIGHT_FRACTION);
  const widthFromVisible = Math.round(maxVisibleHeight * (GIF_WIDTH / CONTENT_HEIGHT));
  const artWidth = Math.max(
    spacing.xxxl,
    Math.min(availableWidth, widthFromVisible, MASCOT_MAX_WIDTH),
  );
  const fullHeight = Math.round(artWidth / GIF_ASPECT);
  const cropTop = Math.round(fullHeight * (CONTENT_TOP / GIF_HEIGHT));
  const visibleHeight = Math.round(fullHeight * (CONTENT_HEIGHT / GIF_HEIGHT) * PEEK_FRACTION);
  const imageSize = useMemo(
    () => ({ width: artWidth, height: fullHeight, marginTop: -cropTop }),
    [artWidth, cropTop, fullHeight],
  );
  const frameSize = useMemo(
    () => ({ width: artWidth, height: visibleHeight }),
    [artWidth, visibleHeight],
  );

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Mascot struggling to hang on"
      style={styles.wrap}
    >
      <View style={[styles.frame, frameSize]}>
        <Image
          source={reduceMotion ? HANG_STILL : HANG_LOOP}
          resizeMode="contain"
          fadeDuration={0}
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={imageSize}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginTop: spacing.xs,
    pointerEvents: 'none',
  },
  frame: {
    overflow: 'hidden',
  },
});
