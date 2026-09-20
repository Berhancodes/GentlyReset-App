import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { getHomeCoverLayout } from '@/features/home/layout/homeSceneLayout';

const HOME_MORNING_ENVIRONMENT = require('../../../../assets/images/app/home-morning-environment.png');

type HomeSceneProps = {
  completed: boolean;
};

/**
 * Full-bleed Home landscape. The environment PNG already includes the mascot
 * on the log — do not composite `HomeMascot` here or the character doubles.
 */
export function HomeScene({ completed }: HomeSceneProps) {
  const { width, height } = useWindowDimensions();
  const layout = getHomeCoverLayout(width, height);

  return (
    <View
      style={styles.frame}
      accessible
      accessibilityLabel={
        completed
          ? 'Mascot in the morning scene after today’s reset'
          : 'Mascot sipping tea on a log at sunrise'
      }
    >
      <Image
        source={HOME_MORNING_ENVIRONMENT}
        accessibilityElementsHidden
        importantForAccessibility="no"
        accessibilityIgnoresInvertColors
        resizeMode="cover"
        style={[styles.image, layout]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    pointerEvents: 'none',
    backgroundColor: 'transparent',
  },
  image: {
    position: 'absolute',
  },
});
