import { useEffect, useRef, useState } from 'react';

import { motion } from '@/design-system';

type UseStagedLoadingOptions = {
  stageCount: number;
  mockDurationMs: number;
  settleMs?: number;
  onComplete: () => void;
};

/**
 * Mock personalization progress. Later, drive `completedCount` from a real request
 * and delete the timers without changing LoadingScreen.
 */
export function useStagedLoading({
  stageCount,
  mockDurationMs,
  settleMs = motion.duration.loadingHold,
  onComplete,
}: UseStagedLoadingOptions) {
  const [completedCount, setCompletedCount] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const finishedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const schedule = (delayMs: number, callback: () => void) => {
      const timerId = setTimeout(() => {
        timers.delete(timerId);
        callback();
      }, delayMs);
      timers.add(timerId);
    };

    const finish = () => {
      if (finishedRef.current) {
        return;
      }
      finishedRef.current = true;
      onCompleteRef.current();
    };

    if (stageCount === 0) {
      finish();
      return () => {
        timers.forEach(clearTimeout);
        timers.clear();
      };
    }

    const perStage = mockDurationMs / stageCount;
    for (let index = 0; index < stageCount; index += 1) {
      schedule(perStage * (index + 1), () => {
        setCompletedCount(index + 1);
        if (index === stageCount - 1) {
          schedule(settleMs, finish);
        }
      });
    }

    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, [mockDurationMs, settleMs, stageCount]);

  return completedCount;
}
