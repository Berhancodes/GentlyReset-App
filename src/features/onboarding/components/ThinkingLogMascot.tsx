import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { spacing } from '@/design-system';

const THINKING_LOG_ART = require('../../../../assets/images/mascot/mascot-thinking-log.png');
const ART_WIDTH = 1254;
const ART_HEIGHT = 1254;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;

/** Compact size so the mascot sits with the answer grid on one phone screen. */
const MASCOT_MAX_WIDTH = 120;
const MASCOT_PREFERRED_WIDTH = 112;
const MASCOT_MIN_WIDTH = 100;

/**
 * Decorative mascot for the "what brought you here today?" question.
 * Not interactive — does not participate in choice selection.
 */
export function ThinkingLogMascot() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const sizedByHeight = Math.round(windowHeight * 0.13);
  const sizedByWidth = Math.round(windowWidth * 0.3);
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
      style={styles.wrap}
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
    marginTop: spacing.xs,
  },
});
