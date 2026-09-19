import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { colors } from '@/design-system';

const HOME_MORNING_BACKGROUND = require('../../../../assets/images/app/home-morning-background.png');

/** Intrinsic size of `home-morning-background.png`. */
const ART_WIDTH = 474;
const ART_HEIGHT = 1024;
const ART_ASPECT = ART_WIDTH / ART_HEIGHT;

/**
 * Cover-crop focal point (0–1 in image space).
 * Horizontal: keep the mascot and cottage when side-cropping.
 * Vertical: keep sky behind the greeting; crop meadow edges first.
 */
const FOCUS_X = 0.48;
const FOCUS_Y = 0.38;

type CoverLayout = {
  width: number;
  height: number;
  left: number;
  top: number;
};

function getCoverLayout(viewWidth: number, viewHeight: number): CoverLayout {
  const safeHeight = Math.max(viewHeight, 1);
  const viewAspect = viewWidth / safeHeight;

  if (viewAspect > ART_ASPECT) {
    const width = viewWidth;
    const height = viewWidth / ART_ASPECT;
    const extra = Math.max(0, height - safeHeight);
    return {
      width,
      height,
      left: 0,
      top: -extra * FOCUS_Y,
    };
  }

  const height = safeHeight;
  const width = safeHeight * ART_ASPECT;
  const extra = Math.max(0, width - viewWidth);
  return {
    width,
    height,
    left: -extra * FOCUS_X,
    top: 0,
  };
}

type HomeSceneProps = {
  completed: boolean;
};

export function HomeScene({ completed }: HomeSceneProps) {
  const { width, height } = useWindowDimensions();
  const layout = getCoverLayout(width, height);

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
        style={[styles.image, layout]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    pointerEvents: 'none',
    backgroundColor: colors.background.sky,
  },
  image: {
    position: 'absolute',
  },
});
