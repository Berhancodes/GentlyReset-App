import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { VideoView } from 'expo-video';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, getTabBarScenePadding, MascotIcon } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { JourneyConfetti } from '@/features/journey/components/JourneyConfetti';
import {
  PopCheckBox,
  PressableScale,
  Reveal,
  StepsProgressBar,
  TactileButton,
} from '@/features/journey/components/JourneySheetMotion';
import { JOURNEY_SPRITES } from '@/features/journey/data/journeyChapterImages';
import { JOURNEY_DAY_STEPS } from '@/features/journey/data/journeyCopy';
import { JOURNEY_SEASON_SCENES } from '@/features/journey/data/journeySeasonScenes';
import { useJourneyMascotPlayer } from '@/features/journey/hooks/useJourneyMascotPlayer';
import { JOURNEY_SEASON_MASCOT_ART } from '@/features/journey/layout/journeyStageLayout';
import { useJourneyVisualStore } from '@/features/journey/store/useJourneyVisualStore';
import type { JourneySeason } from '@/features/journey/utils/getJourneySeason';
import type { JourneySheetModel } from '@/features/journey/utils/getJourneySheetModel';
import { shortenSheetDescription } from '@/features/journey/utils/shortenSheetDescription';
import { hapticConfetti } from '@/utils/haptics';

const SHEET_OPEN_MS = 280;
/** Opens with a soft settle rather than a hard stop. */
const SHEET_SPRING = { damping: 22, stiffness: 190, mass: 0.9 } as const;
/** How high the peeking mascot hops when a step is ticked. */
const PEEK_HOP = 10;
const PEEK_DELAY_MS = 160;
const DISMISS_DISTANCE = 120;
const STEP_BOX_SIZE = 32;
/** Decorations cut from the fall mockup, in points (mockup px x 390 / 700). */
const SHEET_ART = {
  titleLeaves: { width: 87, height: 89, top: -spacing.xs, right: -12 },
  rememberPlant: { width: 85, height: 62 },
  buttonLeaves: { width: 47, height: 36, right: spacing.md },
} as const;
/** Decorative falling pieces beside the title, as offsets from the top-right of the title block. */
const TITLE_DECOR = [
  { right: spacing.xl, top: spacing.xs, size: 30, rotate: -20 },
  { right: 0, top: spacing.xl + spacing.xs, size: 38, rotate: 25 },
  { right: spacing.lg, top: spacing.xxxl + spacing.xs, size: 16, rotate: 60 },
] as const;

/** Peeking mascot, as fractions of the sheet width. */
const PEEK = {
  /** Hat brim width. */
  brimWidth: 0.3,
  /** Mascot center from the left edge. */
  centerX: 0.66,
  /** Fraction of the character (hat top to feet) shown above the sheet edge: hat, face and fists. */
  visibleHeight: 0.62,
} as const;

type JourneyDaySheetProps = {
  visible: boolean;
  /** Picks the decorative leaves, petals or snow beside the title. */
  season: JourneySeason;
  model: JourneySheetModel | null;
  onClose: () => void;
  onPrimary: () => void;
  /** A step was ticked; `checkedCount` of the day's steps are now done. */
  onStepChecked: (checkedCount: number) => void;
};

