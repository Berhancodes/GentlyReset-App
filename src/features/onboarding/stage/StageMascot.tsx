import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import Svg, { Ellipse, Path } from 'react-native-svg';

import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  motion,
  radius,
  spacing,
} from '@/design-system';
import { ONBOARDING_STEPS } from '@/features/onboarding/data/onboardingSteps';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';

import { STAGE_POSE_ART, STAGE_POSE_SCALE } from './stagePoses';
import { useStageStore, type StageFlight, type StageFrame } from './stageStore';

/** Room the mascot and his speech bubble need at full size. */
const STAGE_HEIGHT = 300;
const SHADOW_WIDTH = 130;
const SHADOW_HEIGHT = 16;
const MIN_SCALE = 0.5;
const BUBBLE_BOTTOM = 214;
/** From his feet to the top of his speech bubble; what gets centred in the free space. */
const VISIBLE_HEIGHT = 256;
/** Where a caught answer lands, measured up from his feet. */
const CATCH_HEIGHT = 92;
const STONE_SPOTS = [-140, -122, -150, -130, -112, -146] as const;
const SPROUT_SPOTS = [92, 118, 76, 136, 104, 84] as const;

const SACK_STEP_INDEX = ONBOARDING_STEPS.findIndex(
  (step) => step.type === 'multiChoice' && step.layout === 'sack',
);
const PLANT_STEP_INDEX = ONBOARDING_STEPS.findIndex(
  (step) => step.type === 'multiChoice' && step.layout === 'plant',
);

function selectionCount(
  answer: ReturnType<typeof useOnboardingStore.getState>['answers'][string] | undefined,
) {
  return answer?.type === 'multiChoice' ? answer.optionIds.length : 0;
}

/**
 * The one mascot shared by every stage screen. He stays on screen while the
 * questions slide past, moves into each screen's MascotSlot, changes pose,
 * speaks, and catches the answers people choose.
 */
