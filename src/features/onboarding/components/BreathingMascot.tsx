import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { spacing } from '@/design-system';

const BREATHE_LOOP = require('../../../../assets/images/mascot/mascot-breathe.gif');
const BREATHE_STILL = require('../../../../assets/images/mascot/mascot-breathe-still.png');

const ART_WIDTH = 385;
const ART_HEIGHT = 408;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;
const MASCOT_MAX_WIDTH = 200;
const MASCOT_LOWER_OFFSET_FRACTION = 0.1;

/**
 * Reminder-screen mascot. Plays the supplied breath loop unless Reduce Motion is on.
 */
export function BreathingMascot() {
  const reduceMotion = useReducedMotion();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const availableWidth = Math.round(windowWidth - spacing.lg * 2);
  const maxHeight = Math.round(windowHeight * 0.24);
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
      <Image
        source={reduceMotion ? BREATHE_STILL : BREATHE_LOOP}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{ width: artWidth, height: artHeight }}
      />
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
});
