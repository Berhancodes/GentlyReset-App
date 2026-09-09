import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { spacing } from '@/design-system';

const THINKING_LOG_ART = require('../../../../assets/images/mascot/mascot-thinking-log.png');
const ART_WIDTH = 1254;
const ART_HEIGHT = 1254;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;

/** Target size on a standard iPhone (~390×844). */
const MASCOT_MAX_WIDTH = 180;
const MASCOT_PREFERRED_WIDTH = 168;
const MASCOT_MIN_WIDTH = 112;

type ThinkingLogMascotProps = {
  gapAboveButton?: number;
};

/**
 * Decorative mascot for the "what brought you here today?" question.
 * Not interactive — does not participate in choice selection.
 */
export function ThinkingLogMascot({ gapAboveButton = spacing.md }: ThinkingLogMascotProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const sizedByHeight = Math.round(windowHeight * 0.195);
  const sizedByWidth = Math.round(windowWidth * 0.45);
  const mascotWidth = Math.min(
    MASCOT_MAX_WIDTH,
    Math.max(MASCOT_MIN_WIDTH, Math.min(MASCOT_PREFERRED_WIDTH, sizedByHeight, sizedByWidth)),
  );
  const mascotHeight = Math.round(mascotWidth / ART_ASPECT);

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[styles.wrap, { marginBottom: gapAboveButton }]}
    >
      <Image
        source={THINKING_LOG_ART}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{ width: mascotWidth, height: mascotHeight }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    pointerEvents: 'none',
  },
});
