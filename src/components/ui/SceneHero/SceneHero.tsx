import { Image, type ImageSourcePropType, Platform, StyleSheet, View } from 'react-native';

type SceneHeroProps = {
  source: ImageSourcePropType;
  accessibilityLabel: string;
  aspectRatio: number;
  borderRadius?: number;
};

export function SceneHero({
  source,
  accessibilityLabel,
  aspectRatio,
  borderRadius = 0,
}: SceneHeroProps) {
  return (
    <View style={[styles.frame, { aspectRatio, borderRadius }]}>
      <Image
        source={source}
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
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    ...Platform.select({
      web: { objectPosition: 'center 58%' },
      default: {},
    }),
  },
});
