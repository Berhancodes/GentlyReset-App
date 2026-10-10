import { useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';

import { colors, motion, radius, shadows, spacing, textVariants } from '@/design-system';
import { OnboardingTextButton } from '@/features/onboarding/components/OnboardingTextButton';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useStageScene } from '@/features/onboarding/stage/stageHooks';
import { StageButton } from '@/features/onboarding/stage/StageButton';
import { StageLayout } from '@/features/onboarding/stage/StageLayout';
import { useStageStore } from '@/features/onboarding/stage/stageStore';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { TextInputStep } from '@/features/onboarding/types/onboarding';
import { canProceed } from '@/features/onboarding/utils/canProceed';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';
import { getQuestionHelper } from '@/features/onboarding/utils/getQuestionHelper';

type TextInputScreenProps = {
  step: TextInputStep;
};

/** A written answer. With a submit reaction, he tucks it away before moving on. */
export function TextInputScreen({ step }: TextInputScreenProps) {
  const answer = useOnboardingStore((state) => state.answers[step.id]);
  const setAnswer = useOnboardingStore((state) => state.setAnswer);
  const { goToNext } = useOnboardingNavigation();
  const show = useStageStore((state) => state.show);
  const [leaving, setLeaving] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const value = answer?.type === 'textInput' ? answer.value : '';

  useStageScene(step.mascot?.pose ?? 'idle-listen', step.mascot?.line);

  useEffect(
    () => () => {
      if (advanceTimer.current) {
        clearTimeout(advanceTimer.current);
      }
    },
    [],
  );

  const submit = () => {
    Keyboard.dismiss();
    if (!step.submitReaction) {
      goToNext();
      return;
    }
    setLeaving(true);
    show(step.submitReaction.pose, step.submitReaction.line ?? null);
    advanceTimer.current = setTimeout(goToNext, motion.duration.stageNoteTuck);
  };

  return (
    <StageLayout
      title={step.title}
      eyebrow={step.eyebrow}
      chapter={step.chapter}
      subtitle={getQuestionHelper(step)}
      avoidKeyboard
      footer={
        <>
          {step.required ? null : (
            <OnboardingTextButton
              label="skip"
              onPress={() => {
                Keyboard.dismiss();
                goToNext();
              }}
            />
          )}
          <StageButton
            label="continue"
            disabled={!canProceed(step, answer) || leaving}
            onPress={submit}
          />
        </>
      }
    >
      <View style={styles.field}>
        <TextInput
          accessibilityLabel={capitalizeHeading(step.title)}
          placeholder={step.placeholder}
          placeholderTextColor={colors.text.helper}
          value={value}
          editable={!leaving}
          maxLength={step.maxLength}
          multiline={step.multiline}
          // Return closes the keyboard instead of adding a new line.
          returnKeyType="done"
          submitBehavior="blurAndSubmit"
          textAlignVertical={step.multiline ? 'top' : 'center'}
          onChangeText={(nextValue) => {
            setAnswer(step.id, { type: 'textInput', value: nextValue });
          }}
          allowFontScaling
          maxFontSizeMultiplier={1.5}
          style={[styles.input, step.multiline ? styles.multiline : null]}
        />
      </View>
    </StageLayout>
  );
}

const styles = StyleSheet.create({
  field: {
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderColor: colors.stage.chipBorder,
    backgroundColor: colors.stage.chip,
    ...shadows.soft,
  },
  input: {
    ...textVariants.body,
    minHeight: spacing.xxl + spacing.xs,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  multiline: {
    minHeight: spacing.xxxl + spacing.lg,
    paddingTop: spacing.sm,
  },
});
