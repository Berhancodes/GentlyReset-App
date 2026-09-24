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
    finishedRef.current = false;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const durationMs =
      Number.isFinite(mockDurationMs) && mockDurationMs > 0 ? mockDurationMs : 5200;
    const holdMs =
      Number.isFinite(settleMs) && settleMs > 0 ? settleMs : motion.duration.loadingHold;

    if (stageCount > 0) {
      const perStage = durationMs / stageCount;
      for (let index = 0; index < stageCount; index += 1) {
        timers.push(
          setTimeout(
            () => {
              setCompletedCount(index + 1);
            },
            perStage * (index + 1),
          ),
        );
      }
    }

    timers.push(
      setTimeout(() => {
        if (finishedRef.current) {
          return;
        }
        finishedRef.current = true;
        onCompleteRef.current();
      }, durationMs + holdMs),
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [mockDurationMs, settleMs, stageCount]);

  return completedCount;
}
