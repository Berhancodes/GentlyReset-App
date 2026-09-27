import { Image, StyleSheet } from 'react-native';

import { JOURNEY_SPRITES } from '@/features/journey/data/journeyChapterImages';
import type { JourneyRect } from '@/features/journey/layout/journeyStageLayout';

type JourneyProgressMascotProps = {
  rect: JourneyRect;
  playing: boolean;
};

export function JourneyProgressMascot({ rect, playing }: JourneyProgressMascotProps) {
  if (!playing) {
    return null;
  }

  return (
    <Image
      source={JOURNEY_SPRITES.mascotProgress}
      resizeMode="contain"
      fadeDuration={0}
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        styles.image,
        {
          width: rect.width,
          height: rect.height,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});
