import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import Svg, { Ellipse } from 'react-native-svg';

import { MascotIcon } from '@/components/ui';
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
import { GardenWeekStrip } from '@/features/journey/components/GardenWeekStrip';
import {
  JOURNEY_GARDEN_MOODS,
  JOURNEY_GARDEN_SPOTS,
  type JourneyGardenMood,
} from '@/features/journey/data/journeyGarden';
import { StageButton } from '@/features/onboarding/stage/StageButton';
import { STAGE_POSE_ART } from '@/features/onboarding/stage/stagePoses';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';

const MAX_MASCOT_HEIGHT = 200;
/** Room above his hat for the speech bubble. */
const BUBBLE_ROOM = 56;
const SPROUT_SIZE = 28;
const SHADOW_WIDTH = 120;
const SHADOW_HEIGHT = 14;

type JourneyGardenProps = {
  day: number;
  eyebrow: string;
  taskTitle: string;
  mood: JourneyGardenMood;
  /** Days checked in this season; each one is a sprout. */
  sproutCount: number;
  weekDays: readonly { day: number; kind: 'completed' | 'current' | 'future' }[];
  /** He steps aside while the day-complete celebration plays. */
  mascotHidden: boolean;
  onOpenDay: (day: number) => void;
};

/**
 * Journey as a clean stage: he stands in the middle, and a sprout comes up
 * around him for every day you check in, so the season fills into a garden.
 */
export function JourneyGarden({
  day,
  eyebrow,
  taskTitle,
  mood,
  sproutCount,
  weekDays,
  mascotHidden,
  onOpenDay,
}: JourneyGardenProps) {
  const [stage, setStage] = useState<{ width: number; height: number } | null>(null);
  const copy = JOURNEY_GARDEN_MOODS[mood];

  return (
    <View style={styles.root}>
      <View style={styles.header} accessibilityRole="header">
        <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
          {eyebrow}
        </Text>
        <Text style={styles.title} maxFontSizeMultiplier={1.25}>
          {`Day ${day}`}
        </Text>
        <Text style={styles.subtitle} maxFontSizeMultiplier={1.3} numberOfLines={2}>
          {capitalizeHeading(taskTitle)}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open day ${day}`}
        accessibilityHint="Shows today's reset"
        onPress={() => onOpenDay(day)}
        style={styles.stage}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setStage({ width, height });
        }}
      >
        {stage ? (
          <GardenStage
            width={stage.width}
            height={stage.height}
            mood={mood}
            line={copy.line}
            sproutCount={sproutCount}
            mascotHidden={mascotHidden}
          />
        ) : null}
      </Pressable>

      <GardenWeekStrip days={weekDays} onPressDay={onOpenDay} />
      <View style={styles.footer}>
        <StageButton label={copy.ctaLabel} onPress={() => onOpenDay(day)} />
      </View>
    </View>
  );
}

type GardenStageProps = {
  width: number;
  height: number;
  mood: JourneyGardenMood;
  line: string;
  sproutCount: number;
  mascotHidden: boolean;
};

function GardenStage({ width, height, mood, line, sproutCount, mascotHidden }: GardenStageProps) {
  const reduceMotion = useReducedMotion();
  const breath = useSharedValue(0);
  const art = STAGE_POSE_ART[JOURNEY_GARDEN_MOODS[mood].pose];
  const reference = STAGE_POSE_ART['idle-listen'];
  const mascotHeight = Math.min(height - BUBBLE_ROOM, MAX_MASCOT_HEIGHT);
  const scale = mascotHeight / reference.height;
  const floor = Math.max(0, (height - mascotHeight - BUBBLE_ROOM) / 2);
  const centerX = width / 2;
  const spots = JOURNEY_GARDEN_SPOTS.slice(0, sproutCount)
    .map((spot, index) => ({ ...spot, index }))
    // Rows further back are drawn first so nearer sprouts overlap them.
    .sort((first, second) => second.y - first.y);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    breath.value = withRepeat(
      withTiming(1, { duration: motion.duration.stageBreath, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [breath, reduceMotion]);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: 1 - breath.value * 0.008 }, { scaleY: 1 + breath.value * 0.02 }],
  }));

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Svg
        width={SHADOW_WIDTH}
        height={SHADOW_HEIGHT}
        style={[
          styles.shadow,
          { left: centerX - SHADOW_WIDTH / 2, bottom: floor - SHADOW_HEIGHT / 2 },
        ]}
      >
        <Ellipse
          cx={SHADOW_WIDTH / 2}
          cy={SHADOW_HEIGHT / 2}
          rx={SHADOW_WIDTH / 2}
          ry={SHADOW_HEIGHT / 2}
          fill={colors.stage.mascotShadow}
        />
      </Svg>
      {spots.map((spot) => {
        const size = SPROUT_SIZE * spot.scale;
        return (
          <Animated.View
            key={spot.index}
            entering={reduceMotion ? undefined : ZoomIn.delay(spot.index * 30).springify()}
            style={[
              styles.sprout,
              { left: centerX + spot.x - size / 2, bottom: floor + spot.y - 2 },
            ]}
          >
            <MascotIcon name="sprout" size={size} />
          </Animated.View>
        );
      })}
      {mascotHidden ? null : (
        <>
          <Animated.View
            style={[styles.body, { bottom: floor, height: mascotHeight * 1.1 }, breathStyle]}
          >
            <Animated.Image
              key={mood}
              entering={reduceMotion ? undefined : FadeIn.duration(motion.duration.stagePoseFade)}
              source={art.source}
              resizeMode="contain"
              style={{
                position: 'absolute',
                bottom: 0,
                width: art.width * scale,
                height: art.height * scale,
                left: centerX - (art.width / 2 + art.bodyOffset) * scale,
              }}
            />
          </Animated.View>
          <Animated.View
            key={line}
            entering={reduceMotion ? undefined : ZoomIn.duration(motion.duration.bubble)}
            style={[styles.bubble, { bottom: floor + mascotHeight + spacing.sm }]}
          >
            <Text style={styles.bubbleText} maxFontSizeMultiplier={1.2}>
              {line}
            </Text>
            <View style={styles.bubbleTail} />
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  eyebrow: {
    ...textVariants.stageEyebrow,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  title: {
    ...textVariants.stageTitle,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...textVariants.stageSubtitle,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  stage: {
    flex: 1,
    minHeight: spacing.xxxl * 3,
  },
  shadow: {
    position: 'absolute',
  },
  sprout: {
    position: 'absolute',
  },
  body: {
    position: 'absolute',
    left: 0,
    right: 0,
    transformOrigin: 'bottom',
  },
  bubble: {
    position: 'absolute',
    alignSelf: 'center',
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
  footer: {
    paddingTop: spacing.sm,
  },
});
