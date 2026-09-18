import { StyleSheet, View } from 'react-native';

import { SceneHero } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';

const HOME_MORNING_SCENE = require('../../../../assets/images/app/home-morning-scene.png');

const COMPACT_ASPECT = 1.85;

type HomeSceneProps = {
  completed: boolean;
};

export function HomeScene({ completed }: HomeSceneProps) {
  return (
    <View style={[styles.frame, completed ? styles.frameCompleted : null]}>
      <SceneHero
        source={HOME_MORNING_SCENE}
        accessibilityLabel={
          completed
            ? 'Mascot in the morning scene after today’s reset'
            : 'Mascot sipping tea on a log at sunrise'
        }
        aspectRatio={COMPACT_ASPECT}
        borderRadius={radius.card}
        crop="mascot"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  frameCompleted: {
    padding: spacing.xxs,
    backgroundColor: colors.accent.gold,
  },
});
