import { useEffect, type ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { MascotIcon } from '@/components/ui';
import { colors } from '@/design-system';
import { JOURNEY_SEASON_SCENES } from '@/features/journey/data/journeySeasonScenes';
import type { JourneySeason } from '@/features/journey/utils/getJourneySeason';

/**
 * Just three pieces of the season, falling slowly and far apart. `x` is a
 * fraction of the screen width, `size` of the width too, `ms` one full fall.
 */
const PIECES = [
  { x: 0.18, size: 0.06, ms: 16000, delay: 0, spin: 220, sway: 26 },
  { x: 0.72, size: 0.05, ms: 19000, delay: 6000, spin: -180, sway: 20 },
  { x: 0.46, size: 0.045, ms: 22000, delay: 12000, spin: 260, sway: 30 },
] as const;

type HomeSeasonDriftProps = {
  season: JourneySeason;
};

/** A few leaves, petals or snowflakes from the real season drifting down behind Home. */
export function HomeSeasonDrift({ season }: HomeSeasonDriftProps) {
  const reduceMotion = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const particles = JOURNEY_SEASON_SCENES[season].particles;

  if (reduceMotion) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}
    >
      {PIECES.map((piece) => {
        const size = piece.size * width;
        return (
          <FallingPiece
            key={piece.x}
            left={piece.x * width}
            fall={height + size * 2}
            ms={piece.ms}
            delay={piece.delay}
            spin={piece.spin}
            sway={piece.sway}
          >
            {particles.kind === 'image' ? (
              <Animated.Image
                source={particles.source}
                resizeMode="contain"
                style={{ width: size, height: size * particles.aspect }}
              />
            ) : (
              <MascotIcon name="snow" size={size * 0.7} color={colors.journeyShadow.cool} />
            )}
          </FallingPiece>
        );
      })}
    </View>
  );
}

type FallingPieceProps = {
  left: number;
  fall: number;
  ms: number;
  delay: number;
  spin: number;
  sway: number;
  children: ReactNode;
};

function FallingPiece({ left, fall, ms, delay, spin, sway, children }: FallingPieceProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: ms, easing: Easing.linear }), -1, false),
    );
  }, [delay, ms, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value <= 0 ? 0 : 0.75,
    transform: [
      { translateY: -40 + progress.value * fall },
      { translateX: Math.sin(progress.value * Math.PI * 4) * sway },
      { rotate: `${progress.value * spin}deg` },
    ],
  }));

  return <Animated.View style={[styles.piece, { left }, style]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 0,
  },
});
