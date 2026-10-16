import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getTabBarScenePadding } from '@/components/ui';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  radius,
  shadows,
  spacing,
  textVariants,
} from '@/design-system';
import { JourneyConfetti } from '@/features/journey/components/JourneyConfetti';
import { JOURNEY_DAY_STEPS } from '@/features/journey/data/journeyCopy';
import { JOURNEY_GARDEN_SHEET_POSE } from '@/features/journey/data/journeyGarden';
import { useJourneyVisualStore } from '@/features/journey/store/useJourneyVisualStore';
import type { JourneySheetModel } from '@/features/journey/utils/getJourneySheetModel';
import { shortenSheetDescription } from '@/features/journey/utils/shortenSheetDescription';
import { StageButton } from '@/features/onboarding/stage/StageButton';
import { STAGE_POSE_ART } from '@/features/onboarding/stage/stagePoses';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';
import { hapticConfetti } from '@/utils/haptics';

const SHEET_OPEN_MS = 280;
const SHEET_SPRING = { damping: 22, stiffness: 190, mass: 0.9 } as const;
const DISMISS_DISTANCE = 120;
/** He peeks over the top edge: this tall, with most of him above the sheet. */
const PEEK_HEIGHT = 104;
const PEEK_ABOVE = 0.74;
const PEEK_HOP = 10;
const TICK_SIZE = 18;

type JourneyGardenSheetProps = {
  visible: boolean;
  model: JourneySheetModel | null;
  onClose: () => void;
  onPrimary: () => void;
  /** A step was ticked; `checkedCount` of the day's steps are now done. */
  onStepChecked: (checkedCount: number) => void;
};

/** The day pop-up on the garden stage: him peeking in, the steps as chips, one button. */
export function JourneyGardenSheet({
  visible,
  model,
  onClose,
  onPrimary,
  onStepChecked,
}: JourneyGardenSheetProps) {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const openOffset = useSharedValue(1000);
  const dragOffset = useSharedValue(0);
  const hop = useSharedValue(0);
  const scrim = useSharedValue(0);
  // Keep the last model while the sheet slides away.
  const [shownModel, setShownModel] = useState(model);

  if (model && model !== shownModel) {
    setShownModel(model);
  }

  useEffect(() => {
    const duration = reduceMotion ? 0 : SHEET_OPEN_MS;
    if (visible) {
      scrim.value = withTiming(1, { duration });
      openOffset.value = reduceMotion ? 0 : withSpring(0, SHEET_SPRING);
      return;
    }
    scrim.value = withTiming(0, { duration });
    openOffset.value = withTiming(1000, { duration, easing: Easing.in(Easing.cubic) });
  }, [openOffset, reduceMotion, scrim, visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: openOffset.value + dragOffset.value }],
  }));
  const peekStyle = useAnimatedStyle(() => ({ transform: [{ translateY: hop.value }] }));
  const scrimStyle = useAnimatedStyle(() => ({ opacity: scrim.value }));

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      dragOffset.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_DISTANCE || event.velocityY > 900) {
        dragOffset.value = 0;
        runOnJS(onClose)();
        return;
      }
      dragOffset.value = withTiming(0, { duration: reduceMotion ? 0 : 200 });
    });

  const hopMascot = () => {
    if (reduceMotion) {
      return;
    }
    hop.set(
      withSequence(
        withTiming(-PEEK_HOP, { duration: 120, easing: Easing.out(Easing.quad) }),
        withSpring(0, { damping: 8, stiffness: 260 }),
      ),
    );
  };

  if (!shownModel) {
    return null;
  }

  const peekArt = STAGE_POSE_ART[JOURNEY_GARDEN_SHEET_POSE];
  const peekWidth = (peekArt.width / peekArt.height) * PEEK_HEIGHT;

  return (
    <View style={styles.root} pointerEvents={visible ? 'box-none' : 'none'}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close day details"
        onPress={onClose}
        style={StyleSheet.absoluteFill}
      >
        <Animated.View style={[styles.scrim, scrimStyle]} />
      </Pressable>
      <GestureDetector gesture={pan}>
        <Animated.View style={sheetStyle} accessibilityViewIsModal>
          <Animated.View
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[styles.peek, { height: PEEK_HEIGHT * PEEK_ABOVE }, peekStyle]}
          >
            <Image
              source={peekArt.source}
              resizeMode="contain"
              style={{
                width: peekWidth,
                height: PEEK_HEIGHT,
                // A centred item moves half its margin, so double it to centre his body.
                marginLeft: -peekArt.bodyOffset * (PEEK_HEIGHT / peekArt.height) * 2,
              }}
            />
          </Animated.View>
          <View
            style={[
              styles.sheet,
              { paddingBottom: getTabBarScenePadding(insets.bottom) + spacing.sm },
            ]}
          >
            <View style={styles.handle} accessibilityElementsHidden />
            <SheetContent
              model={shownModel}
              onPrimary={onPrimary}
              onStepTicked={(checkedCount) => {
                hopMascot();
                onStepChecked(checkedCount);
              }}
            />
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

type SheetContentProps = {
  model: JourneySheetModel;
  onPrimary: () => void;
  onStepTicked: (checkedCount: number) => void;
};

type Burst = { key: number; x: number; y: number };

