import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import type { AppTextColor } from '@/components/ui/Text';
import { motion, spacing, type TextVariant } from '@/design-system';
import {
  type TypewriterLine,
  useStagedTypewriter,
} from '@/features/onboarding/hooks/useStagedTypewriter';

export type StoryCopyLine = TypewriterLine & {
  color: AppTextColor;
  variant: TextVariant;
};

type StoryCopyProps = {
  lines: readonly StoryCopyLine[];
  onFinished?: () => void;
};

function FadingLine({ active, children }: { active: boolean; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(active || reduceMotion ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(active || reduceMotion ? 1 : 0, {
      duration: reduceMotion ? 0 : motion.typewriter.lineFadeMs,
      easing: Easing.out(Easing.cubic),
    });
  }, [active, opacity, reduceMotion]);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.typed, fadeStyle]}>{children}</Animated.View>;
}

export function StoryCopy({ lines, onFinished }: StoryCopyProps) {
  const signature = lines.map((line) => `${line.id}:${line.text}`).join('\n');

  return <TypedStoryCopy key={signature} lines={lines} onFinished={onFinished} />;
}

function TypedStoryCopy({ lines, onFinished }: StoryCopyProps) {
  const { isComplete, isLineActive, revealRemaining, visibleText } = useStagedTypewriter(lines);

  useEffect(() => {
    if (isComplete) {
      onFinished?.();
    }
  }, [isComplete, onFinished]);
  const spoken = lines.map((line) => line.text).join(' ');

  return (
    <Pressable
      accessibilityRole="text"
      accessibilityLabel={spoken}
      accessibilityHint="Reveals the rest of this message"
      onPress={revealRemaining}
    >
      <View style={styles.stack}>
        {lines.map((line, index) => (
          <View key={line.id} style={styles.line}>
            <View accessibilityElementsHidden importantForAccessibility="no" style={styles.reserve}>
              <AppText variant={line.variant} color={line.color}>
                {line.text}
              </AppText>
            </View>
            <FadingLine active={isLineActive(index)}>
              <AppText variant={line.variant} color={line.color}>
                {visibleText(index)}
              </AppText>
            </FadingLine>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  line: {
    position: 'relative',
  },
  reserve: {
    opacity: 0,
  },
  typed: {
    ...StyleSheet.absoluteFill,
  },
});
