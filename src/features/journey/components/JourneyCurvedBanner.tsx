import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { colors, fontFamilies, fontWeights } from '@/design-system';

const FONT_SIZE = 30;
/** Rough advance of each glyph, as a fraction of the font size (heavy rounded caps). */
const GLYPH_WIDTH: Record<string, number> = { ' ': 0.32, I: 0.34, W: 1.0, M: 0.92, O: 0.84 };
const DEFAULT_GLYPH_WIDTH = 0.7;
/** Each letter pops in this long after the one before it. */
const LETTER_STAGGER_MS = 40;
const LETTER_POP_MS = 220;
const POP_DELAY_MS = 250;
const FADE_OUT_MS = 300;

type JourneyCurvedBannerProps = {
  text: string;
  /** Center of the circle the text follows. */
  centerX: number;
  centerY: number;
  radius: number;
  visible: boolean;
};

/** Text set on an arch over a point, letters popping in left to right. */
export function JourneyCurvedBanner({
  text,
  centerX,
  centerY,
  radius,
  visible,
}: JourneyCurvedBannerProps) {
  const reduceMotion = useReducedMotion();
  const reveal = useSharedValue(0);
  const letters = [...text];
  const advances = letters.map(
    (letter) => (GLYPH_WIDTH[letter] ?? DEFAULT_GLYPH_WIDTH) * FONT_SIZE,
  );
  const totalAngle = advances.reduce((sum, advance) => sum + advance, 0) / radius;
  const revealDuration = letters.length * LETTER_STAGGER_MS + LETTER_POP_MS;

  useEffect(() => {
    if (!visible) {
      reveal.value = withTiming(0, { duration: reduceMotion ? 0 : FADE_OUT_MS });
      return;
    }
    reveal.value = reduceMotion
      ? 1
      : withDelay(POP_DELAY_MS, withTiming(1, { duration: revealDuration, easing: Easing.linear }));
  }, [reduceMotion, reveal, revealDuration, visible]);

  // Walk along the arch, centered on the top of the circle (-90°).
  let angle = -Math.PI / 2 - totalAngle / 2;
  const placed = letters.map((letter, index) => {
    const advance = advances[index] ?? 0;
    const middle = angle + advance / 2 / radius;
    angle += advance / radius;
    return {
      letter,
      x: centerX + radius * Math.cos(middle),
      y: centerY + radius * Math.sin(middle),
      rotate: middle + Math.PI / 2,
      width: advance,
    };
  });

  return (
    <View
      pointerEvents="none"
      accessible={visible}
      accessibilityRole="text"
      accessibilityLabel={text}
      style={StyleSheet.absoluteFill}
    >
      {placed.map((glyph, index) => (
        <Letter
          key={`${glyph.letter}-${index}`}
          glyph={glyph}
          index={index}
          count={letters.length}
          reveal={reveal}
          visible={visible}
        />
      ))}
    </View>
  );
}

type LetterProps = {
  glyph: { letter: string; x: number; y: number; rotate: number; width: number };
  index: number;
  count: number;
  reveal: SharedValue<number>;
  visible: boolean;
};

function Letter({ glyph, index, count, reveal, visible }: LetterProps) {
  const style = useAnimatedStyle(() => {
    const total = count * LETTER_STAGGER_MS + LETTER_POP_MS;
    const start = (index * LETTER_STAGGER_MS) / total;
    const end = (index * LETTER_STAGGER_MS + LETTER_POP_MS) / total;
    const t = Math.min(1, Math.max(0, (reveal.value - start) / (end - start)));
    // While showing, overshoot a little on the way in; when hiding, just fade.
    const pop = visible ? 0.4 + 0.6 * t + Math.sin(t * Math.PI) * 0.25 : t;
    return {
      opacity: visible ? t : reveal.value,
      transform: [{ rotate: `${glyph.rotate}rad` }, { scale: pop }],
    };
  });

  return (
    <Animated.Text
      style={[
        styles.letter,
        {
          left: glyph.x - glyph.width / 2,
          top: glyph.y - FONT_SIZE / 2,
          width: glyph.width,
        },
        style,
      ]}
    >
      {glyph.letter}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  letter: {
    position: 'absolute',
    textAlign: 'center',
    fontFamily: fontFamilies.rounded,
    fontSize: FONT_SIZE,
    lineHeight: FONT_SIZE,
    fontWeight: fontWeights.heavy,
    color: colors.journeySheet.button,
    textShadowColor: colors.journeySheet.topHighlight,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
