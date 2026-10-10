import { useCallback, useEffect, type RefObject } from 'react';
import type { View } from 'react-native';

import { motion } from '@/design-system';

import type { StagePose } from './stagePoses';
import { useStageStore } from './stageStore';
import { useIsOutgoingStage } from './StageTransition';

/** Sets the mascot's pose and line when a stage screen arrives. */
export function useStageScene(pose: StagePose, line?: string | null) {
  const outgoing = useIsOutgoingStage();
  const show = useStageStore((state) => state.show);

  useEffect(() => {
    if (!outgoing) {
      show(pose, line ?? null);
    }
  }, [line, outgoing, pose, show]);
}

/**
 * Sends answers to the mascot. Returns how long the flight takes, so the
 * screen can move on once he has caught them.
 */
export function useStageFlight() {
  const launch = useStageStore((state) => state.launch);

  return useCallback(
    (sources: readonly { ref: RefObject<View | null>; label: string }[]): number => {
      sources.forEach((source, index) => {
        source.ref.current?.measureInWindow((x, y, width, height) => {
          launch({
            label: source.label,
            from: { x, y, width, height },
            delayMs: index * motion.duration.stageFlightStagger,
          });
        });
      });
      if (sources.length === 0) {
        return 0;
      }
      return (
        motion.duration.stageFlight + (sources.length - 1) * motion.duration.stageFlightStagger
      );
    },
    [launch],
  );
}
