import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { colors, motion, radius } from '@/design-system';

const PIECE_COUNT = 22;

type ConfettiPiece = {
  /** Launch direction in radians; mostly upward. */
  angle: number;
  /** 0.5–1, scales how far the piece travels. */
  power: number;
  spin: number;
  width: number;
  height: number;
  round: boolean;
  color: string;
};

function makePieces(): ConfettiPiece[] {
  const palette = colors.journeySteps.confetti;
  return Array.from({ length: PIECE_COUNT }, (_, index) => {
    const round = index % 3 === 0;
    const size = 6 + Math.random() * 4;
    return {
      angle: -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1,
      power: 0.5 + Math.random() * 0.5,
      spin: (Math.random() - 0.5) * 720,
      width: size,
      height: round ? size : size * 0.5,
      round,
      color: palette[index % palette.length] ?? colors.accent.gold,
    };
  });
}

type JourneyConfettiProps = {
  /** Changes to fire a new burst; 0 never fires. */
  burstKey: number;
  /** Burst origin in this layer's coordinates. */
  originX: number;
  originY: number;
  /** Scales how far and how big the burst is; 1 is the tick-box size. */
  power?: number;
};

/** A small celebratory burst that pops up from a point and falls away. */
export function JourneyConfetti({ burstKey, originX, originY, power = 1 }: JourneyConfettiProps) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(1);
  // Shuffled once per sheet; every burst reuses the same scatter.
  const [pieces] = useState(makePieces);

  useEffect(() => {
    if (burstKey === 0 || reduceMotion) {
      return;
    }
    cancelAnimation(progress);
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: motion.duration.journeyConfetti,
      easing: Easing.linear,
    });
  }, [burstKey, progress, reduceMotion]);

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.layer}
    >
      {pieces.map((piece, index) => (
        <Piece
          key={`${burstKey}-${index}`}
          piece={piece}
          progress={progress}
          originX={originX}
          originY={originY}
          power={power}
        />
      ))}
    </View>
  );
}

type PieceProps = {
  piece: ConfettiPiece;
  progress: SharedValue<number>;
  originX: number;
  originY: number;
  power: number;
};

function Piece({ piece, progress, originX, originY, power }: PieceProps) {
  const style = useAnimatedStyle(() => {
    const t = progress.value;
    // Fast launch that slows down, plus gravity pulling the piece back down.
    const launch = 1 - (1 - t) * (1 - t);
    const spread = motion.offset.journeyConfettiSpread * piece.power * power;
    const lift = motion.offset.journeyConfettiLift * piece.power * power;
    return {
      opacity: t >= 1 ? 0 : Math.min(1, (1 - t) * 3),
      transform: [
        { translateX: Math.cos(piece.angle) * spread * launch },
        {
          translateY:
            Math.sin(piece.angle) * lift * launch +
            motion.offset.journeyConfettiFall * power * t * t,
        },
        { rotate: `${piece.spin * t}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: originX - (piece.width * Math.sqrt(power)) / 2,
          top: originY - (piece.height * Math.sqrt(power)) / 2,
          width: piece.width * Math.sqrt(power),
          height: piece.height * Math.sqrt(power),
          borderRadius: piece.round ? radius.pill : 1,
          backgroundColor: piece.color,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    overflow: 'visible',
    zIndex: 5,
  },
  piece: {
    position: 'absolute',
  },
});
