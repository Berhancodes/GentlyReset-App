import { useCallback, useEffect, useRef, useState } from 'react';
import { useEventListener } from 'expo';
import { useFocusEffect } from 'expo-router';
import { useVideoPlayer, type VideoPlayer } from 'expo-video';
import { useReducedMotion } from 'react-native-reanimated';

import {
  getVisibleMascotAnimation,
  MASCOT_ANIMATIONS,
  pickMascotReaction,
  type MascotAnimation,
  type MascotReaction,
  type MascotState,
} from '@/components/mascot/mascotAnimations';
import { MASCOT_VIDEO_SOURCES } from '@/components/mascot/mascotAssets';

export type MascotHandle = {
  play: (animation: MascotReaction) => boolean;
  playRandom: () => MascotReaction | null;
};

type UseMascotAnimationResult = {
  ready: boolean;
  state: MascotState;
  visibleAnimation: MascotAnimation;
  players: Record<MascotAnimation, VideoPlayer>;
  play: (animation: MascotReaction) => boolean;
  playRandom: () => MascotReaction | null;
};

function configurePlayer(player: VideoPlayer, loop: boolean) {
  player.loop = loop;
  player.muted = true;
  player.audioMixingMode = 'mixWithOthers';
  player.allowsExternalPlayback = false;
  player.showNowPlayingNotification = false;
  player.staysActiveInBackground = false;
  player.keepScreenOnWhilePlaying = false;
}

function pauseAtStart(player: VideoPlayer) {
  player.pause();
  player.currentTime = 0;
}

