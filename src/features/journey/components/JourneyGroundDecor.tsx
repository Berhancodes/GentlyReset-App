import { Image, StyleSheet, View } from 'react-native';

import { JOURNEY_SPRITES } from '@/features/journey/data/journeyChapterImages';

const STRIP_HEIGHT = 96;
const STRIP_WIDTH = 280;

type JourneyGroundDecorProps = {
  width: number;
};

export function JourneyGroundDecor({ width }: JourneyGroundDecorProps) {
  const copies = Math.max(1, Math.ceil(width / STRIP_WIDTH));

  return (
    <View pointerEvents="none" style={styles.root} accessibilityElementsHidden>
      <View style={styles.row}>
        {Array.from({ length: copies }, (_, index) => (
          <Image
            key={index}
            source={JOURNEY_SPRITES.groundStrip}
            resizeMode="cover"
            style={styles.strip}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: STRIP_HEIGHT,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    height: STRIP_HEIGHT,
  },
  strip: {
    width: STRIP_WIDTH,
    height: STRIP_HEIGHT,
  },
});
