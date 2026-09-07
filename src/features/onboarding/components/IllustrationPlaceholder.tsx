import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui';
import { colors, radius, spacing } from '@/design-system';
import {
  getOnboardingIllustrationSource,
  ONBOARDING_ILLUSTRATIONS,
} from '@/features/onboarding/data/onboardingAssets';
import type { OnboardingIllustrationKey } from '@/features/onboarding/types/onboarding';

type IllustrationPlaceholderProps = {
  illustrationKey: OnboardingIllustrationKey;
  size?: 'default' | 'large';
};

export function IllustrationPlaceholder({
  illustrationKey,
  size = 'default',
}: IllustrationPlaceholderProps) {
  const meta = ONBOARDING_ILLUSTRATIONS[illustrationKey];
  const source = getOnboardingIllustrationSource(illustrationKey);
  const reduceMotion = useReducedMotion();
  const float = useSharedValue(0);
  const frameSize = size === 'large' ? 168 : 96;

  useEffect(() => {
    if (reduceMotion) {
      float.value = 0;
      return;
    }

    float.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [float, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: reduceMotion ? 0 : float.value * -6 }],
  }));

  return (
    <Animated.View
      accessibilityRole="image"
      accessibilityLabel={meta.label}
      style={[styles.root, animatedStyle]}
    >
      {source ? (
        <Image
          source={source}
          resizeMode="contain"
          style={{ width: frameSize, height: frameSize }}
        />
      ) : (
        <View style={[styles.stage, size === 'large' ? styles.stageLarge : styles.stageDefault]}>
          <View style={styles.face}>
            <View style={styles.eyeRow}>
              <View style={styles.eye} />
              <View style={styles.eye} />
            </View>
            <View style={styles.mouth} />
          </View>
          <Motif motif={meta.motif} />
        </View>
      )}
      <AppText variant="label" color="muted" align="center">
        {meta.label}
      </AppText>
    </Animated.View>
  );
}

function Motif({
  motif,
}: {
  motif: (typeof ONBOARDING_ILLUSTRATIONS)[OnboardingIllustrationKey]['motif'];
}) {
  switch (motif) {
    case 'carry':
      return <View style={styles.backpack} />;
    case 'detect':
      return <View style={styles.lens} />;
    case 'path':
      return <View style={styles.path} />;
    case 'desk':
      return <View style={styles.desk} />;
    case 'stack':
      return (
        <View style={styles.stackRow}>
          <View style={styles.stackBlock} />
          <View style={[styles.stackBlock, styles.stackMid]} />
          <View style={styles.stackBlock} />
        </View>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.selected,
    borderRadius: radius.xxl,
    gap: spacing.sm,
  },
  stageDefault: {
    width: 96,
    height: 96,
  },
  stageLarge: {
    width: 168,
    height: 168,
  },
  face: {
    width: 56,
    height: 56,
    borderRadius: radius.xxl,
    backgroundColor: colors.accent.peach,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  eyeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  eye: {
    width: 7,
    height: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.text.primary,
  },
  mouth: {
    width: 14,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.text.primary,
    opacity: 0.45,
  },
  backpack: {
    width: 54,
    height: 28,
    borderRadius: radius.md,
    backgroundColor: colors.accent.gold,
  },
  lens: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: colors.accent.sage,
  },
  path: {
    width: 72,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.sage,
  },
  desk: {
    width: 64,
    height: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.text.secondary,
  },
  stackRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'flex-end',
  },
  stackBlock: {
    width: 14,
    height: 18,
    borderRadius: radius.sm,
    backgroundColor: colors.accent.blue,
  },
  stackMid: {
    height: 26,
    backgroundColor: colors.accent.gold,
  },
});
