import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

const WORLD_ART = require('../../../../assets/images/mascot/mascot-thinking-world.png');
const ART_WIDTH = 1536;
const ART_HEIGHT = 1024;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;

/** Target width on a standard iPhone (~390×844). */
const ART_MAX_WIDTH = 260;
const ART_PREFERRED_WIDTH = 240;
const ART_MIN_WIDTH = 184;

/**
 * Decorative environment illustration for the "what brought you here today?" question.
 * Not interactive — does not participate in choice selection.
 */
export function ThinkingLogMascot() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const sizedByWidth = Math.round(windowWidth * 0.62);
  const sizedByHeight = Math.round(windowHeight * 0.19 * ART_ASPECT);
  const artWidth = Math.min(
    ART_MAX_WIDTH,
    Math.max(ART_MIN_WIDTH, Math.min(ART_PREFERRED_WIDTH, sizedByWidth, sizedByHeight)),
  );
  const artHeight = Math.round(artWidth / ART_ASPECT);

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={styles.wrap}
    >
      <Image
        source={WORLD_ART}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{ width: artWidth, height: artHeight }}
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
