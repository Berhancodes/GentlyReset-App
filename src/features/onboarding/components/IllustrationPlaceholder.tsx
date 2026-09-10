import { MascotScene } from '@/features/onboarding/components/MascotScene';
import {
  getOnboardingIllustrationSource,
  ONBOARDING_ILLUSTRATIONS,
} from '@/features/onboarding/data/onboardingAssets';
import type {
  OnboardingIllustrationKey,
  OnboardingIllustrationSize,
} from '@/features/onboarding/types/onboarding';

type IllustrationPlaceholderProps = {
  illustrationKey: OnboardingIllustrationKey;
  size?: OnboardingIllustrationSize;
};

export function IllustrationPlaceholder({
  illustrationKey,
  size = 'default',
}: IllustrationPlaceholderProps) {
  const source = getOnboardingIllustrationSource(illustrationKey);
  if (!source) {
    return null;
  }

  const meta = ONBOARDING_ILLUSTRATIONS[illustrationKey];

  return (
    <MascotScene
      source={source}
      aspectRatio={meta.aspectRatio}
      size={size}
      accessibilityLabel={meta.label}
    />
  );
}
