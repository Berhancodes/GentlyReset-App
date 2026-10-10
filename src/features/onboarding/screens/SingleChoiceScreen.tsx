import { useEffect, useRef, useState } from 'react';
import type { View } from 'react-native';

import { motion } from '@/design-system';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useStageFlight, useStageScene } from '@/features/onboarding/stage/stageHooks';
import {
  StageCardList,
  StageChip,
  StageChipRow,
  StageOptionCard,
} from '@/features/onboarding/stage/StageChoices';
import { StageButton } from '@/features/onboarding/stage/StageButton';
import { StageLayout } from '@/features/onboarding/stage/StageLayout';
import { StageSlider } from '@/features/onboarding/stage/StageSlider';
import { useStageStore } from '@/features/onboarding/stage/stageStore';
import { useIsOutgoingStage } from '@/features/onboarding/stage/StageTransition';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { OnboardingOption, SingleChoiceStep } from '@/features/onboarding/types/onboarding';
import { getQuestionHelper } from '@/features/onboarding/utils/getQuestionHelper';
import { hapticSelection } from '@/utils/haptics';

type SingleChoiceScreenProps = {
  step: SingleChoiceStep;
};

/**
 * One answer. Pills and cards move on by themselves after the mascot reacts;
 * the slider waits for "next" because people drag through several answers.
 */
export function SingleChoiceScreen({ step }: SingleChoiceScreenProps) {
  const answer = useOnboardingStore((state) => state.answers[step.id]);
  const setAnswer = useOnboardingStore((state) => state.setAnswer);
  const { goToNext } = useOnboardingNavigation();
  const show = useStageStore((state) => state.show);
  const fly = useStageFlight();
  const outgoing = useIsOutgoingStage();
  const [leaving, setLeaving] = useState(false);
  const optionRefs = useRef(new Map<string, View | null>());
  const sliderLabelRef = useRef<View>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedId = answer?.type === 'singleChoice' ? answer.optionId : undefined;
  const layout = step.layout === 'slider' || step.layout === 'cards' ? step.layout : 'chips';

  useStageScene(step.mascot?.pose ?? 'idle-listen', step.mascot?.line);

  useEffect(() => {
    if (layout !== 'slider' || selectedId || outgoing) {
      return;
    }
    const fallback =
      step.defaultOptionId ?? step.options[Math.floor((step.options.length - 1) / 2)]?.id;
    if (fallback) {
      setAnswer(step.id, { type: 'singleChoice', optionId: fallback });
    }
  }, [layout, outgoing, selectedId, setAnswer, step.defaultOptionId, step.id, step.options]);

  useEffect(
    () => () => {
      if (advanceTimer.current) {
        clearTimeout(advanceTimer.current);
      }
    },
    [],
  );

  const react = (option: OnboardingOption) => {
    if (option.reaction) {
      show(option.reaction.pose, option.reaction.line ?? null);
    }
  };

  const choose = (option: OnboardingOption) => {
    if (leaving) {
      return;
    }
    setLeaving(true);
    void hapticSelection();
    setAnswer(step.id, { type: 'singleChoice', optionId: option.id });
    react(option);
    fly([{ ref: { current: optionRefs.current.get(option.id) ?? null }, label: option.label }]);
    advanceTimer.current = setTimeout(goToNext, motion.duration.stageAutoAdvance);
  };

  if (layout === 'slider') {
    const selectedIndex = Math.max(
      0,
      step.options.findIndex((option) => option.id === selectedId),
    );
    return (
      <StageLayout
        title={step.title}
        eyebrow={step.eyebrow}
        chapter={step.chapter}
        subtitle={getQuestionHelper(step)}
        footer={
          <StageButton
            label="continue"
            disabled={!selectedId || leaving}
            onPress={() => {
              const option = step.options[selectedIndex];
              setLeaving(true);
              const flight = fly([{ ref: sliderLabelRef, label: option?.label ?? '' }]);
              advanceTimer.current = setTimeout(
                goToNext,
                Math.max(0, flight - motion.duration.stageLeave / 2),
              );
            }}
          />
        }
      >
        <StageSlider
          ref={sliderLabelRef}
          options={step.options}
          selectedIndex={selectedIndex}
          accessibilityLabel={step.title.replace(/\n/g, ' ')}
          onChange={(index) => {
            const option = step.options[index];
            if (!option) {
              return;
            }
            void hapticSelection();
            setAnswer(step.id, { type: 'singleChoice', optionId: option.id });
            react(option);
          }}
        />
      </StageLayout>
    );
  }

  return (
    <StageLayout
      title={step.title}
      eyebrow={step.eyebrow}
      chapter={step.chapter}
      subtitle={getQuestionHelper(step)}
    >
      {layout === 'cards' ? (
        <StageCardList>
          {step.options.map((option) => (
            <StageOptionCard
              key={option.id}
              ref={(node) => {
                optionRefs.current.set(option.id, node);
              }}
              label={option.label}
              description={option.description}
              selected={selectedId === option.id}
              disabled={leaving}
              onPress={() => choose(option)}
            />
          ))}
        </StageCardList>
      ) : (
        <StageChipRow>
          {step.options.map((option) => (
            <StageChip
              key={option.id}
              ref={(node) => {
                optionRefs.current.set(option.id, node);
              }}
              label={option.label}
              selected={selectedId === option.id}
              disabled={leaving}
              onPress={() => choose(option)}
            />
          ))}
        </StageChipRow>
      )}
    </StageLayout>
  );
}
