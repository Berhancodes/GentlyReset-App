import { StyleSheet, TextInput } from 'react-native';

import { PrimaryButton } from '@/components/ui';
import { colors, radius, spacing, textVariants } from '@/design-system';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { TextInputStep } from '@/features/onboarding/types/onboarding';
import { canProceed } from '@/features/onboarding/utils/canProceed';

type TextInputScreenProps = {
  step: TextInputStep;
};

export function TextInputScreen({ step }: TextInputScreenProps) {
  const answer = useOnboardingStore((state) => state.answers[step.id]);
  const setAnswer = useOnboardingStore((state) => state.setAnswer);
  const { goToNext, goBack, canGoBack } = useOnboardingNavigation();
  const value = answer?.type === 'textInput' ? answer.value : '';

  return (
    <OnboardingScreenLayout
      title={step.title}
      subtitle={step.subtitle}
      onBack={canGoBack ? goBack : undefined}
      footer={
        <PrimaryButton label="continue" disabled={!canProceed(step, answer)} onPress={goToNext} />
      }
    >
      <TextInput
        accessibilityLabel={step.title}
        placeholder={step.placeholder}
        placeholderTextColor={colors.text.muted}
        value={value}
        maxLength={step.maxLength}
        onChangeText={(nextValue) => {
          setAnswer(step.id, { type: 'textInput', value: nextValue });
        }}
        allowFontScaling
        maxFontSizeMultiplier={1.5}
        style={styles.input}
      />
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  input: {
    ...textVariants.body,
    minHeight: 56,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.raised,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
