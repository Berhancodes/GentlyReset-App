import type { ImageSourcePropType } from 'react-native';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { spacing } from '@/design-system';
import type { OnboardingIllustrationSize } from '@/features/onboarding/types/onboarding';

const HEIGHT_FRACTION: Record<OnboardingIllustrationSize, number> = {
  default: 0.28,
  large: 0.36,
  hero: 0.42,
};

const MAX_WIDTH: Record<OnboardingIllustrationSize, number> = {
  default: 260,
  large: 320,
  hero: 360,
};

type MascotSceneProps = {
  source: ImageSourcePropType;
  aspectRatio?: number;
  maxWidth?: number;
  size?: OnboardingIllustrationSize;
  accessibilityLabel?: string;
};

/**
 * Grounded mascot / environment art that sits on the cream page with no card.
 * Scales by max height/width so portrait scenes and landscape desks both fit.
 */
export function MascotScene({
  source,
  aspectRatio = 1,
  maxWidth,
  size = 'default',
  accessibilityLabel,
}: MascotSceneProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const maxArtHeight = Math.round(windowHeight * HEIGHT_FRACTION[size]);
  const maxArtWidth = Math.min(maxWidth ?? MAX_WIDTH[size], windowWidth - spacing.lg * 2);
  const width = Math.min(maxArtWidth, Math.round(maxArtHeight * aspectRatio));
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
    width: '100%',
    pointerEvents: 'none',
  },
});
