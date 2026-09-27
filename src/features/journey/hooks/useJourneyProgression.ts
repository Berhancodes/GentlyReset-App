/* Timed day-progression sequence. React state updates from timeouts are the
 * machine; do not derive walking/celebrating from render alone. */
/* eslint-disable react-hooks/set-state-in-effect */

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
  showProgressMascot: boolean;
  leftNode: JourneyDayState;
  rightNode: JourneyDayState | undefined;
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
};

function idlePresentation(
  currentDay: number,
  completedDays: readonly number[],
  todayCompleted: boolean,
  currentTitle: string,
): JourneyProgressionPresentation {
  const visibleDays = getJourneyVisibleDays(currentDay);
  const leftDay = visibleDays[0] ?? currentDay;
  const rightDay = visibleDays[1];

  return {
    phase: 'idle',
    playing: false,
    fromDay: currentDay,
    toDay: currentDay,
    visibleDays,
    headingDay: currentDay,
    headingTitle: currentTitle,
    progressDay: currentDay,
    showProgressMascot: false,
    leftNode: getJourneyDayState(leftDay, currentDay, completedDays, todayCompleted),
    rightNode:
      rightDay === undefined
        ? undefined
        : getJourneyDayState(rightDay, currentDay, completedDays, todayCompleted),
  };
}

function progressingPresentation(sequence: ProgressionSequence): JourneyProgressionPresentation {
  const showingGif = sequence.phase === 'walking' || sequence.phase === 'celebrating';

  return {
    phase: sequence.phase,
    playing: true,
    fromDay: sequence.fromDay,
    toDay: sequence.toDay,
    visibleDays: [sequence.fromDay, sequence.toDay],
    headingDay: sequence.arrived ? sequence.toDay : sequence.fromDay,
    headingTitle: getPlanDayTitle(sequence.arrived ? sequence.toDay : sequence.fromDay),
    progressDay: sequence.arrived ? sequence.toDay : sequence.fromDay,
    showProgressMascot: showingGif,
    leftNode: {
      day: sequence.fromDay,
      kind: 'completed',
      todayCompleted: false,
    },
    rightNode: {
      day: sequence.toDay,
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
  const [sequence, setSequence] = useState<ProgressionSequence | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const playingRef = useRef(false);

  useEffect(() => {
    const clearTimers = () => {
      for (const timer of timersRef.current) {
        clearTimeout(timer);
      }
      timersRef.current = [];
    };

    const settleIdle = () => {
      playingRef.current = false;
      setSequence(null);
      acknowledgeDay(currentDay);
    };

    const decision = getJourneyProgression({
      currentDay,
      acknowledgedDay,
    });

    if (!focused) {
      if (playingRef.current || decision.kind === 'advance' || decision.kind === 'snap') {
        clearTimers();
        settleIdle();
      }
      return;
    }

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

    playingRef.current = true;
    const { fromDay, toDay } = decision;

    if (reduceMotion) {
      void hapticSuccess();
      setSequence({ phase: 'settling', fromDay, toDay, arrived: true });
      const settle = setTimeout(() => {
        settleIdle();
      }, motion.duration.journeyProgressSettle);
      timersRef.current = [settle];
      return () => {
        clearTimers();
        playingRef.current = false;
      };
    }

    void hapticSuccess();
    setSequence({ phase: 'holding', fromDay, toDay, arrived: false });

    const walkTimer = setTimeout(() => {
      setSequence({ phase: 'walking', fromDay, toDay, arrived: false });
    }, motion.duration.journeyProgressHold);

    const arriveTimer = setTimeout(() => {
      void hapticImpact();
      setSequence({ phase: 'celebrating', fromDay, toDay, arrived: true });
    }, motion.duration.journeyProgressHold + motion.duration.journeyProgressWalk);

    const doneTimer = setTimeout(() => {
      settleIdle();
    }, motion.duration.journeyProgressHold + motion.duration.journeyProgressTotal);

    timersRef.current = [walkTimer, arriveTimer, doneTimer];

    return () => {
      clearTimers();
      playingRef.current = false;
    };
  }, [acknowledgeDay, acknowledgedDay, currentDay, focused, reduceMotion]);

  if (sequence) {
    return progressingPresentation(sequence);
  }

  return idlePresentation(currentDay, completedDays, todayCompleted, currentTitle);
}
