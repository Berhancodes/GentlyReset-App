import { Image, StyleSheet, View } from 'react-native';

import { spacing } from '@/design-system';
import { JOURNEY_SPRITES } from '@/features/journey/data/journeyChapterImages';

const SUN_SIZE = spacing.xxxl + spacing.xs;
const CLOUD_LEFT_WIDTH = spacing.xxxl + spacing.lg;
const CLOUD_RIGHT_WIDTH = spacing.xxxl + spacing.xxl;
const BUTTERFLY_SIZE = spacing.xl - spacing.xxs;

export function JourneySceneDecor() {
  return (
    <View pointerEvents="none" style={styles.root} accessibilityElementsHidden>
      <Image source={JOURNEY_SPRITES.sun} resizeMode="contain" style={styles.sun} />
      <Image source={JOURNEY_SPRITES.cloud} resizeMode="contain" style={styles.cloudLeft} />
      <Image source={JOURNEY_SPRITES.clouds} resizeMode="contain" style={styles.cloudRight} />
      <Image source={JOURNEY_SPRITES.butterfly} resizeMode="contain" style={styles.butterfly} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
  },
  sun: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.lg + spacing.xs,
    width: SUN_SIZE,
    height: SUN_SIZE,
  },
  cloudLeft: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.lg,
    width: CLOUD_LEFT_WIDTH,
    height: spacing.xl,
  },
  cloudRight: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xxxl + spacing.xl,
    width: CLOUD_RIGHT_WIDTH,
    height: spacing.xl + spacing.sm,
  },
  butterfly: {
    position: 'absolute',
    top: spacing.xxxl + spacing.lg,
    right: spacing.xxxl + spacing.xs,
    width: BUTTERFLY_SIZE,
    height: BUTTERFLY_SIZE,
  },
});
