import { useEffect, useRef, useState } from 'react';
import type { View } from 'react-native';

import { motion } from '@/design-system';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useStageFlight, useStageScene } from '@/features/onboarding/stage/stageHooks';
import { StageChip, StageChipRow } from '@/features/onboarding/stage/StageChoices';
import { StageButton } from '@/features/onboarding/stage/StageButton';
import { StageLayout } from '@/features/onboarding/stage/StageLayout';
import { useStageStore } from '@/features/onboarding/stage/stageStore';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { MultiChoiceStep, OnboardingOption } from '@/features/onboarding/types/onboarding';
import { canProceed } from '@/features/onboarding/utils/canProceed';
import { getQuestionHelper } from '@/features/onboarding/utils/getQuestionHelper';
import { hapticDeselection, hapticSelection } from '@/utils/haptics';

/** After this many picks the sack scene says its crowded line instead. */
const CROWDED_AFTER = 2;

type MultiChoiceScreenProps = {
  step: MultiChoiceStep;
};

/**
 * Several answers as pills. In the sack layout each pick drops a stone into
 * his sack; in the plant layout each pick plants a sprout by his feet.
 */
export function MultiChoiceScreen({ step }: MultiChoiceScreenProps) {
  const answer = useOnboardingStore((state) => state.answers[step.id]);
  const toggleMultiAnswer = useOnboardingStore((state) => state.toggleMultiAnswer);
  const { goToNext } = useOnboardingNavigation();
  const show = useStageStore((state) => state.show);
  const fly = useStageFlight();
  const [leaving, setLeaving] = useState(false);
  const optionRefs = useRef(new Map<string, View | null>());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const selectedIds = answer?.type === 'multiChoice' ? answer.optionIds : [];
  const restingPose = step.mascot?.pose ?? 'idle-listen';

  useStageScene(restingPose, step.mascot?.line);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const toggle = (option: OnboardingOption) => {
    const adding = !selectedIds.includes(option.id);
    toggleMultiAnswer(step.id, option.id, step.maxSelections);
    if (!adding) {
      void hapticDeselection();
      show(restingPose, null);
      return;
    }
    void hapticSelection();
    const count = selectedIds.length + 1;
    if (step.layout === 'sack' && step.crowdedLine && count > CROWDED_AFTER) {
      show(option.reaction?.pose ?? restingPose, step.crowdedLine);
    } else if (option.reaction) {
      show(option.reaction.pose, option.reaction.line ?? null);
    }
    if (step.layout === 'plant') {
      timers.current.push(
        setTimeout(() => show(restingPose, null), motion.duration.stagePlantCheer),
      );
    }
  };

  const proceed = () => {
    setLeaving(true);
    const flight = fly(
      step.options
        .filter((option) => selectedIds.includes(option.id))
        .map((option) => ({
          ref: { current: optionRefs.current.get(option.id) ?? null },
          label: option.label,
        })),
    );
    timers.current.push(setTimeout(goToNext, Math.max(0, flight - motion.duration.stageLeave / 2)));
  };

  return (
    <StageLayout
      title={step.title}
      eyebrow={step.eyebrow}
      chapter={step.chapter}
      subtitle={getQuestionHelper(step)}
      footer={
        <StageButton
          label="continue"
          disabled={!canProceed(step, answer) || leaving}
          onPress={proceed}
        />
      }
    >
      <StageChipRow>
        {step.options.map((option) => (
          <StageChip
            key={option.id}
            ref={(node) => {
              optionRefs.current.set(option.id, node);
            }}
            multi
            label={option.label}
            selected={selectedIds.includes(option.id)}
            disabled={leaving}
            onPress={() => toggle(option)}
          />
        ))}
      </StageChipRow>
    </StageLayout>
  );
}
