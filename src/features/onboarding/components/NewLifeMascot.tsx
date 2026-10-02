import { memo, useMemo } from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { spacing } from '@/design-system';

const BOX_LOOP = require('../../../../assets/images/onboarding/new-life/new-life-mascot-box.gif');
const BOX_STILL = require('../../../../assets/images/onboarding/new-life/new-life-mascot-box-still.png');

const GIF_WIDTH = 720;
const GIF_HEIGHT = 1280;
const GIF_ASPECT = GIF_WIDTH / GIF_HEIGHT;
/** Opaque boxing mascot, measured from new-life-mascot-box-still.png. */
const CONTENT_TOP = 380;
const CONTENT_BOTTOM = 870;
const CONTENT_HEIGHT = CONTENT_BOTTOM - CONTENT_TOP;
const MASCOT_MAX_WIDTH = 340;
const MASCOT_HEIGHT_FRACTION = 0.32;

/**
 * New-life story mascot. Plays the boxing loop unless Reduce Motion is on.
 */
export const NewLifeMascot = memo(function NewLifeMascot() {
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
  const visibleHeight = Math.round(fullHeight * (CONTENT_HEIGHT / GIF_HEIGHT));
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
      accessibilityLabel="Mascot in boxing gloves"
      style={styles.wrap}
    >
      <View style={[styles.frame, frameSize]}>
        <Image
          source={reduceMotion ? BOX_STILL : BOX_LOOP}
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
    width: '100%',
    marginTop: spacing.xs,
    pointerEvents: 'none',
  },
  frame: {
    overflow: 'hidden',
  },
});