export function useMascotAnimation(): UseMascotAnimationResult {
  const reduceMotion = useReducedMotion();
  const idlePlayer = useVideoPlayer(MASCOT_VIDEO_SOURCES.idle, (player) => {
    configurePlayer(player, true);
  });
  const wavePlayer = useVideoPlayer(MASCOT_VIDEO_SOURCES.wave, (player) => {
    configurePlayer(player, false);
  });
  const jumpPlayer = useVideoPlayer(MASCOT_VIDEO_SOURCES.jump, (player) => {
    configurePlayer(player, false);
  });
  const hugPlayer = useVideoPlayer(MASCOT_VIDEO_SOURCES.hug, (player) => {
    configurePlayer(player, false);
  });
  const wigglePlayer = useVideoPlayer(MASCOT_VIDEO_SOURCES.wiggle, (player) => {
    configurePlayer(player, false);
  });

  const players = {
    idle: idlePlayer,
    wave: wavePlayer,
    jump: jumpPlayer,
    hug: hugPlayer,
    wiggle: wigglePlayer,
  };
  const playersRef = useRef(players);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<MascotState>({ type: 'idle' });
  const stateRef = useRef<MascotState>(state);
  const readyRef = useRef(false);
  const focusedRef = useRef(false);
  const reduceMotionRef = useRef(reduceMotion);
  const previousReaction = useRef<MascotReaction | undefined>(undefined);
  const statuses = useRef<Partial<Record<MascotAnimation, string>>>({});

  useEffect(() => {
    playersRef.current = {
      idle: idlePlayer,
      wave: wavePlayer,
      jump: jumpPlayer,
      hug: hugPlayer,
      wiggle: wigglePlayer,
    };
  }, [hugPlayer, idlePlayer, jumpPlayer, wavePlayer, wigglePlayer]);

  useEffect(() => {
    reduceMotionRef.current = reduceMotion;
  }, [reduceMotion]);

  const syncState = useCallback((nextState: MascotState) => {
    stateRef.current = nextState;
    setState(nextState);
  }, []);

  const pauseAll = useCallback(() => {
    MASCOT_ANIMATIONS.forEach((animation) => {
      playersRef.current[animation].pause();
    });
  }, []);

  const startIdle = useCallback(() => {
    const nextPlayers = playersRef.current;
    pauseAtStart(nextPlayers.wave);
    pauseAtStart(nextPlayers.jump);
    pauseAtStart(nextPlayers.hug);
    pauseAtStart(nextPlayers.wiggle);
    nextPlayers.idle.currentTime = 0;
    syncState({ type: 'idle' });

    if (focusedRef.current && !reduceMotionRef.current) {
      nextPlayers.idle.play();
      return;
    }

    nextPlayers.idle.pause();
  }, [syncState]);

  const play = useCallback(
    (animation: MascotReaction) => {
      if (!readyRef.current || reduceMotionRef.current || stateRef.current.type === 'reaction') {
        return false;
      }

      const nextPlayers = playersRef.current;
      pauseAtStart(nextPlayers[animation]);
      syncState({ type: 'reaction', animation });
      previousReaction.current = animation;
      nextPlayers[animation].play();
      nextPlayers.idle.pause();
      return true;
    },
    [syncState],
  );

  const playRandom = useCallback(() => {
    const reaction = pickMascotReaction(previousReaction.current);
    return play(reaction) ? reaction : null;
  }, [play]);

  const markReadyIfComplete = useCallback(() => {
    if (readyRef.current) {
      return;
    }

    const allReady = MASCOT_ANIMATIONS.every(
      (animation) => statuses.current[animation] === 'readyToPlay',
    );
    if (!allReady) {
      return;
    }

    readyRef.current = true;
    setReady(true);
    if (stateRef.current.type === 'idle') {
      startIdle();
    }
  }, [startIdle]);

  useEventListener(idlePlayer, 'statusChange', ({ status }) => {
    statuses.current.idle = status;
    markReadyIfComplete();
  });
  useEventListener(wavePlayer, 'statusChange', ({ status }) => {
    statuses.current.wave = status;
    markReadyIfComplete();
  });
  useEventListener(jumpPlayer, 'statusChange', ({ status }) => {
    statuses.current.jump = status;
    markReadyIfComplete();
  });
  useEventListener(hugPlayer, 'statusChange', ({ status }) => {
    statuses.current.hug = status;
    markReadyIfComplete();
  });
  useEventListener(wigglePlayer, 'statusChange', ({ status }) => {
    statuses.current.wiggle = status;
    markReadyIfComplete();
  });

  useEventListener(wavePlayer, 'playToEnd', () => {
    if (stateRef.current.type === 'reaction' && stateRef.current.animation === 'wave') {
      startIdle();
    }
  });
  useEventListener(jumpPlayer, 'playToEnd', () => {
    if (stateRef.current.type === 'reaction' && stateRef.current.animation === 'jump') {
      startIdle();
    }
  });
  useEventListener(hugPlayer, 'playToEnd', () => {
    if (stateRef.current.type === 'reaction' && stateRef.current.animation === 'hug') {
      startIdle();
    }
  });
  useEventListener(wigglePlayer, 'playToEnd', () => {
    if (stateRef.current.type === 'reaction' && stateRef.current.animation === 'wiggle') {
      startIdle();
    }
  });

  useEffect(() => {
    MASCOT_ANIMATIONS.forEach((animation) => {
      statuses.current[animation] = playersRef.current[animation].status;
    });
    markReadyIfComplete();
  }, [markReadyIfComplete]);

  useFocusEffect(
    useCallback(() => {
      focusedRef.current = true;
      if (readyRef.current && stateRef.current.type === 'idle') {
        startIdle();
      }

      return () => {
        focusedRef.current = false;
        pauseAll();
        if (stateRef.current.type === 'reaction') {
          syncState({ type: 'idle' });
        }
      };
    }, [pauseAll, startIdle, syncState]),
  );

  useEffect(() => {
    return () => {
      focusedRef.current = false;
      pauseAll();
    };
  }, [pauseAll]);

  return {
    ready,
    state,
    visibleAnimation: getVisibleMascotAnimation(state),
    players,
    play,
    playRandom,
  };
}
