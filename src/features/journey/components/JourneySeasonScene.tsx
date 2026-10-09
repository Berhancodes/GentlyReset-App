import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { VideoView } from 'expo-video';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors, motion, radius } from '@/design-system';
import { JOURNEY_SPRITES } from '@/features/journey/data/journeyChapterImages';
import {
  JOURNEY_SEASON_SCENES,
  type JourneyFallingPieceSpec,
  type JourneySeasonParticles,
} from '@/features/journey/data/journeySeasonScenes';
import { useJourneyMascotPlayer } from '@/features/journey/hooks/useJourneyMascotPlayer';
import { getJourneySeasonSceneLayout } from '@/features/journey/layout/journeyStageLayout';
import type { JourneySeason } from '@/features/journey/utils/getJourneySeason';

type JourneySeasonSceneProps = {
  season: JourneySeason;
  /** Journey tab is focused; the mascot only animates while visible. */
  active: boolean;
  /** Hides the idle mascot while the day-complete clip plays in his place. */
  mascotHidden?: boolean;
  /** Tapping the mascot opens today's details. */
  onPressMascot: () => void;
  /** Development builds only: long-press shortcut for testing. */
  onLongPressMascot?: () => void;
};

/**
 * Day 1 world for the current season: full-screen painting, ground shadow,
 * standing mascot and falling leaves, petals or snow. Sits behind the header
 * so the painting reaches the top edge.
 */
export function JourneySeasonScene({
  season,
  active,
  mascotHidden = false,
  onPressMascot,
  onLongPressMascot,
}: JourneySeasonSceneProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const mascotPlayer = useJourneyMascotPlayer(active);
  const scene = JOURNEY_SEASON_SCENES[season];
  const layout =
    size.width > 0 && size.height > 0 ? getJourneySeasonSceneLayout(size.width, size.height) : null;

  return (
    <View
      pointerEvents="box-none"
      style={styles.scene}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        if (width !== size.width || height !== size.height) {
          setSize({ width, height });
        }
      }}
    >
      {layout ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={styles.scene}
        >
          <Image source={scene.background} style={[styles.layer, layout.background]} />
          <Image
            source={JOURNEY_SPRITES.sceneMascotShadow}
            tintColor={scene.shadowTint}
            style={[styles.layer, layout.shadow]}
          />
          <View style={[styles.layer, layout.mascot, { opacity: mascotHidden ? 0 : 1 }]}>
            <VideoView
              player={mascotPlayer}
              nativeControls={false}
              allowsVideoFrameAnalysis={false}
              contentFit="contain"
              pointerEvents="none"
              style={{ width: layout.mascot.width, height: layout.mascot.height }}
            />
          </View>
          {scene.particles.pieces.map((piece) => (
            <FallingPiece
              key={`${season}-${piece.x}-${piece.y}`}
              particles={scene.particles}
              piece={piece}
              screenWidth={size.width}
              screenHeight={size.height}
            />
          ))}
        </View>
      ) : null}
      {layout ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open today's reset"
          onPress={onPressMascot}
          onLongPress={onLongPressMascot}
          style={[styles.layer, layout.mascot]}
        />
      ) : null}
    </View>
  );
}

type FallingPieceProps = {
  particles: JourneySeasonParticles;
  piece: JourneyFallingPieceSpec;
  screenWidth: number;
  screenHeight: number;
};

function FallingPiece({ particles, piece, screenWidth, screenHeight }: FallingPieceProps) {
  const reduceMotion = useReducedMotion() === true;
  const progress = useSharedValue(0.5);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(progress);
      progress.value = 0.5;
      return;
    }
    progress.value = 0;
    progress.value = withDelay(
      piece.delay,
      withRepeat(
        withTiming(1, { duration: motion.duration.journeyLeafFall, easing: Easing.linear }),
        -1,
      ),
    );
    return () => {
      cancelAnimation(progress);
    };
  }, [piece.delay, progress, reduceMotion]);

  const width = screenWidth * piece.size;
  const height = particles.kind === 'image' ? width * particles.aspect : width;
  const fallDistance = screenHeight * piece.fall;

  const animatedStyle = useAnimatedStyle(() => {
    const t = progress.value;
    const sway = Math.sin(t * Math.PI * 4) * motion.offset.journeyLeafSway;
    // Fade in at the top of the loop and out at the bottom so the restart is invisible.
    const opacity = Math.min(1, t * 6, (1 - t) * 6);
    return {
      opacity,
      transform: [
        { translateX: sway },
        { translateY: (t - 0.5) * fallDistance },
        { rotate: `${piece.rotate + Math.sin(t * Math.PI * 2) * 25}deg` },
      ],
    };
  });

  const frame = {
    left: screenWidth * piece.x - width / 2,
    top: screenHeight * piece.y - height / 2,
    width,
    height,
  };

  if (particles.kind === 'snow') {
    return <Animated.View style={[styles.layer, styles.snowflake, frame, animatedStyle]} />;
  }

  return <Animated.Image source={particles.source} style={[styles.layer, frame, animatedStyle]} />;
}

const styles = StyleSheet.create({
  scene: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  layer: {
    position: 'absolute',
  },
  snowflake: {
    borderRadius: radius.pill,
    backgroundColor: colors.overlay.snowflake,
  },
});