export function JourneyDaySheet({
  visible,
  season,
  model,
  onClose,
  onPrimary,
  onStepChecked,
}: JourneyDaySheetProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const openOffset = useSharedValue(height);
  const dragOffset = useSharedValue(0);
  const peekOffset = useSharedValue(1);
  const peekHop = useSharedValue(0);
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
      peekOffset.value = 1;
      peekOffset.value = reduceMotion
        ? 0
        : withDelay(PEEK_DELAY_MS, withSpring(0, { damping: 11, stiffness: 140 }));
      return;
    }
    scrim.value = withTiming(0, { duration });
    openOffset.value = withTiming(height, { duration, easing: Easing.in(Easing.cubic) });
    peekOffset.value = withTiming(1, { duration: duration / 2 });
  }, [height, openOffset, peekOffset, reduceMotion, scrim, visible]);

  const hopMascot = () => {
    if (reduceMotion) {
      return;
    }
    peekHop.value = withSequence(
      withTiming(-PEEK_HOP, { duration: 120, easing: Easing.out(Easing.quad) }),
      withSpring(0, { damping: 8, stiffness: 260 }),
    );
  };

  const brimWidth = width * PEEK.brimWidth;
  const peekArtWidth = brimWidth / JOURNEY_SEASON_MASCOT_ART.brimWidth;
  const peekArtHeight =
    peekArtWidth * (JOURNEY_SEASON_MASCOT_ART.height / JOURNEY_SEASON_MASCOT_ART.width);
  const hatTop = peekArtHeight * JOURNEY_SEASON_MASCOT_ART.contentTop;
  const characterHeight =
    peekArtHeight * (JOURNEY_SEASON_MASCOT_ART.feetY - JOURNEY_SEASON_MASCOT_ART.contentTop);
  const peekBand = characterHeight * PEEK.visibleHeight;
  const mascotPlayer = useJourneyMascotPlayer(visible);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: openOffset.value + dragOffset.value }],
  }));
  const peekStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: peekOffset.value * peekBand + peekHop.value }],
  }));
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
      dragOffset.value = withTiming(0, {
        duration: reduceMotion ? 0 : 200,
        easing: Easing.out(Easing.cubic),
      });
    });

  if (!shownModel) {
    return null;
  }

  return (
    <View style={styles.root} pointerEvents={visible ? 'box-none' : 'none'}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss day details"
        onPress={onClose}
        style={StyleSheet.absoluteFill}
      >
        <Animated.View style={[styles.scrim, scrimStyle]} />
      </Pressable>
      <GestureDetector gesture={pan}>
        <Animated.View style={sheetStyle} accessibilityViewIsModal>
          <View
            style={[styles.peekBand, { height: peekBand }]}
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <Animated.View style={[styles.peekClip, { height: peekBand }]}>
              <Animated.View style={peekStyle}>
                <View
                  style={{
                    marginLeft:
                      width * PEEK.centerX - peekArtWidth * JOURNEY_SEASON_MASCOT_ART.bodyCenterX,
                    // Skip the empty space above the hat so the hat sits at the top of the band.
                    marginTop: -hatTop,
                    width: peekArtWidth,
                    height: peekArtHeight,
                  }}
                >
                  <VideoView
                    player={mascotPlayer}
                    nativeControls={false}
                    allowsVideoFrameAnalysis={false}
                    contentFit="contain"
                    pointerEvents="none"
                    style={{ width: peekArtWidth, height: peekArtHeight }}
                  />
                </View>
              </Animated.View>
            </Animated.View>
          </View>
          <View
            style={[
              styles.sheet,
              { paddingBottom: getTabBarScenePadding(insets.bottom) + spacing.sm },
            ]}
          >
            <View style={styles.handleWrap} accessibilityElementsHidden>
              <View style={styles.handle} />
            </View>
            <SheetContent
              model={shownModel}
              season={season}
              visible={visible}
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
  season: JourneySeason;
  /** Sheet is open; sections glide in one after another. */
  visible: boolean;
  onPrimary: () => void;
  onStepTicked: (checkedCount: number) => void;
};

type Burst = { key: number; x: number; y: number };