export function StageMascot() {
  const reduceMotion = useReducedMotion();
  const pose = useStageStore((state) => state.pose);
  const line = useStageStore((state) => state.line);
  const lineId = useStageStore((state) => state.lineId);
  const catchId = useStageStore((state) => state.catchId);
  const slot = useStageStore((state) => state.slot);
  const flights = useStageStore((state) => state.flights);
  const currentStepIndex = useOnboardingStore((state) => state.currentStepIndex);
  const stoneCount = useOnboardingStore((state) =>
    SACK_STEP_INDEX >= 0
      ? selectionCount(state.answers[ONBOARDING_STEPS[SACK_STEP_INDEX]?.id ?? ''])
      : 0,
  );
  const sproutCount = useOnboardingStore((state) =>
    PLANT_STEP_INDEX >= 0
      ? selectionCount(state.answers[ONBOARDING_STEPS[PLANT_STEP_INDEX]?.id ?? ''])
      : 0,
  );
  const rootRef = useRef<View>(null);
  const [origin, setOrigin] = useState<StageFrame | null>(null);

  const placement = getPlacement(slot, origin);
  const bottom = useSharedValue(placement.bottom);
  const scale = useSharedValue(placement.scale);
  const breath = useSharedValue(0);
  const squash = useSharedValue(0);

  const placed = useRef(false);
  useEffect(() => {
    // The first real measurement snaps him into place; later screens glide.
    const glide = placed.current && !reduceMotion;
    if (placement.measured) {
      placed.current = true;
    }
    const timing = { duration: glide ? 450 : 0, easing: Easing.bezier(0.3, 0.8, 0.3, 1) };
    bottom.value = withTiming(placement.bottom, timing);
    scale.value = withTiming(placement.scale, timing);
  }, [bottom, placement.bottom, placement.measured, placement.scale, reduceMotion, scale]);

  useEffect(() => {
    breath.value = reduceMotion
      ? 0
      : withRepeat(
          withTiming(1, {
            duration: motion.duration.stageBreath,
            easing: Easing.inOut(Easing.sin),
          }),
          -1,
          true,
        );
  }, [breath, reduceMotion]);

  useEffect(() => {
    if (catchId === 0 || reduceMotion) {
      return;
    }
    const step = motion.duration.stageCatch / 3;
    squash.value = withSequence(
      withTiming(1, { duration: step }),
      withTiming(-0.4, { duration: step }),
      withTiming(0, { duration: step }),
    );
  }, [catchId, reduceMotion, squash]);

  const stageStyle = useAnimatedStyle(() => ({
    bottom: bottom.value,
    transform: [{ scale: scale.value }],
  }));
  const bodyStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleX: 1 - breath.value * 0.008 + squash.value * 0.07 },
      { scaleY: 1 + breath.value * 0.022 - squash.value * 0.08 },
    ],
  }));

  const art = STAGE_POSE_ART[pose];
  const width = art.width * STAGE_POSE_SCALE;
  const height = art.height * STAGE_POSE_SCALE;
  const showStonePile = SACK_STEP_INDEX >= 0 && currentStepIndex > SACK_STEP_INDEX;
  const showSprouts = PLANT_STEP_INDEX >= 0 && currentStepIndex >= PLANT_STEP_INDEX;
  const droppingStones = currentStepIndex === SACK_STEP_INDEX;

  return (
    <View
      ref={rootRef}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}
      onLayout={(event) => {
        const { height: stageHeight } = event.nativeEvent.layout;
        rootRef.current?.measureInWindow((x, y, frameWidth) => {
          setOrigin({ x, y, width: frameWidth, height: stageHeight });
        });
      }}
    >
      <Animated.View style={[styles.stage, stageStyle, placement.measured ? null : styles.hidden]}>
        {/* A true ellipse, like the mockup; a pill radius leaves flat sides. */}
        <Svg style={styles.shadow} width={SHADOW_WIDTH} height={SHADOW_HEIGHT}>
          <Ellipse
            cx={SHADOW_WIDTH / 2}
            cy={SHADOW_HEIGHT / 2}
            rx={SHADOW_WIDTH / 2}
            ry={SHADOW_HEIGHT / 2}
            fill={colors.stage.mascotShadow}
          />
        </Svg>
        <View style={styles.props}>
          {showStonePile ? <StonePile count={stoneCount} /> : null}
          {showSprouts ? <Sprouts count={sproutCount} /> : null}
        </View>
        <Animated.View style={[styles.body, bodyStyle]}>
          <Animated.View
            key={pose}
            entering={FadeIn.duration(motion.duration.stagePoseFade)}
            exiting={FadeOut.duration(motion.duration.stagePoseFade)}
            style={styles.pose}
          >
            <Image
              source={art.source}
              resizeMode="contain"
              style={{
                width,
                height,
                transform: [{ translateX: -art.bodyOffset * STAGE_POSE_SCALE }],
              }}
            />
          </Animated.View>
        </Animated.View>
        {droppingStones && stoneCount > 0 ? (
          <StoneDrop key={`stone-${stoneCount}`} index={stoneCount - 1} />
        ) : null}
        {line ? (
          <Animated.View
            key={`line-${lineId}`}
            entering={ZoomIn.duration(motion.duration.bubble)}
            style={styles.bubble}
          >
            <Text style={styles.bubbleText} maxFontSizeMultiplier={1.2}>
              {line}
            </Text>
            <View style={styles.bubbleTail} />
          </Animated.View>
        ) : null}
      </Animated.View>
      {origin
        ? flights.map((flight) => (
            <FlightPill
              key={flight.id}
              flight={flight}
              origin={origin}
              target={{
                x: origin.width / 2,
                y: origin.height - placement.bottom - CATCH_HEIGHT * placement.scale,
              }}
            />
          ))
        : null}
    </View>
  );
}

function getPlacement(slot: StageFrame | null, origin: StageFrame | null) {
  if (!slot || !origin) {
    return { bottom: spacing.xxxl * 3, scale: 1, measured: false };
  }
  const scale = Math.max(MIN_SCALE, Math.min(1, slot.height / STAGE_HEIGHT));
  // Centre him and his speech bubble in the free space, rather than standing on the answers.
  const spare = Math.max(0, slot.height - VISIBLE_HEIGHT * scale);
  const bottom = origin.height - (slot.y + slot.height) + spare / 2;
  return { bottom, scale, measured: true };
}

function StonePile({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => {
        const size = 26 - (index % 3) * 3;
        const spot = STONE_SPOTS[index % STONE_SPOTS.length] ?? 0;
        return (
          <Animated.View
            key={index}
            entering={ZoomIn.delay(index * 90).duration(motion.duration.selection * 3)}
            style={[styles.prop, { left: spot - size / 2 }]}
          >
            <Stone
              size={size}
              color={colors.stage.stones[index % colors.stage.stones.length] ?? colors.accent.peach}
            />
          </Animated.View>
        );
      })}
    </>
  );
}

function Stone({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size * 0.7} viewBox="0 0 30 21">
      <Ellipse cx={15} cy={12} rx={14} ry={8.5} fill={color} />
      <Ellipse cx={11} cy={9} rx={5} ry={2.5} fill={colors.stage.stoneShine} />
    </Svg>
  );
}

