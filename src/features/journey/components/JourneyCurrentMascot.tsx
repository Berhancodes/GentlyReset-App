import { Image, StyleSheet, View } from 'react-native';

import { JOURNEY_SPRITES } from '@/features/journey/data/journeyChapterImages';

const MASCOT_SIZE = 54;
const CELEBRATE_SIZE = 62;

type JourneyMascotPose = 'walk' | 'idle' | 'sit' | 'celebrate';

type JourneyCurrentMascotProps = {
  pose: JourneyMascotPose;
};

export function getJourneyMascotPose(day: number, checkpoint: boolean): JourneyMascotPose {
  if (day === 30) {
    return 'celebrate';
  }
  if (checkpoint) {
    return 'sit';
  }
  return 'walk';
}

export function JourneyCurrentMascot({ pose }: JourneyCurrentMascotProps) {
  const source =
    pose === 'celebrate'
      ? JOURNEY_SPRITES.mascotCelebrate
      : pose === 'sit'
        ? JOURNEY_SPRITES.mascotSit
        : pose === 'idle'
          ? JOURNEY_SPRITES.mascotIdle
          : JOURNEY_SPRITES.mascotWalk;
  const size = pose === 'celebrate' ? CELEBRATE_SIZE : MASCOT_SIZE;

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[styles.wrap, { width: size, height: size }]}
    >
      <Image
        source={source}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
