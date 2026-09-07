import type { ImageSourcePropType } from 'react-native';

import type { OnboardingIllustrationKey } from '@/features/onboarding/types/onboarding';

export type OnboardingIllustrationMeta = {
  label: string;
  motif: 'rest' | 'carry' | 'detect' | 'path' | 'desk' | 'spark' | 'stack' | 'companion';
};

export const ONBOARDING_ILLUSTRATIONS: Record<
  OnboardingIllustrationKey,
  OnboardingIllustrationMeta
> = {
  welcome: { label: 'Mascot artwork goes here', motif: 'rest' },
  carrying: { label: 'Mascot carrying an oversized backpack', motif: 'carry' },
  detective: { label: 'Mascot as a detective with notes', motif: 'detect' },
  path: { label: 'Mascot walking a quiet path', motif: 'path' },
  self: { label: 'Mascot on a quiet path', motif: 'path' },
  buildingReset: { label: 'Mascot studying your answers', motif: 'desk' },
  gotYou: { label: 'Mascot looking up, quietly sure', motif: 'spark' },
  overloadedDreamer: { label: 'Mascot carrying too many things at once', motif: 'stack' },
  companion: { label: 'Gently Reset companion mascot', motif: 'companion' },
};

/**
 * Swap in real PNG/WebP files here. Leave a key omitted to keep the placeholder.
 * Example: welcome: require('../../../../assets/images/onboarding/welcome.png')
 */
export const ONBOARDING_ILLUSTRATION_SOURCES: Partial<
  Record<OnboardingIllustrationKey, ImageSourcePropType>
> = {};

export function getOnboardingIllustrationSource(key: OnboardingIllustrationKey) {
  return ONBOARDING_ILLUSTRATION_SOURCES[key];
}
