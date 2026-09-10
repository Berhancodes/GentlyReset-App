import { MascotScene } from '@/features/onboarding/components/MascotScene';
import {
  getOnboardingIllustrationSource,
  ONBOARDING_ILLUSTRATIONS,
  ONBOARDING_ILLUSTRATION_SOURCES,
} from '@/features/onboarding/data/onboardingAssets';
import type { OnboardingIllustrationKey } from '@/features/onboarding/types/onboarding';

const FALLBACK_ART = require('../../../../assets/images/mascot/mascot-thinking-world.png');

type IllustrationPlaceholderProps = {
  illustrationKey: OnboardingIllustrationKey;
  size?: 'default' | 'large';
};

export function IllustrationPlaceholder({
  illustrationKey,
  size = 'default',
}: IllustrationPlaceholderProps) {
  const meta = ONBOARDING_ILLUSTRATIONS[illustrationKey];
  const source = getOnboardingIllustrationSource(illustrationKey) ?? FALLBACK_ART;
  const aspectRatio =
    source === FALLBACK_ART && !ONBOARDING_ILLUSTRATION_SOURCES[illustrationKey]
      ? 1536 / 1024
      : meta.aspectRatio;

  return (
    <MascotScene
      source={source}
      aspectRatio={aspectRatio}
      size={size}
      accessibilityLabel={meta.label}
    />
  );
}
