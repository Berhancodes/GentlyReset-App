/* Timed day-progression sequence. React state updates from timeouts are the
 * machine; do not derive walking/celebrating from render alone. */

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

import { motion } from '@/design-system';
import { getJourneyVisibleDays } from '@/features/journey/layout/journeyStageLayout';
import { useJourneyVisualStore } from '@/features/journey/store/useJourneyVisualStore';
import {
  getJourneyDayState,
  type JourneyDayState,
} from '@/features/journey/utils/getJourneyDayState';
import { getJourneyProgression } from '@/features/journey/utils/getJourneyProgression';
import { getJourneyIncomingDay } from '@/features/journey/utils/getJourneyTimelineMotion';
import {
  getJourneyWalkDirection,
  type JourneyWalkDirection,
} from '@/features/journey/utils/getJourneyWalkMotion';
import { getPlanDayTitle } from '@/features/reset/data/thirtyDayPlan';
import { hapticImpact, hapticSuccess } from '@/utils/haptics';

export type JourneyProgressPhase = 'idle' | 'holding' | 'walking' | 'celebrating' | 'settling';

export type JourneyProgressionPresentation = {
  phase: JourneyProgressPhase;
  playing: boolean;
  fromDay: number;
  toDay: number;
  visibleDays: readonly number[];
  headingDay: number;
  headingTitle: string;
  progressDay: number;
  walkDirection: JourneyWalkDirection;
  showProgressMascot: boolean;
  outgoingNode: JourneyDayState;
  incomingNode: JourneyDayState | undefined;
};

type UseJourneyProgressionInput = {
  currentDay: number;
  completedDays: readonly number[];
  todayCompleted: boolean;
  currentTitle: string;
  focused: boolean;
};

type ProgressionSequence = {
  phase: Exclude<JourneyProgressPhase, 'idle'>;
  fromDay: number;
  toDay: number;
  arrived: boolean;
  headingReady: boolean;
  preview: boolean;
};

function idlePresentation(
  displayDay: number,
  currentDay: number,
  completedDays: readonly number[],
  todayCompleted: boolean,
  currentTitle: string,
): JourneyProgressionPresentation {
  const visibleDays = getJourneyVisibleDays(displayDay);

  return {
    phase: 'idle',
    playing: false,
    fromDay: displayDay,
    toDay: displayDay,
    visibleDays,
    headingDay: displayDay,
    headingTitle: displayDay === currentDay ? currentTitle : getPlanDayTitle(displayDay),
    progressDay: displayDay,
    walkDirection: 1,
    showProgressMascot: false,
    outgoingNode: getJourneyDayState(
      displayDay,
      displayDay,
      completedDays,
      displayDay === currentDay && todayCompleted,
    ),
    incomingNode: undefined,
  };
}

function progressingPresentation(sequence: ProgressionSequence): JourneyProgressionPresentation {
  const showingGif = sequence.phase === 'walking' || sequence.phase === 'celebrating';
  const headingDay = sequence.headingReady ? sequence.toDay : sequence.fromDay;
  const incomingDay = getJourneyIncomingDay(sequence.fromDay, sequence.toDay);

  return {
    phase: sequence.phase,
    playing: true,
    fromDay: sequence.fromDay,
    toDay: sequence.toDay,
    visibleDays: incomingDay === undefined ? [sequence.fromDay] : [sequence.fromDay, incomingDay],
    headingDay,
    headingTitle: getPlanDayTitle(headingDay),
    progressDay: sequence.arrived ? sequence.toDay : sequence.fromDay,
    walkDirection: getJourneyWalkDirection(sequence.fromDay, sequence.toDay),
    showProgressMascot: showingGif,
    outgoingNode: {
      day: sequence.fromDay,
      kind: 'completed',
      todayCompleted: false,
    },
    incomingNode:
      incomingDay === undefined
        ? undefined
        : {
            day: incomingDay,
            kind: sequence.arrived ? 'current' : 'future',
            todayCompleted: false,
          },
  };
}

