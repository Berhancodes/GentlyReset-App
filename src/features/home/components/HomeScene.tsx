import { StyleSheet, View } from 'react-native';

import { SceneHero } from '@/components/ui';
import { radius } from '@/design-system';

const HOME_MORNING_SCENE = require('../../../../assets/images/app/home-morning-scene.png');

type HomeSceneProps = {
  completed: boolean;
};

export function HomeScene({ completed }: HomeSceneProps) {
  return (
    <View style={styles.frame}>
      <SceneHero
        source={HOME_MORNING_SCENE}
        accessibilityLabel={
          completed
            ? 'Mascot in the morning scene after today’s reset'
            : 'Mascot sipping tea on a log at sunrise'
        }
        borderRadius={radius.xl}
        crop="mascot"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    minHeight: 0,
    alignSelf: 'stretch',
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
});
