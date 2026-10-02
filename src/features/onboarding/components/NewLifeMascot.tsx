import { memo, useMemo } from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { spacing } from '@/design-system';

const BOX_LOOP = require('../../../../assets/images/onboarding/new-life/new-life-mascot-box.gif');
const BOX_STILL = require('../../../../assets/images/onboarding/new-life/new-life-mascot-box-still.png');

const GIF_WIDTH = 720;
const GIF_HEIGHT = 1280;
/** Opaque boxing mascot, measured from new-life-mascot-box-still.png. */
const CONTENT_LEFT = 130;
const CONTENT_RIGHT = 620;
const CONTENT_TOP = 380;
const CONTENT_BOTTOM = 870;
const CONTENT_WIDTH = CONTENT_RIGHT - CONTENT_LEFT;
const CONTENT_HEIGHT = CONTENT_BOTTOM - CONTENT_TOP;
const MASCOT_MAX_WIDTH = 300;
const MASCOT_HEIGHT_FRACTION = 0.34;

/**
 * New-life story mascot. Plays the boxing loop unless Reduce Motion is on.
 */
export const NewLifeMascot = memo(function NewLifeMascot() {
  const reduceMotion = useReducedMotion();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const availableWidth = Math.round(windowWidth - spacing.lg * 2);
  const maxVisibleHeight = Math.round(windowHeight * MASCOT_HEIGHT_FRACTION);
  const widthFromVisible = Math.round(maxVisibleHeight * (CONTENT_WIDTH / CONTENT_HEIGHT));
  const visibleWidth = Math.max(
    spacing.xxxl,
    Math.min(availableWidth, widthFromVisible, MASCOT_MAX_WIDTH),
  );
  const scale = visibleWidth / CONTENT_WIDTH;
  const fullWidth = Math.round(GIF_WIDTH * scale);
  const fullHeight = Math.round(GIF_HEIGHT * scale);
  const cropLeft = Math.round(CONTENT_LEFT * scale);
  const cropTop = Math.round(CONTENT_TOP * scale);
  const visibleHeight = Math.round(CONTENT_HEIGHT * scale);
  const imageSize = useMemo(
    () => ({
      width: fullWidth,
      height: fullHeight,
      marginTop: -cropTop,
      marginLeft: -cropLeft,
    }),
    [cropLeft, cropTop, fullHeight, fullWidth],
  );
  const frameSize = useMemo(
    () => ({ width: visibleWidth, height: visibleHeight }),
    [visibleHeight, visibleWidth],
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