function SheetContent({ model, season, visible, onPrimary, onStepTicked }: SheetContentProps) {
  const [burst, setBurst] = useState<Burst>({ key: 0, x: 0, y: 0 });
  const stepChecks = useJourneyVisualStore((state) => state.stepChecks);
  const allStepsDone =
    model.kind === 'current' &&
    stepChecks?.day === model.day &&
    stepChecks.checked.length === JOURNEY_DAY_STEPS.length;

  return (
    <View style={styles.content}>
      <Reveal visible={visible} order={0}>
        <View style={styles.titleBlock}>
          <SeasonDecor season={season} />
          <View style={styles.titleText}>
            <AppText variant="journeySheetTitle">{model.title}</AppText>
          </View>
          <View style={styles.titleText}>
            <AppText variant="body" color="secondary">
              {shortenSheetDescription(model.description)}
            </AppText>
          </View>
        </View>
      </Reveal>

      {model.kind === 'current' ? (
        <Reveal visible={visible} order={1}>
          <DaySteps
            day={model.day}
            onTicked={(x, y, checkedCount) => {
              setBurst((previous) => ({ key: previous.key + 1, x, y }));
              onStepTicked(checkedCount);
            }}
          />
        </Reveal>
      ) : null}

      {model.rememberLine ? (
        <Reveal visible={visible} order={2}>
          <View style={styles.remember}>
            {season === 'autumn' ? (
              <Image
                source={JOURNEY_SPRITES.sheetRememberPlantAutumn}
                accessibilityElementsHidden
                importantForAccessibility="no"
                style={[styles.rememberPlant, SHEET_ART.rememberPlant]}
              />
            ) : null}
            <MascotIcon name="leaf" size={22} />
            <View
              style={[
                styles.rememberCopy,
                season === 'autumn' ? { paddingRight: SHEET_ART.rememberPlant.width / 2 } : null,
              ]}
            >
              <AppText variant="label" color="secondary">
                remember
              </AppText>
              <AppText variant="body" color="secondary">
                {model.rememberLine}
              </AppText>
            </View>
          </View>
        </Reveal>
      ) : null}

      {model.footnote ? (
        <AppText variant="body" color="helper">
          {model.footnote}
        </AppText>
      ) : null}

      {model.cta !== 'none' && model.ctaLabel ? (
        <Reveal visible={visible} order={3}>
          <TactileButton
            accessibilityLabel={model.ctaLabel}
            accessibilityHint={
              model.cta === 'start' ? "Starts today's reset" : "Marks today's reset complete"
            }
            onPress={onPrimary}
            celebrate={allStepsDone}
          >
            <Image
              source={JOURNEY_SPRITES.sheetButtonLeaves}
              accessibilityElementsHidden
              importantForAccessibility="no"
              style={[styles.buttonLeaves, SHEET_ART.buttonLeaves]}
            />
            <AppText variant="button" color="inverse" align="center">
              {model.ctaLabel}
            </AppText>
            <MascotIcon name="arrow" size={20} color={colors.text.inverse} />
          </TactileButton>
        </Reveal>
      ) : null}

      <JourneyConfetti burstKey={burst.key} originX={burst.x} originY={burst.y} />
    </View>
  );
}

/** Two or three of the season's falling pieces drifting beside the title. */
function SeasonDecor({ season }: { season: JourneySeason }) {
  const particles = JOURNEY_SEASON_SCENES[season].particles;

  if (season === 'autumn') {
    return (
      <Image
        source={JOURNEY_SPRITES.sheetTitleLeavesAutumn}
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={[styles.titleLeaves, SHEET_ART.titleLeaves]}
      />
    );
  }

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.decor}
    >
      {TITLE_DECOR.map((piece) => {
        const frame = {
          right: piece.right,
          top: piece.top,
          transform: [{ rotate: `${piece.rotate}deg` }],
        };
        if (particles.kind === 'snow') {
          return (
            <View key={`${piece.right}-${piece.top}`} style={[styles.decorPiece, frame]}>
              <MascotIcon name="snow" size={piece.size * 0.7} color={colors.journeyShadow.cool} />
            </View>
          );
        }
        return (
          <Image
            key={`${piece.right}-${piece.top}`}
            source={particles.source}
            style={[
              styles.decorPiece,
              frame,
              { width: piece.size, height: piece.size * particles.aspect },
            ]}
          />
        );
      })}
    </View>
  );
}

