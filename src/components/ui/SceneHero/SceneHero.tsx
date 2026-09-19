import { Image, type ImageSourcePropType, Platform, StyleSheet, View } from 'react-native';

type SceneHeroCrop = 'center' | 'mascot';

type SceneHeroProps = {
  source: ImageSourcePropType;
  accessibilityLabel: string;
  aspectRatio?: number;
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
    <View
      style={[
        styles.frame,
        aspectRatio != null ? { aspectRatio } : styles.frameFill,
        { borderRadius },
      ]}
    >
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
  frameFill: {
    flex: 1,
    minHeight: 0,
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
      web: {
        objectPosition: 'center 62%',
        transform: [{ scale: 1.16 }],
      },
      default: {
        transform: [{ scale: 1.16 }, { translateY: -10 }],
      },
    }),
  },
});
