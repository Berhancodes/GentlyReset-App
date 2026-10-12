import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import {
  Mascot,
  MascotSpeechBubble,
  type MascotHandle,
  type MascotState,
} from '@/components/mascot';
import type { MascotReaction } from '@/components/mascot/mascotAnimations';
import {
  MASCOT_SOURCE_HEIGHT,
  MASCOT_SOURCE_WIDTH,
  MASCOT_START_BOUNDS,
} from '@/components/mascot/mascotLayout';
import { spacing } from '@/design-system';
import {
  getHomeMascotBubble,
  getHomeMascotIdleBubble,
  type HomeMascotBubbleContext,
} from '@/features/home/utils/getHomeMascotReaction';
import { hapticImpact } from '@/utils/haptics';

const MASCOT_MAX_WIDTH = 420;
const MASCOT_HEIGHT_FRACTION = 0.62;
const FRAME_ASPECT = 0.86;
const BUBBLE_CLEARANCE = spacing.lg + spacing.xxs;
/** How long a reaction's line stays after the animation ends. */
const REACTION_LINE_HOLD_MS = 2500;
/** He starts moving a beat before he speaks. */
const SPEAK_AFTER_MS = 180;

function getMascotFrameMetrics(frameWidth: number, frameHeight: number) {
  const containScale = Math.min(
    frameWidth / MASCOT_SOURCE_WIDTH,
    frameHeight / MASCOT_SOURCE_HEIGHT,
  );
  const videoHeight = MASCOT_SOURCE_HEIGHT * containScale;
  const videoTop = (frameHeight - videoHeight) / 2;
  const hatSourceY = MASCOT_START_BOUNDS.idle.feetY - MASCOT_START_BOUNDS.idle.height;

  return {
    hatTop: videoTop + hatSourceY * containScale,
    feetY: videoTop + MASCOT_START_BOUNDS.idle.feetY * containScale,
  };
}

export type HomeMascotLine = { reaction: MascotReaction; line: string };

/** Where the mascot stands inside its frame, so scenery can be drawn around it. */
export type HomeMascotBackdropLayout = {
  frameWidth: number;
  frameHeight: number;
  /** Feet line, measured from the top of the frame. */
  feetY: number;
  windowWidth: number;
};

/**
 * Home presentation around the shared mascot playback controller.
 * Screen layout stays here; clip switching lives in `<Mascot />`.
 */
type HomeMascotProps = {
  /** What today looks like, so the mascot's lines fit the moment. */
  bubbleContext: HomeMascotBubbleContext;
  /** Scenery drawn behind the mascot (Home's room). */
  backdrop?: (layout: HomeMascotBackdropLayout) => ReactNode;
  /** A one-time introduction: the first beat plays on its own, each tap plays the next. */
  script?: readonly HomeMascotLine[];
  onScriptDone?: () => void;
  /** Something to say once, e.g. when the room grows. Played again whenever `key` changes. */
  announcement?: HomeMascotLine & { key: string };
};

export function HomeMascot({
  bubbleContext,
  backdrop,
  script,
  onScriptDone,
  announcement,
}: HomeMascotProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const mascotRef = useRef<MascotHandle>(null);
  const [ready, setReady] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>({ type: 'idle' });
  const [reactionLine, setReactionLine] = useState<string | null>(null);
  const lastLine = useRef<string | undefined>(undefined);
  const idleLine = getHomeMascotIdleBubble(new Date().getHours());
  const [scriptStep, setScriptStep] = useState(0);
  const scriptActive = Boolean(script && script.length > 0 && scriptStep < script.length);
  const playedAnnouncement = useRef<string | null>(null);

  const say = useCallback((beat: HomeMascotLine) => {
    mascotRef.current?.play(beat.reaction);
    lastLine.current = beat.line;
    setReactionLine(beat.line);
  }, []);

  // A room upgrade plays its reaction once; its line shows while the announcement lasts.
  useEffect(() => {
    if (
      !ready ||
      !announcement ||
      scriptActive ||
      playedAnnouncement.current === announcement.key
    ) {
      return;
    }
    playedAnnouncement.current = announcement.key;
    mascotRef.current?.play(announcement.reaction);
  }, [announcement, ready, scriptActive]);

  // Keep the reaction's line up briefly after he settles, then go back to the prompt.
  // During the introduction the line stays until the next tap.
  useEffect(() => {
    if (mascotState.type !== 'idle' || reactionLine === null || scriptActive) {
      return;
    }
    const timer = setTimeout(() => setReactionLine(null), REACTION_LINE_HOLD_MS);
    return () => clearTimeout(timer);
  }, [mascotState.type, reactionLine, scriptActive]);

  const availableWidth = Math.round(windowWidth - spacing.sm * 2);
  const widthFromHeight = Math.round(windowHeight * MASCOT_HEIGHT_FRACTION * FRAME_ASPECT);
  const frameWidth = Math.max(
    spacing.xxxl,
    Math.min(availableWidth, widthFromHeight, MASCOT_MAX_WIDTH),
  );
  const frameHeight = Math.round(frameWidth / FRAME_ASPECT);
  const metrics = getMascotFrameMetrics(frameWidth, frameHeight);
  const bubbleBottom = frameHeight - metrics.hatTop + BUBBLE_CLEARANCE;

  const firstBeat = script?.[0];
  const handleReadyChange = useCallback(
    (isReady: boolean) => {
      setReady(isReady);
      // The introduction's first beat plays by itself once he is ready.
      if (isReady && firstBeat && scriptStep === 0) {
        say(firstBeat);
        setScriptStep(1);
      }
    },
    [firstBeat, say, scriptStep],
  );

  const handleStateChange = useCallback((nextState: MascotState) => {
    setMascotState(nextState);
  }, []);

  const canTap = ready && mascotState.type === 'idle';

  function handlePress() {
    if (!canTap) {
      return;
    }

    const nextBeat = script?.[scriptStep];
    if (scriptActive && nextBeat) {
      say(nextBeat);
      const nextStep = scriptStep + 1;
      setScriptStep(nextStep);
      if (script && nextStep >= script.length) {
        onScriptDone?.();
      }
      void hapticImpact();
      return;
    }

    const reaction = mascotRef.current?.playRandom();
    if (!reaction) {
      return;
    }

    const line = getHomeMascotBubble(reaction, {
      ...bubbleContext,
      previousLine: lastLine.current,
    });
    lastLine.current = line;
    setReactionLine(line);
    void hapticImpact();
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Gently Reset mascot"
      accessibilityHint="Plays a short reaction"
      disabled={!canTap}
      onPress={handlePress}
      style={[styles.hit, { width: frameWidth, height: frameHeight }]}
    >
      {backdrop ? (
        <View pointerEvents="none" style={styles.backdrop}>
          {backdrop({ frameWidth, frameHeight, feetY: metrics.feetY, windowWidth })}
        </View>
      ) : null}
      <Mascot
        ref={mascotRef}
        width={frameWidth}
        height={frameHeight}
        onReadyChange={handleReadyChange}
        onStateChange={handleStateChange}
      />
      <View pointerEvents="none" style={[styles.bubbleLayer, { bottom: bubbleBottom }]}>
        <MascotSpeechBubble
          text={reactionLine ?? (announcement && !scriptActive ? announcement.line : idleLine)}
          visible
          swapDelay={reactionLine ? SPEAK_AFTER_MS : 0}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'visible',
  },
  bubbleLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
