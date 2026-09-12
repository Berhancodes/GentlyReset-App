import { Image, type ImageSourcePropType, StyleSheet, View } from 'react-native';

type SceneHeroProps = {
  source: ImageSourcePropType;
  accessibilityLabel: string;
  aspectRatio: number;
};

export function SceneHero({ source, accessibilityLabel, aspectRatio }: SceneHeroProps) {
  return (
    <View style={[styles.frame, { aspectRatio }]}>
      <Image
        source={source}
        accessibilityLabel={accessibilityLabel}
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
