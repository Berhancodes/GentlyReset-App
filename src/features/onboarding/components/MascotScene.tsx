import type { ImageSourcePropType } from 'react-native';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { spacing } from '@/design-system';

type MascotSceneProps = {
  source: ImageSourcePropType;
  aspectRatio?: number;
  maxWidth?: number;
  size?: 'default' | 'large';
  accessibilityLabel?: string;
};

/**
 * Grounded mascot / environment art that sits on the cream page with no card.
 */
export function MascotScene({
  source,
  aspectRatio = 1,
  maxWidth,
  size = 'default',
  accessibilityLabel,
}: MascotSceneProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const preferredWidth = maxWidth ?? (size === 'large' ? 300 : 220);
  const heightFraction = size === 'large' ? 0.3 : 0.22;
  const width = Math.min(
    preferredWidth,
    windowWidth - spacing.lg * 2,
    Math.round(windowHeight * heightFraction * aspectRatio),
  );
  const height = Math.round(width / aspectRatio);

  return (
    <View
      accessible={Boolean(accessibilityLabel)}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      style={styles.wrap}
    >
      <Image
        source={source}
        resizeMode="contain"
        accessibilityElementsHidden={!accessibilityLabel}
        importantForAccessibility={accessibilityLabel ? 'yes' : 'no'}
        style={{ width, height }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    pointerEvents: 'none',
  },
});
