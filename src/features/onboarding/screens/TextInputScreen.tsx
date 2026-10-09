import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/ui';
import { colors, radius, shadows, spacing, textVariants } from '@/design-system';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { OnboardingTextButton } from '@/features/onboarding/components/OnboardingTextButton';
import { JournalMascot } from '@/features/onboarding/components/JournalMascot';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { TextInputStep } from '@/features/onboarding/types/onboarding';
import { canProceed } from '@/features/onboarding/utils/canProceed';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';
import { getQuestionHelper } from '@/features/onboarding/utils/getQuestionHelper';

type TextInputScreenProps = {
  step: TextInputStep;
};

export function TextInputScreen({ step }: TextInputScreenProps) {
  const answer = useOnboardingStore((state) => state.answers[step.id]);
  const setAnswer = useOnboardingStore((state) => state.setAnswer);
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const value = answer?.type === 'textInput' ? answer.value : '';
  const isResetReasonStep = step.id === 'resetReason';

  const input = (
    <Pressable accessible={false} onPress={Keyboard.dismiss}>
      <View style={styles.inputWrap}>
        <TextInput
          accessibilityLabel={capitalizeHeading(step.title)}
          placeholder={step.placeholder}
          placeholderTextColor={colors.text.helper}
          value={value}
          maxLength={step.maxLength}
          multiline={step.multiline}
          textAlignVertical={step.multiline ? 'top' : 'center'}
          onChangeText={(nextValue) => {
            setAnswer(step.id, { type: 'textInput', value: nextValue });
          }}
          allowFontScaling
          maxFontSizeMultiplier={1.5}
          style={[styles.input, step.multiline ? styles.multiline : null]}
        />
      </View>
    </Pressable>
  );

  return (
    <OnboardingScreenLayout
      tone="question"
      compact
      scrollEnabled={false}
      title={step.title}
      subtitle={getQuestionHelper(step)}
      eyebrow={step.eyebrow}
      hideProgress={step.hideProgress}
      onBack={canGoBack ? goBack : undefined}
      avoidKeyboard
      footer={
        <View style={styles.footerStack}>
          {step.required ? null : (
            <OnboardingTextButton
              label="skip"
              onPress={() => {
                Keyboard.dismiss();
                goToNext();
              }}
            />
          )}
          <PrimaryButton
            label="next"
            disabled={!canProceed(step, answer)}
            onPress={() => {
              Keyboard.dismiss();
              goToNext();
            }}
          />
        </View>
      }
    >
      {isResetReasonStep ? (
        <View style={styles.resetReasonBlock}>
          {input}
          <JournalMascot />
        </View>
      ) : (
        input
      )}
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  footerStack: {
    gap: spacing.xs,
  },
  resetReasonBlock: {
    gap: spacing.sm,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  inputWrap: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.choice,
    ...shadows.soft,
  },
  input: {
    ...textVariants.body,
    minHeight: 56,
    borderRadius: radius.card,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  multiline: {
    minHeight: 140,
    paddingTop: spacing.md,
  },
});
