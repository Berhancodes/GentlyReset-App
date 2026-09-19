import { Image, Platform, StyleSheet, View } from 'react-native';

type WorldBackgroundProps = {
  accessibilityLabel: string;
};

export function WorldBackground({ accessibilityLabel }: WorldBackgroundProps) {
  return (
    <View style={styles.frame} pointerEvents="none">
      <Image
        source={require('../../../../assets/images/app/world-friends-background.png')}
        accessibilityLabel={accessibilityLabel}
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
  },
  image: {
    width: '100%',
    height: '100%',
    ...Platform.select({
      web: { objectPosition: 'center 42%' },
      default: {
        transform: [{ scale: 1.06 }, { translateY: 10 }],
      },
    }),
  },
});
