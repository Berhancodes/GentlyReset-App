import { Image, type ImageSourcePropType, Platform, StyleSheet, View } from 'react-native';

type SceneHeroCrop = 'center' | 'mascot';

type SceneHeroProps = {
  source: ImageSourcePropType;
  accessibilityLabel: string;
  aspectRatio: number;
  borderRadius?: number;
  crop?: SceneHeroCrop;
};

export function SceneHero({
  source,
  accessibilityLabel,
  aspectRatio,
  borderRadius = 0,
  crop = 'center',
}: SceneHeroProps) {
  return (
    <View style={[styles.frame, { aspectRatio, borderRadius }]}>
      <Image
        source={source}
        accessibilityLabel={accessibilityLabel}
        accessibilityIgnoresInvertColors
        resizeMode="cover"
        style={crop === 'mascot' ? styles.imageMascot : styles.image}
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
  imageMascot: {
    width: '100%',
    height: '100%',
    ...Platform.select({
      web: { objectPosition: 'center 88%' },
      default: {
        transform: [{ scale: 1.18 }, { translateY: -36 }],
      },
    }),
  },
});
