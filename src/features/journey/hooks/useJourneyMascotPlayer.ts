import { useEffect, useRef } from 'react';
import { useEventListener } from 'expo';
import { useVideoPlayer, type VideoPlayer } from 'expo-video';
import { useReducedMotion } from 'react-native-reanimated';

const JOURNEY_MASCOT_VIDEO = require('../../../../assets/videos/journey/mascot-idle.mov');

/**
 * Looping, muted Journey mascot. Plays only while `active`; with Reduce Motion
 * it never starts, so it rests on the first frame.
 */
export function useJourneyMascotPlayer(active: boolean): VideoPlayer {
  const reduceMotion = useReducedMotion();
  const shouldPlay = active && !reduceMotion;
  const shouldPlayRef = useRef(shouldPlay);
  const player = useVideoPlayer(JOURNEY_MASCOT_VIDEO, (created) => {
    created.loop = true;
    created.muted = true;
    created.audioMixingMode = 'mixWithOthers';
    created.allowsExternalPlayback = false;
    created.showNowPlayingNotification = false;
    created.staysActiveInBackground = false;
    created.keepScreenOnWhilePlaying = false;
  });

  useEffect(() => {
    shouldPlayRef.current = shouldPlay;
    if (shouldPlay) {
      player.play();
      return;
    }
    player.pause();
  }, [player, shouldPlay]);

  // A play() before the video view mounts is dropped, so start again once ready.
  useEventListener(player, 'statusChange', ({ status }) => {
    if (status === 'readyToPlay' && shouldPlayRef.current) {
      player.play();
    }
  });

  return player;
}
