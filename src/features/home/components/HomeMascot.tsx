import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import {
  Mascot,
  MascotSpeechBubble,
  type MascotHandle,
  type MascotState,
} from '@/components/mascot';
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

function getMascotHatTop(frameWidth: number, frameHeight: number) {
  const containScale = Math.min(
    frameWidth / MASCOT_SOURCE_WIDTH,
    frameHeight / MASCOT_SOURCE_HEIGHT,
  );
  const videoHeight = MASCOT_SOURCE_HEIGHT * containScale;
  const videoTop = (frameHeight - videoHeight) / 2;
  const hatSourceY = MASCOT_START_BOUNDS.idle.feetY - MASCOT_START_BOUNDS.idle.height;

  return videoTop + hatSourceY * containScale;
}

/**
 * Home presentation around the shared mascot playback controller.
 * Screen layout stays here; clip switching lives in `<Mascot />`.
 */
type HomeMascotProps = {
  /** What today looks like, so the mascot's lines fit the moment. */
  bubbleContext: HomeMascotBubbleContext;
};

export function HomeMascot({ bubbleContext }: HomeMascotProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const mascotRef = useRef<MascotHandle>(null);
  const [ready, setReady] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>({ type: 'idle' });
  const [reactionLine, setReactionLine] = useState<string | null>(null);
  const lastLine = useRef<string | undefined>(undefined);
  const idleLine = getHomeMascotIdleBubble(new Date().getHours());

  // Keep the reaction's line up briefly after he settles, then go back to the prompt.
  useEffect(() => {
    if (mascotState.type !== 'idle' || reactionLine === null) {
      return;
    }
    const timer = setTimeout(() => setReactionLine(null), REACTION_LINE_HOLD_MS);
    return () => clearTimeout(timer);
  }, [mascotState.type, reactionLine]);

  const availableWidth = Math.round(windowWidth - spacing.sm * 2);
  const widthFromHeight = Math.round(windowHeight * MASCOT_HEIGHT_FRACTION * FRAME_ASPECT);
  const frameWidth = Math.max(
    spacing.xxxl,
    Math.min(availableWidth, widthFromHeight, MASCOT_MAX_WIDTH),
  );
  const frameHeight = Math.round(frameWidth / FRAME_ASPECT);
  const bubbleBottom = frameHeight - getMascotHatTop(frameWidth, frameHeight) + BUBBLE_CLEARANCE;

  const handleReadyChange = useCallback((isReady: boolean) => {
    setReady(isReady);
  }, []);

  const handleStateChange = useCallback((nextState: MascotState) => {
    setMascotState(nextState);
  }, []);

  const canTap = ready && mascotState.type === 'idle';

  function handlePress() {
    if (!canTap) {
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
      <Mascot
        ref={mascotRef}
        width={frameWidth}
        height={frameHeight}
        onReadyChange={handleReadyChange}
        onStateChange={handleStateChange}
      />
      <View pointerEvents="none" style={[styles.bubbleLayer, { bottom: bubbleBottom }]}>
        <MascotSpeechBubble
          text={reactionLine ?? idleLine}
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
  bubbleLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