function Sprouts({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => {
        const size = 30 - (index % 2) * 6;
        const spot = SPROUT_SPOTS[index % SPROUT_SPOTS.length] ?? 0;
        return (
          <Animated.View
            key={index}
            entering={ZoomIn.duration(motion.duration.selection * 3)}
            style={[styles.prop, { left: spot - size / 2 }]}
          >
            <Svg width={size} height={size} viewBox="0 0 24 24">
              <Path
                d="M12 22V12"
                stroke={colors.stage.sproutStem}
                strokeWidth={2}
                strokeLinecap="round"
              />
              <Path
                d="M12 13C12 8 9 5.5 3.8 5.5 3.6 10.5 6.5 13 12 13Z"
                fill={colors.stage.sprout}
              />
              <Path
                d="M12 11.5C12 7 14.8 4 20.2 4 20.4 9 17.5 11.5 12 11.5Z"
                fill={colors.stage.sproutLight}
              />
            </Svg>
          </Animated.View>
        );
      })}
    </>
  );
}

/** A stone falling into the sack he is carrying. */
function StoneDrop({ index }: { index: number }) {
  const reduceMotion = useReducedMotion();
  const fall = useSharedValue(0);

  useEffect(() => {
    fall.value = reduceMotion
      ? 1
      : withTiming(1, { duration: 700, easing: Easing.in(Easing.quad) });
  }, [fall, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: fall.value < 0.25 ? fall.value * 4 : 1 - (fall.value - 0.25) / 0.75,
    transform: [{ translateY: -30 + fall.value * 125 }, { scale: 0.6 + fall.value * 0.4 }],
  }));

  return (
    <Animated.View style={[styles.stoneDrop, style]}>
      <Stone
        size={22}
        color={colors.stage.stones[index % colors.stage.stones.length] ?? colors.accent.peach}
      />
    </Animated.View>
  );
}

/** A chosen answer arcing from where it was tapped into the mascot's hands. */
function FlightPill({
  flight,
  origin,
  target,
}: {
  flight: StageFlight;
  origin: StageFrame;
  target: { x: number; y: number };
}) {
  const reduceMotion = useReducedMotion();
  const land = useStageStore((state) => state.land);
  const progress = useSharedValue(0);
  const left = flight.from.x - origin.x;
  const top = flight.from.y - origin.y;
  const dx = target.x - (left + flight.from.width / 2);
  const dy = target.y - (top + flight.from.height / 2);

  useEffect(() => {
    const done = () => land(flight.id);
    progress.value = withDelay(
      reduceMotion ? 0 : flight.delayMs,
      withTiming(
        1,
        {
          duration: reduceMotion ? 0 : motion.duration.stageFlight,
          easing: Easing.bezier(0.45, 0, 0.3, 1),
        },
        (finished) => {
          if (finished) {
            runOnJS(done)();
          }
        },
      ),
    );
  }, [flight.delayMs, flight.id, land, progress, reduceMotion]);

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: p < 0.6 ? 1 : 1 - (p - 0.6) / 0.4,
      transform: [
        { translateX: dx * p },
        { translateY: dy * p - Math.sin(p * Math.PI) * motion.offset.stageFlightArc },
        { scale: 1 - p * 0.75 },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.flight,
        { left, top, width: flight.from.width, height: flight.from.height },
        style,
      ]}
    >
      <Text style={styles.flightText} numberOfLines={1}>
        {flight.label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stage: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: STAGE_HEIGHT,
    transformOrigin: 'bottom',
  },
  hidden: {
    opacity: 0,
  },
  shadow: {
    position: 'absolute',
    left: '50%',
    bottom: -6,
    width: SHADOW_WIDTH,
    height: SHADOW_HEIGHT,
    marginLeft: -SHADOW_WIDTH / 2,
  },
  props: {
    position: 'absolute',
    left: '50%',
    bottom: 0,
    width: 0,
    height: 0,
  },
  prop: {
    position: 'absolute',
    bottom: 0,
  },
  body: {
    ...StyleSheet.absoluteFill,
    transformOrigin: 'bottom',
  },
  pose: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  stoneDrop: {
    position: 'absolute',
    left: '50%',
    marginLeft: -78,
    bottom: 230,
  },
  bubble: {
    position: 'absolute',
    bottom: BUBBLE_BOTTOM,
    alignSelf: 'center',
    maxWidth: 300,
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
  flight: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.stage.chipBorderSelected,
    backgroundColor: colors.stage.chipSelected,
  },
  flightText: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
});