export function useJourneyProgression({
  currentDay,
  completedDays,
  todayCompleted,
  currentTitle,
  focused,
}: UseJourneyProgressionInput): JourneyProgressionPresentation {
  const reduceMotion = useReducedMotion() === true;
  const acknowledgedDay = useJourneyVisualStore((state) => state.acknowledgedDay);
  const acknowledgeDay = useJourneyVisualStore((state) => state.acknowledgeDay);
  const devPreview = useJourneyVisualStore((state) => state.devPreview);
  const restDevSideScroll = useJourneyVisualStore((state) => state.restDevSideScroll);
  const clearDevSideScroll = useJourneyVisualStore((state) => state.clearDevSideScroll);
  const [sequence, setSequence] = useState<ProgressionSequence | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const playingRef = useRef(false);
  const startedPreviewGenerationRef = useRef(0);

  useEffect(() => {
    const clearTimers = () => {
      for (const timer of timersRef.current) {
        clearTimeout(timer);
      }
      timersRef.current = [];
    };

    const startSequence = (fromDay: number, toDay: number, preview: boolean) => {
      playingRef.current = true;

      if (reduceMotion) {
        void hapticSuccess();
        setSequence({
          phase: 'settling',
          fromDay,
          toDay,
          arrived: true,
          headingReady: true,
          preview,
        });
        const settle = setTimeout(() => {
          playingRef.current = false;
          setSequence(null);
          if (preview) {
            restDevSideScroll(toDay);
            return;
          }
          acknowledgeDay(currentDay);
        }, motion.duration.journeyProgressSettle);
        timersRef.current = [settle];
        return;
      }

      void hapticSuccess();
      setSequence({
        phase: 'holding',
        fromDay,
        toDay,
        arrived: false,
        headingReady: false,
        preview,
      });

      const walkTimer = setTimeout(() => {
        setSequence({
          phase: 'walking',
          fromDay,
          toDay,
          arrived: false,
          headingReady: false,
          preview,
        });
      }, motion.duration.journeyProgressHold);

      const arriveTimer = setTimeout(() => {
        void hapticImpact();
        setSequence({
          phase: 'celebrating',
          fromDay,
          toDay,
          arrived: true,
          headingReady: false,
          preview,
        });
      }, motion.duration.journeyProgressHold + motion.duration.journeyProgressWalk);

      const headingTimer = setTimeout(
        () => {
          setSequence((current) => {
            if (!current) {
              return current;
            }
            return { ...current, headingReady: true };
          });
        },
        motion.duration.journeyProgressHold +
          motion.duration.journeyProgressWalk +
          motion.duration.journeyProgressHeadingDelay,
      );

      const doneTimer = setTimeout(() => {
        playingRef.current = false;
        setSequence(null);
        if (preview) {
          restDevSideScroll(toDay);
          return;
        }
        acknowledgeDay(currentDay);
      }, motion.duration.journeyProgressHold + motion.duration.journeyProgressTotal);

      timersRef.current = [walkTimer, arriveTimer, headingTimer, doneTimer];
    };

    if (!focused) {
      if (playingRef.current) {
        clearTimers();
        playingRef.current = false;
        setSequence(null);
        if (devPreview) {
          clearDevSideScroll();
        }
        acknowledgeDay(currentDay);
      }
      return;
    }

    if (devPreview) {
      if (
        devPreview.pendingPlay &&
        startedPreviewGenerationRef.current !== devPreview.generation &&
        !playingRef.current
      ) {
        startedPreviewGenerationRef.current = devPreview.generation;
        startSequence(devPreview.fromDay, devPreview.toDay, true);
        return () => {
          clearTimers();
          playingRef.current = false;
        };
      }
      return;
    }

    const decision = getJourneyProgression({
      currentDay,
      acknowledgedDay,
    });

    if (decision.kind === 'bootstrap') {
      acknowledgeDay(decision.day);
      return;
    }

    if (decision.kind === 'snap') {
      acknowledgeDay(decision.toDay);
      return;
    }

    if (decision.kind === 'idle' || playingRef.current) {
      return;
    }

    startSequence(decision.fromDay, decision.toDay, false);

    return () => {
      clearTimers();
      playingRef.current = false;
    };
  }, [
    acknowledgeDay,
    acknowledgedDay,
    clearDevSideScroll,
    currentDay,
    devPreview,
    focused,
    reduceMotion,
    restDevSideScroll,
  ]);

  if (sequence) {
    return progressingPresentation(sequence);
  }

  const displayDay = devPreview?.restDay ?? currentDay;
  return idlePresentation(displayDay, currentDay, completedDays, todayCompleted, currentTitle);
}
