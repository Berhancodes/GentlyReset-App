import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';

type JournalSpriteProps = {
  source: ImageSourcePropType;
  width: number | `${number}%`;
  height?: number;
  aspectRatio: number;
  left?: number | `${number}%`;
  right?: number | `${number}%`;
  top?: number | `${number}%`;
  bottom?: number | `${number}%`;
  zIndex: number;
  opacity?: number;
};

/** Decoration artwork sized by a wrapper so the PNG cannot collapse on web. */
export function JournalSprite({
  source,
  width,
  height,
  aspectRatio,
  left,
  right,
  top,
  bottom,
  zIndex,
  opacity = 1,
}: JournalSpriteProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={{
        position: 'absolute',
        width,
        height,
        aspectRatio: height == null ? aspectRatio : undefined,
        left,
        right,
        top,
        bottom,
        zIndex,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <Image
        source={source}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
});
