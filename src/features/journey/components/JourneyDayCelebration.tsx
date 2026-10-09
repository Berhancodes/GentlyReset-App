import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/design-system';
import { JourneyConfetti } from '@/features/journey/components/JourneyConfetti';
import { JourneyCurvedBanner } from '@/features/journey/components/JourneyCurvedBanner';
import { getJourneySeasonSceneLayout } from '@/features/journey/layout/journeyStageLayout';

const DAY_DONE_VIDEO = require('../../../../assets/videos/journey/mascot-day-done.mov');

const BLUR_IN_MS = 300;
const BLUR_OUT_MS = 350;
const BLUR_INTENSITY = 28;
/** Safety net if the video never reports its end (5.04s clip). */
const FALLBACK_END_MS = 5600;
const CONFETTI_POWER = 2.2;
const BANNER_TEXT = 'WOOOO DAY COMPLETED!';
/**
 * The arch must clear the top of the jump: from his body center to the top of
 * his hat is ~0.26 of the idle frame, and the jump lifts him ~0.14 more.
 */
const BANNER_CLEARANCE = 0.4;
const BANNER_MARGIN = 24;
/** Bursts around the mascot: offsets from his center as fractions of his width, and when. */
const BURSTS = [
  { x: 0, y: -0.15, delay: 150 },
  { x: -0.55, y: 0.05, delay: 500 },
  { x: 0.55, y: 0, delay: 850 },
] as const;

type JourneyDayCelebrationProps = {
  /** True from the moment today is completed until the jump finishes. */
  active: boolean;
  /** Blur has cleared and the mascot is back in his idle spot. */
  onDone: () => void;
};

/**
 * Day-complete moment: the screen blurs, confetti bursts around the mascot and
 * he plays the happy-jump clip in his usual spot. Then the blur clears.
 */
export function JourneyDayCelebration({ active, onDone }: JourneyDayCelebrationProps) {
  const reduceMotion = useReducedMotion();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [bursts, setBursts] = useState<readonly number[]>(BURSTS.map(() => 0));
  const blur = useSharedValue(0);
  const [finished, setFinished] = useState(false);
  const [wasActive, setWasActive] = useState(active);
  const finishing = useRef(false);
  const player = useVideoPlayer(DAY_DONE_VIDEO, (created) => {
    created.loop = false;
    created.muted = true;
    created.audioMixingMode = 'mixWithOthers';
    created.showNowPlayingNotification = false;
    created.staysActiveInBackground = false;
  });

  // A new celebration starts unfinished.
  if (active !== wasActive) {
    setWasActive(active);
    if (active) {
      setFinished(false);
    }
  }

  const blurOn = active && !finished && !reduceMotion;
  useEffect(() => {
    blur.value = withTiming(blurOn ? 1 : 0, { duration: blurOn ? BLUR_IN_MS : BLUR_OUT_MS });
  }, [blur, blurOn]);

  const finish = () => {
    if (finishing.current) {
      return;
    }
    finishing.current = true;
    setFinished(true);
    setTimeout(onDone, BLUR_OUT_MS);
  };

  useEventListener(player, 'playToEnd', finish);

  useEffect(() => {
    if (!active) {
      return;
    }
    finishing.current = false;
    if (reduceMotion) {
      const skip = setTimeout(onDone, 0);
      return () => clearTimeout(skip);
    }
    player.replay();
    const timers = BURSTS.map((burst, index) =>
      setTimeout(() => {
        setBursts((previous) =>
          previous.map((key, burstIndex) => (burstIndex === index ? key + 1 : key)),
        );
      }, burst.delay),
    );
    const fallback = setTimeout(finish, FALLBACK_END_MS);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(fallback);
    };
    // Runs once per celebration; `finish`, `onDone` and `player` don't change during one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduceMotion]);

  const blurStyle = useAnimatedStyle(() => ({ opacity: blur.value }));
  const layout =
    size.width > 0 && size.height > 0 ? getJourneySeasonSceneLayout(size.width, size.height) : null;
  const mascot = layout?.celebrationMascot;
  const centerX = mascot ? mascot.left + mascot.width / 2 : 0;
  const centerY = layout ? layout.mascot.top + layout.mascot.height * 0.45 : 0;
  const reach = layout ? layout.mascot.width : 0;
  const bodyCenterY = layout ? layout.mascot.top + layout.mascot.height * 0.5 : 0;
  const bannerRadius = layout ? layout.mascot.height * BANNER_CLEARANCE + BANNER_MARGIN : 0;

  return (
    <View
      pointerEvents={active ? 'auto' : 'none'}
      accessibilityElementsHidden={!active}
      importantForAccessibility={active ? 'yes' : 'no-hide-descendants'}
      accessibilityLabel={active ? 'Day complete' : undefined}
      style={styles.root}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        if (width !== size.width || height !== size.height) {
          setSize({ width, height });
        }
      }}
    >
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, blurStyle]}>
        <BlurView intensity={BLUR_INTENSITY} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.wash} />
      </Animated.View>

      {mascot ? (
        <View
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
          ]}
        >
          <VideoView
            player={player}
            nativeControls={false}
            allowsVideoFrameAnalysis={false}
            contentFit="contain"
            pointerEvents="none"
            style={{ width: mascot.width, height: mascot.height }}
          />
        </View>
      ) : null}

      {layout ? (
        <JourneyCurvedBanner
          text={BANNER_TEXT}
          centerX={centerX}
          centerY={bodyCenterY}
          radius={bannerRadius}
          visible={blurOn}
        />
      ) : null}

      {layout
        ? BURSTS.map((burst, index) => (
            <JourneyConfetti
              key={`burst-${index}`}
              burstKey={bursts[index] ?? 0}
              originX={centerX + burst.x * reach}
              originY={centerY + burst.y * reach}
              power={CONFETTI_POWER}
            />
          ))
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    zIndex: 20,
  },
  /** Warms the blur so it reads as the app's cream, not grey. */
  wash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay.sheetScrim,
  },
  mascot: {
    position: 'absolute',
  },
});
