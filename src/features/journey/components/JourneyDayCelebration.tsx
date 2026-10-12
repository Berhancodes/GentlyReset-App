import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/design-system';
import { JourneyCelebrationSticker } from '@/features/journey/components/JourneyCelebrationSticker';
import { JourneyStarShower } from '@/features/journey/components/JourneyStarShower';
import { getJourneySeasonSceneLayout } from '@/features/journey/layout/journeyStageLayout';
import { STAGE_POSE_ART } from '@/features/onboarding/stage/stagePoses';
import { hapticCelebration } from '@/utils/haptics';

const CHEER_ART = STAGE_POSE_ART.cheer;

const BLUR_IN_MS = 300;
const BLUR_OUT_MS = 350;
const BLUR_INTENSITY = 28;
/** How long the whole moment lasts before the night clears. */
const CELEBRATION_MS = 3600;
const HOP_DELAY_MS = 250;
const HOP_UP_MS = 260;
const HOP_DOWN_MS = 230;
const HOP_COUNT = 3;
/** How high he hops, as a fraction of his height. */
const HOP_HEIGHT = 0.16;
/**
 * The sticker must clear the top of the jump: from his body center to the top of
 * his hat is ~0.26 of the idle frame, and the jump lifts him ~0.14 more.
 */
const STICKER_CLEARANCE = 0.4;
const STICKER_GAP = 16;

type JourneyDayCelebrationProps = {
  /** True from the moment today is completed until the jump finishes. */
  active: boolean;
  /** The plan day just completed, for "Day N done". */
  day: number;
  /** The night has cleared and the mascot is back in his idle spot. */
  onDone: () => void;
};

/**
 * Day-complete moment: the screen turns to a night sky, gold stars fall, a
 * "WOOOO! Day N done" sticker slaps on, sparkles pop around the mascot and he
 * cheers, hopping three times in his usual spot, with a strong rumble. Then it clears.
 */
export function JourneyDayCelebration({ active, day, onDone }: JourneyDayCelebrationProps) {
  const reduceMotion = useReducedMotion();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [showerKey, setShowerKey] = useState(0);
  const night = useSharedValue(0);
  const [finished, setFinished] = useState(false);
  const [wasActive, setWasActive] = useState(active);
  const finishing = useRef(false);
  const hop = useSharedValue(0);

  // A new celebration starts unfinished.
  if (active !== wasActive) {
    setWasActive(active);
    if (active) {
      setFinished(false);
      setShowerKey((key) => key + 1);
    }
  }

  const nightOn = active && !finished && !reduceMotion;
  useEffect(() => {
    night.value = withTiming(nightOn ? 1 : 0, { duration: nightOn ? BLUR_IN_MS : BLUR_OUT_MS });
  }, [night, nightOn]);

  const finish = () => {
    if (finishing.current) {
      return;
    }
    finishing.current = true;
    setFinished(true);
    setTimeout(onDone, BLUR_OUT_MS);
  };

  useEffect(() => {
    if (!active) {
      return;
    }
    finishing.current = false;
    // The rumble plays even with Reduce Motion; it's the one part that isn't movement.
    const stopRumble = hapticCelebration();
    if (reduceMotion) {
      const skip = setTimeout(onDone, 0);
      return () => {
        clearTimeout(skip);
        stopRumble();
      };
    }
    cancelAnimation(hop);
    hop.value = 0;
    hop.value = withDelay(
      HOP_DELAY_MS,
      withRepeat(
        withSequence(
          withTiming(1, { duration: HOP_UP_MS, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: HOP_DOWN_MS, easing: Easing.in(Easing.quad) }),
        ),
        HOP_COUNT,
      ),
    );
    const end = setTimeout(finish, CELEBRATION_MS);
    return () => {
      clearTimeout(end);
      stopRumble();
    };
    // Runs once per celebration; `finish`, `onDone` and `hop` don't change during one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduceMotion]);

  const layout =
    size.width > 0 && size.height > 0 ? getJourneySeasonSceneLayout(size.width, size.height) : null;
  const nightStyle = useAnimatedStyle(() => ({ opacity: night.value }));
  const hopHeight = (layout?.celebrationMascot.height ?? 0) * HOP_HEIGHT;
  // Up he goes, stretching a touch; he squashes as he lands.
  const hopStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -hop.value * hopHeight },
      { scaleX: 1 - hop.value * 0.03 },
      { scaleY: 1 + hop.value * 0.03 },
    ],
  }));
  const mascot = layout?.celebrationMascot;
  const centerX = mascot ? mascot.left + mascot.width / 2 : 0;
  const centerY = layout ? layout.mascot.top + layout.mascot.height * 0.45 : 0;
  const reach = layout ? layout.mascot.width : 0;
  const bodyCenterY = layout ? layout.mascot.top + layout.mascot.height * 0.5 : 0;
  const stickerBottom = layout
    ? size.height - (bodyCenterY - layout.mascot.height * STICKER_CLEARANCE - STICKER_GAP)
    : 0;

  return (
    <View
      pointerEvents={active ? 'auto' : 'none'}
      accessibilityElementsHidden={!active}
      importantForAccessibility={active ? 'yes' : 'no-hide-descendants'}
      accessibilityLabel={active ? `Day ${day} done. Checked in for today` : undefined}
      style={styles.root}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        if (width !== size.width || height !== size.height) {
          setSize({ width, height });
        }
      }}
    >
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, nightStyle]}>
        <BlurView intensity={BLUR_INTENSITY} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.night} />
      </Animated.View>

      {layout && nightOn ? (
        <JourneyStarShower
          playKey={showerKey}
          width={size.width}
          height={size.height}
          originX={centerX}
          originY={centerY}
          reach={reach}
        />
      ) : null}

      {mascot ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.mascot,
            {
              left: mascot.left,
              top: mascot.top,
              width: mascot.width,
              height: mascot.height,
              opacity: active ? 1 : 0,
            },
            hopStyle,
          ]}
        >
          <Image
            source={CHEER_ART.source}
            resizeMode="contain"
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={{ width: mascot.width, height: mascot.height }}
          />
        </Animated.View>
      ) : null}

      {layout ? (
        <JourneyCelebrationSticker
          day={day}
          centerX={centerX}
          bottom={stickerBottom}
          visible={nightOn}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    zIndex: 20,
  },
  night: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.celebration.night,
  },
  mascot: {
    position: 'absolute',
  },
});
