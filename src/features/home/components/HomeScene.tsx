import { Image, Platform, StyleSheet, View } from 'react-native';

const HOME_MORNING_BACKGROUND = require('../../../../assets/images/app/home-morning-background.png');

type HomeSceneProps = {
  completed: boolean;
};

export function HomeScene({ completed }: HomeSceneProps) {
  return (
    <View style={styles.frame}>
      <Image
        source={HOME_MORNING_BACKGROUND}
        accessibilityLabel={
          completed
            ? 'Mascot in the morning scene after today’s reset'
            : 'Mascot sipping tea on a log at sunrise'
        }
        accessibilityIgnoresInvertColors
        resizeMode="cover"
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  image: {
    width: '100%',
    height: '100%',
    ...Platform.select({
      web: { objectPosition: '32% 78%' },
      default: {
        transform: [{ scale: 1.06 }, { translateY: 18 }],
      },
    }),
  },
});