function SheetContent({ model, onPrimary, onStepTicked }: SheetContentProps) {
  const [burst, setBurst] = useState<Burst>({ key: 0, x: 0, y: 0 });
  const stepChecks = useJourneyVisualStore((state) => state.stepChecks);
  const checkStep = useJourneyVisualStore((state) => state.checkStep);
  const checked = stepChecks?.day === model.day ? stepChecks.checked : [];
  const [chipsTop, setChipsTop] = useState(0);
  const [chipCenters, setChipCenters] = useState<Record<number, { x: number; y: number }>>({});

  return (
    <View style={styles.content}>
      <View style={styles.meta}>
        <Text style={styles.metaPill} maxFontSizeMultiplier={1.3}>
          {`Day ${model.day}`}
        </Text>
        <Text style={styles.metaPill} maxFontSizeMultiplier={1.3}>
          {model.minutesLabel}
        </Text>
        {model.completeLabel ? (
          <Text style={[styles.metaPill, styles.metaDone]} maxFontSizeMultiplier={1.3}>
            {model.completeLabel}
          </Text>
        ) : null}
      </View>

      <View style={styles.titleBlock} accessibilityRole="header">
        <Text style={styles.title} maxFontSizeMultiplier={1.25}>
          {capitalizeHeading(model.title)}
        </Text>
        <Text style={styles.description} maxFontSizeMultiplier={1.3}>
          {shortenSheetDescription(model.description)}
        </Text>
      </View>

      {model.kind === 'current' ? (
        <View
          style={styles.chips}
          accessibilityLabel={`Today's steps, ${checked.length} of ${JOURNEY_DAY_STEPS.length} done`}
          onLayout={(event) => setChipsTop(event.nativeEvent.layout.y)}
        >
          {JOURNEY_DAY_STEPS.map((step, index) => {
            const isChecked = checked.includes(index);
            const label = model.steps[index] ?? step.title;
            return (
              <Pressable
                key={step.title}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isChecked, disabled: isChecked }}
                accessibilityLabel={label}
                accessibilityHint={step.hint}
                disabled={isChecked}
                onLayout={(event) => {
                  const { x, y, height } = event.nativeEvent.layout;
                  setChipCenters((previous) => ({
                    ...previous,
                    // Confetti bursts from the tick at the chip's left end.
                    [index]: { x: x + TICK_SIZE, y: y + height / 2 },
                  }));
                }}
                onPress={() => {
                  // Ticks are permanent; a ticked chip ignores presses.
                  const checkedCount = checkStep(model.day, index);
                  if (checkedCount === null) {
                    return;
                  }
                  // A pop and a sprinkle of taps to go with the confetti.
                  hapticConfetti();
                  const center = chipCenters[index] ?? { x: 0, y: 0 };
                  setBurst((previous) => ({
                    key: previous.key + 1,
                    x: center.x,
                    y: chipsTop + center.y,
                  }));
                  onStepTicked(checkedCount);
                }}
                style={({ pressed }) => [
                  styles.chip,
                  isChecked ? styles.chipChecked : null,
                  pressed && !isChecked ? styles.chipPressed : null,
                ]}
              >
                <View style={[styles.tick, isChecked ? styles.tickChecked : null]}>
                  {isChecked ? <View style={styles.tickMark} /> : null}
                </View>
                <Text style={styles.chipLabel} maxFontSizeMultiplier={1.3}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {model.rememberLine ? (
        <Text style={styles.remember} maxFontSizeMultiplier={1.3}>
          {`“${capitalizeHeading(model.rememberLine)}”`}
        </Text>
      ) : null}

      {model.footnote ? (
        <Text style={styles.description} maxFontSizeMultiplier={1.3}>
          {model.footnote}
        </Text>
      ) : null}

      {model.cta !== 'none' && model.ctaLabel ? (
        <StageButton label={model.ctaLabel} onPress={onPrimary} />
      ) : null}

      <JourneyConfetti burstKey={burst.key} originX={burst.x} originY={burst.y} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    zIndex: 10,
    // The closed sheet waits below the screen; clip it so the page can't scroll to it (web).
    overflow: 'hidden',
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay.sheetScrim,
  },
  peek: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'visible',
    zIndex: 0,
  },
  sheet: {
    zIndex: 1,
    backgroundColor: colors.stage.floor,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.lg - spacing.xxs,
    paddingTop: spacing.xs,
    ...shadows.medium,
  },
  handle: {
    alignSelf: 'center',
    width: spacing.xl + spacing.xs,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.stage.track,
    marginBottom: spacing.sm,
  },
  content: {
    gap: spacing.sm,
    alignItems: 'stretch',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.xxs + 2,
  },
  metaPill: {
    ...textVariants.stageEyebrow,
    letterSpacing: 0.4,
    textTransform: 'none',
    color: colors.stage.copySoft,
    backgroundColor: colors.stage.track,
    borderRadius: radius.pill,
    overflow: 'hidden',
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: spacing.xxs,
  },
  metaDone: {
    color: colors.text.inverse,
    backgroundColor: colors.stage.sprout,
  },
  titleBlock: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  title: {
    ...textVariants.stageTitle,
    color: colors.text.primary,
    textAlign: 'center',
  },
  description: {
    ...textVariants.stageSubtitle,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  chip: {
    minHeight: spacing.hitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.stage.chipBorder,
    backgroundColor: colors.stage.chip,
    shadowColor: colors.stage.chipShadow,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  chipChecked: {
    backgroundColor: colors.stage.chipSelected,
    borderColor: colors.stage.chipBorderSelected,
  },
  chipPressed: {
    transform: [{ scale: 0.96 }],
  },
  chipLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.stageChip,
    lineHeight: lineHeights.stageChip,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
  },
  tick: {
    width: TICK_SIZE,
    height: TICK_SIZE,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.stage.ctaDisabled,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickChecked: {
    backgroundColor: colors.text.primary,
    borderColor: colors.text.primary,
  },
  tickMark: {
    width: 8,
    height: 4,
    marginTop: -2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.text.inverse,
    transform: [{ rotate: '-45deg' }],
  },
  remember: {
    ...textVariants.stageSubtitle,
    color: colors.text.primary,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
});