type DayStepsProps = {
  day: number;
  /** A step was just ticked: where its box is, and how many steps are now done. */
  onTicked: (x: number, y: number, checkedCount: number) => void;
};

function DaySteps({ day, onTicked }: DayStepsProps) {
  const stepChecks = useJourneyVisualStore((state) => state.stepChecks);
  const checkStep = useJourneyVisualStore((state) => state.checkStep);
  const checked = stepChecks?.day === day ? stepChecks.checked : [];
  const [listTop, setListTop] = useState(0);
  const [rowCenters, setRowCenters] = useState<Record<number, number>>({});
  const [rowWidth, setRowWidth] = useState(0);

  return (
    <View onLayout={(event) => setListTop(event.nativeEvent.layout.y)}>
      <View style={styles.stepsHeader}>
        <AppText variant="storyEyebrow" color="secondary">
          today
        </AppText>
        <AppText variant="label" color="secondary">
          {`${checked.length} of ${JOURNEY_DAY_STEPS.length}`}
        </AppText>
      </View>
      <StepsProgressBar fraction={checked.length / JOURNEY_DAY_STEPS.length} />
      {JOURNEY_DAY_STEPS.map((step, index) => {
        const isChecked = checked.includes(index);
        return (
          <PressableScale
            key={step.title}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isChecked, disabled: isChecked }}
            disabled={isChecked}
            accessibilityLabel={step.title}
            accessibilityHint={step.hint}
            onLayoutChange={({ y, height, width }) => {
              const center = y + height / 2;
              setRowWidth(width);
              setRowCenters((previous) =>
                previous[index] === center ? previous : { ...previous, [index]: center },
              );
            }}
            onPress={() => {
              // Ticks are permanent; a done row ignores presses.
              const checkedCount = checkStep(day, index);
              if (checkedCount === null) {
                return;
              }
              // A pop and a sprinkle of taps to go with the confetti.
              hapticConfetti();
              // The box sits at the right end of the row.
              onTicked(
                rowWidth - STEP_BOX_SIZE / 2,
                listTop + (rowCenters[index] ?? 0),
                checkedCount,
              );
            }}
            style={styles.stepRow}
          >
            <View style={styles.stepCopy}>
              <AppText variant="optionTitle">{step.title}</AppText>
              <AppText variant="caption" color="secondary">
                {step.hint}
              </AppText>
            </View>
            <PopCheckBox checked={isChecked} size={STEP_BOX_SIZE} />
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay.sheetScrim,
  },
  peekBand: {
    zIndex: 0,
  },
  /**
   * Not clipped: the sheet (drawn above) already hides everything below its
   * edge, and clipping here cut off the hat when the mascot hopped or the
   * spring overshot.
   */
  peekClip: {
    overflow: 'visible',
  },
  sheet: {
    zIndex: 1,
    backgroundColor: colors.journeySheet.background,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    // A hairline of light along the top edge, like a lit card.
    borderTopWidth: 1,
    borderTopColor: colors.journeySheet.topHighlight,
    ...shadows.medium,
  },
  handleWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  handle: {
    width: spacing.hitTarget,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.border.default,
  },
  content: {
    gap: spacing.md,
    paddingTop: spacing.xxs,
  },
  titleBlock: {
    gap: spacing.xs,
  },
  /** Keeps the title and description clear of the decorative pieces on the right. */
  titleText: {
    paddingRight: spacing.xxxl,
  },
  decor: {
    ...StyleSheet.absoluteFill,
  },
  decorPiece: {
    position: 'absolute',
  },
  stepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.xs,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: spacing.hitTarget + spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.journeySheet.divider,
  },
  stepCopy: {
    flex: 1,
    gap: 2,
  },
  titleLeaves: {
    position: 'absolute',
  },
  remember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    paddingLeft: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.journeySheet.rememberCard,
  },
  rememberCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  rememberPlant: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  buttonLeaves: {
    position: 'absolute',
    bottom: 0,
  },
});
