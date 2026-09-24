import { useEffect, useRef } from 'react';

import { motion } from '@/design-system';
import { ONBOARDING_STEPS } from '@/features/onboarding/data/onboardingSteps';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';

let autoAdvanceSession = 0;

/**
 * Advance only if this step is still current. Unmounting invalidates any
 * leftover timers so an exiting screen cannot skip the next one.
 */
export function useBoundAutoAdvance(stepId: string, ready: boolean, onAdvance: () => void) {
  const tokenRef = useRef(0);
  const onAdvanceRef = useRef(onAdvance);

  useEffect(() => {
    onAdvanceRef.current = onAdvance;
  }, [onAdvance]);

  useEffect(() => {
    autoAdvanceSession += 1;
    tokenRef.current = autoAdvanceSession;

    return () => {
      autoAdvanceSession += 1;
    };
  }, [stepId]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const token = tokenRef.current;
    const timeoutId = setTimeout(() => {
      if (token !== autoAdvanceSession) {
        return;
      }
      const current = ONBOARDING_STEPS[useOnboardingStore.getState().currentStepIndex];
      if (current?.id !== stepId) {
        return;
      }
      onAdvanceRef.current();
    }, motion.duration.storyHold);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [ready, stepId]);
}
