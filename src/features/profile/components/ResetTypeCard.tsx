import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  radius,
  spacing,
  textVariants,
} from '@/design-system';
import { STAGE_POSE_ART } from '@/features/onboarding/stage/stagePoses';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';

const FLIP_MS = 420;
const PORTRAIT = STAGE_POSE_ART['react-warm'];
const PORTRAIT_HEIGHT = 140;
const PANEL_HEIGHT = 150;

type ResetTypeCardProps = {
  name: string;
  truth: string;
  strengths: readonly string[];
  challenges: readonly string[];
  approach: string;
  helps: string;
};

/**
 * Your reset type as a keepsake card: his portrait, your type, the one-line
 * truth and your strengths. Tap to flip to what gets in the way and how the reset helps.
 */
export function ResetTypeCard({
  name,
  truth,
  strengths,
  challenges,
  approach,
  helps,
}: ResetTypeCardProps) {
  const reduceMotion = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const turn = useSharedValue(0);

  useEffect(() => {
    turn.value = withTiming(flipped ? 1 : 0, { duration: reduceMotion ? 0 : FLIP_MS });
  }, [flipped, reduceMotion, turn]);

  // Squeeze to edge-on, swap faces at the halfway point, open back out.
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      { scaleX: Math.max(0.02, Math.abs(Math.cos(turn.value * Math.PI))) },
    ],
  }));
  const frontStyle = useAnimatedStyle(() => ({
    opacity: interpolate(turn.value, [0.49, 0.5], [1, 0], 'clamp'),
  }));
  const backStyle = useAnimatedStyle(() => ({
    opacity: interpolate(turn.value, [0.5, 0.51], [0, 1], 'clamp'),
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        flipped
          ? `What gets in the way: ${challenges.join(', ')}. How your reset helps: ${approach}.`
          : `Your reset type, ${name}. ${truth}. Strengths: ${strengths.join(', ')}.`
      }
      accessibilityHint="Flips the card"
      onPress={() => setFlipped((current) => !current)}
    >
      <Animated.View style={[styles.card, cardStyle]}>
        <Animated.View style={frontStyle} pointerEvents={flipped ? 'none' : 'auto'}>
          <View style={styles.panel}>
            <Image
              source={PORTRAIT.source}
              resizeMode="contain"
              accessibilityElementsHidden
              importantForAccessibility="no"
              style={{
                height: PORTRAIT_HEIGHT,
                width: (PORTRAIT.width / PORTRAIT.height) * PORTRAIT_HEIGHT,
                marginBottom: -spacing.xxs,
              }}
            />
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
              Your reset type
            </Text>
            <Text style={styles.name} maxFontSizeMultiplier={1.25}>
              {name}
            </Text>
            <Text style={styles.truth} maxFontSizeMultiplier={1.3}>
              {sentence(truth)}
            </Text>
            <Chips items={strengths} />
          </View>
        </Animated.View>
        <Animated.View style={[styles.back, backStyle]} pointerEvents={flipped ? 'auto' : 'none'}>
          <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
            What gets in the way
          </Text>
          <Chips items={challenges} />
          <Text style={[styles.eyebrow, styles.gap]} maxFontSizeMultiplier={1.3}>
            How your reset helps
          </Text>
          <Text style={styles.approach} maxFontSizeMultiplier={1.25}>
            {capitalizeHeading(approach)}
          </Text>
          <Text style={styles.truth} maxFontSizeMultiplier={1.3}>
            {sentence(helps)}
          </Text>
        </Animated.View>
        <Text style={styles.flipNote} maxFontSizeMultiplier={1.3}>
          {flipped ? 'Tap to flip back' : 'Tap to flip'}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

function Chips({ items }: { items: readonly string[] }) {
  return (
    <View style={styles.chips}>
      {items.map((item) => (
        <Text key={item} style={styles.chip} maxFontSizeMultiplier={1.3}>
          {capitalizeHeading(item)}
        </Text>
      ))}
    </View>
  );
}

/** Profile copy is stored lowercase; capitalise each sentence. */
function sentence(text: string): string {
  return text.replace(/(^|[.!?]\s+)([a-z])/g, (_, lead: string, letter: string) => {
    return `${lead}${letter.toUpperCase()}`;
  });
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
    borderRadius: radius.xl,
    backgroundColor: colors.stage.chip,
    shadowColor: colors.stage.chipShadow,
    shadowOpacity: 0.2,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  panel: {
    height: PANEL_HEIGHT,
    borderRadius: radius.lg,
    backgroundColor: colors.stage.chipSelected,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  copy: {
    alignItems: 'center',
    gap: spacing.xxs,
    paddingTop: spacing.sm,
  },
  back: {
    ...StyleSheet.absoluteFill,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  gap: {
    marginTop: spacing.sm,
  },
  eyebrow: {
    ...textVariants.stageEyebrow,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  name: {
    ...textVariants.stageTitle,
    color: colors.text.primary,
    textAlign: 'center',
  },
  approach: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
    textAlign: 'center',
  },
  truth: {
    ...textVariants.stageSubtitle,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  chip: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
    backgroundColor: colors.stage.floor,
    borderWidth: 1.5,
    borderColor: colors.stage.chipBorder,
    borderRadius: radius.pill,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
  },
  flipNote: {
    marginTop: spacing.sm,
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.tab,
    fontWeight: fontWeights.bold,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
});
