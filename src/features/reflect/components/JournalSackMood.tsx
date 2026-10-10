import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  ZoomIn,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Ellipse } from 'react-native-svg';

import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  motion,
  radius,
  spacing,
  textVariants,
} from '@/design-system';
import { StageSlider } from '@/features/onboarding/stage/StageSlider';
import {
  WELCOME_SACK_FRAMES,
  WELCOME_SACK_REFERENCE_HEIGHT,
} from '@/features/onboarding/stage/welcomeSackFrames';
import { getJournalSackMood, JOURNAL_SACK_MOODS } from '@/features/reflect/data/journalSackMood';
import type { JournalMood } from '@/features/reset/types';

const MASCOT_HEIGHT = 128;
const STAGE_HEIGHT = MASCOT_HEIGHT + spacing.md;
const SHADOW = { width: 104, height: 12 } as const;
const SCALE = MASCOT_HEIGHT / WELCOME_SACK_REFERENCE_HEIGHT;
/** Before you answer he waits in the middle, half-way to setting it down. */
const UNSET_FRAME = 2;
const SLIDER_OPTIONS = JOURNAL_SACK_MOODS.map((step) => ({
  id: String(step.mood),
  label: step.label,
}));

type JournalSackMoodProps = {
  mood: JournalMood | undefined;
  onChange: (mood: JournalMood) => void;
};

/**
 * "How heavy was today?" Sliding toward light walks him through the welcome
 * screen's set-down, from hauling the sack to resting beside it.
 */
export function JournalSackMood({ mood, onChange }: JournalSackMoodProps) {
  const reduceMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const frame = mood ? getJournalSackMood(mood).frame : UNSET_FRAME;
  const shown = useSharedValue(frame);
  const line = mood ? getJournalSackMood(mood).line : 'Slide to show me.';

  useEffect(() => {
    shown.value = reduceMotion
      ? frame
      : withTiming(frame, { duration: motion.duration.welcomeFrameFade });
  }, [frame, reduceMotion, shown]);

  return (
    <View style={styles.root}>
      <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
        How heavy was today?
      </Text>
      <Animated.View
        key={line}
        entering={reduceMotion ? undefined : ZoomIn.duration(motion.duration.bubble)}
        style={styles.bubble}
        accessibilityElementsHidden
      >
        <Text style={styles.bubbleText} maxFontSizeMultiplier={1.2}>
          {line}
        </Text>
        <View style={styles.bubbleTail} />
      </Animated.View>
      <View
        style={styles.stage}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      >
        <Svg
          width={SHADOW.width}
          height={SHADOW.height}
          style={[styles.shadow, { left: width / 2 - SHADOW.width / 2 }]}
        >
          <Ellipse
            cx={SHADOW.width / 2}
            cy={SHADOW.height / 2}
            rx={SHADOW.width / 2}
            ry={SHADOW.height / 2}
            fill={colors.stage.mascotShadow}
          />
        </Svg>
        {/* Earlier frames sit on top, so the outgoing frame fades off the incoming one. */}
        {width > 0
          ? WELCOME_SACK_FRAMES.map((art, index) => ({ art, index }))
              .reverse()
              .map(({ art, index }) => (
                <SackFrame
                  key={index}
                  index={index}
                  shown={shown}
                  source={art.source}
                  width={art.width * SCALE}
                  height={art.height * SCALE}
                  left={width / 2 - (art.width / 2 + art.bodyOffset) * SCALE}
                />
              ))
          : null}
      </View>
      <StageSlider
        options={SLIDER_OPTIONS}
        selectedIndex={mood ? mood - 1 : -1}
        unsetLabel="Slide to answer"
        accessibilityLabel="How heavy was today? From really heavy to light"
        onChange={(index) => {
          const step = JOURNAL_SACK_MOODS[index];
          if (step) {
            onChange(step.mood);
          }
        }}
      />
    </View>
  );
}

type SackFrameProps = {
  index: number;
  shown: SharedValue<number>;
  source: (typeof WELCOME_SACK_FRAMES)[number]['source'];
  width: number;
  height: number;
  left: number;
};

/** Appears the moment the move towards it starts, then fades as the move past it plays. */
function SackFrame({ index, shown, source, width, height, left }: SackFrameProps) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(
      shown.value,
      [index - 1, index - 0.98, index, index + 1],
      [0, 1, 1, 0],
      'clamp',
    ),
  }));
  return (
    <Animated.Image
      source={source}
      resizeMode="contain"
      style={[styles.frame, { width, height, left }, style]}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.xs,
  },
  eyebrow: {
    ...textVariants.stageEyebrow,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  bubble: {
    alignSelf: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.stage.bubbleBorder,
    backgroundColor: colors.stage.bubble,
  },
  bubbleText: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -7,
    width: 14,
    height: 14,
    backgroundColor: colors.stage.bubble,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.stage.bubbleBorder,
    transform: [{ rotate: '45deg' }],
  },
  stage: {
    height: STAGE_HEIGHT,
  },
  shadow: {
    position: 'absolute',
    bottom: spacing.xxs,
  },
  frame: {
    position: 'absolute',
    bottom: spacing.xs,
  },
});
