import { Image, StyleSheet, View } from 'react-native';

import { JOURNEY_SPRITES } from '@/features/journey/data/journeyChapterImages';

export const JOURNEY_GROUND_HEIGHT = 96;

export function JourneyGroundDecor() {
  return (
    <View style={styles.root} accessibilityElementsHidden>
      <Image source={JOURNEY_SPRITES.groundStrip} resizeMode="cover" style={styles.strip} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: JOURNEY_GROUND_HEIGHT,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  strip: {
    width: '100%',
    height: JOURNEY_GROUND_HEIGHT,
  },
});
