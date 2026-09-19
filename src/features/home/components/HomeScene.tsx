import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { colors } from '@/design-system';
import { HomeMascot } from '@/features/home/components/HomeMascot';
import { getHomeCoverLayout } from '@/features/home/layout/homeSceneLayout';

const HOME_MORNING_ENVIRONMENT = require('../../../../assets/images/app/home-morning-environment.png');

type HomeSceneProps = {
  completed: boolean;
};

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
      <View style={[styles.sceneSpace, layout]}>
        <HomeMascot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    pointerEvents: 'none',
    backgroundColor: colors.background.sky,
  },
  image: {
    position: 'absolute',
  },
  sceneSpace: {
    position: 'absolute',
    overflow: 'visible',
  },
});
