import { useEffect, useRef, useState } from 'react';

type UseStagedLoadingOptions = {
  stageCount: number;
  mockDurationMs: number;
  onComplete: () => void;
};

/**
 * Mock personalization progress. Later, drive `completedCount` from a real request
 * and delete the timers without changing LoadingScreen.
 */
export function useStagedLoading({
  stageCount,
  mockDurationMs,
  onComplete,
}: UseStagedLoadingOptions) {
  const [completedCount, setCompletedCount] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (stageCount === 0) {
      onCompleteRef.current();
      return;
    }

    const perStage = mockDurationMs / stageCount;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let index = 0; index < stageCount; index += 1) {
      timers.push(
        setTimeout(
          () => {
            setCompletedCount(index + 1);
            if (index === stageCount - 1) {
              timers.push(
                setTimeout(() => {
                  onCompleteRef.current();
                }, 320),
              );
            }
          },
          perStage * (index + 1),
        ),
      );
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [mockDurationMs, stageCount]);

  return completedCount;
}
