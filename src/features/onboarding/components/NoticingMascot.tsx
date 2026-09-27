import { memo, useMemo } from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { colors, spacing } from '@/design-system';

const NOTICE_LOOP = require('../../../../assets/images/mascot/mascot-noticing-loop.gif');
const NOTICE_STILL = require('../../../../assets/images/mascot/mascot-noticing-still.png');

const ART_WIDTH = 400;
const ART_HEIGHT = 415;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;
const MASCOT_MAX_WIDTH = 280;
const MASCOT_HEIGHT_FRACTION = 0.32;

/**
 * Noticing-story mascot. Plays the supplied detective loop unless Reduce Motion is on.
 */
export const NoticingMascot = memo(function NoticingMascot() {
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
  const imageSize = useMemo(() => ({ width: artWidth, height: artHeight }), [artHeight, artWidth]);

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Mascot noticing a small pattern"
      style={styles.root}
    >
      <Image
        source={reduceMotion ? NOTICE_STILL : NOTICE_LOOP}
        resizeMode="contain"
        fadeDuration={0}
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={imageSize}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.background.primary,
    pointerEvents: 'none',
  },
});
