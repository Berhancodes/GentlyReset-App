import { Image, StyleSheet, View } from 'react-native';

import { JOURNEY_SPRITES } from '@/features/journey/data/journeyChapterImages';
import { PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';

export type JourneyMascotPose = 'idle' | 'walk' | 'look' | 'cheer' | 'sit' | 'think' | 'wave';

const PATH_MASCOT_SIZE = 48;
const SHEET_MASCOT_SIZE = 56;
const CELEBRATE_SIZE = 62;

type JourneyCurrentMascotProps = {
  pose: JourneyMascotPose;
  size?: 'path' | 'sheet';
};

const POSE_SOURCE = {
  idle: JOURNEY_SPRITES.mascotIdle,
  walk: JOURNEY_SPRITES.mascotWalk,
  look: JOURNEY_SPRITES.mascotLook,
  cheer: JOURNEY_SPRITES.mascotCheer,
  sit: JOURNEY_SPRITES.mascotSit,
  think: JOURNEY_SPRITES.mascotThink,
  wave: JOURNEY_SPRITES.mascotWave,
} as const;

export function getJourneyPathMascotPose(day: number): JourneyMascotPose {
  if (day === PLAN_DAY_COUNT) {
    return 'cheer';
  }
  return 'idle';
}

export function getJourneySheetMascotPose(
  day: number,
  kind: 'current' | 'completed' | 'future',
): JourneyMascotPose {
  if (day === PLAN_DAY_COUNT) {
    return 'cheer';
  }
  if (kind === 'current') {
    return 'idle';
  }
  if (kind === 'completed') {
    return 'sit';
  }
  return 'look';
}

export function JourneyCurrentMascot({ pose, size = 'path' }: JourneyCurrentMascotProps) {
  const source = POSE_SOURCE[pose];
  const dimension =
    pose === 'cheer' && size === 'sheet'
      ? CELEBRATE_SIZE
      : size === 'sheet'
        ? SHEET_MASCOT_SIZE
        : PATH_MASCOT_SIZE;

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[styles.wrap, { width: dimension, height: dimension }]}
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
