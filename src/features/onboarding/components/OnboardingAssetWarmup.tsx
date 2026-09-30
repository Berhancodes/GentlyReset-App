import { useEffect, useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import {
  collectOnboardingWarmupSources,
  getImageSourceKey,
  markOnboardingAssetLoaded,
  preloadOnboardingStepsFrom,
} from '@/features/onboarding/utils/preloadOnboardingAssets';

type OnboardingAssetWarmupProps = {
  currentStepIndex: number;
};

/**
 * Decodes the next screens' bundled images offstage so navigation can wait
 * until they are ready instead of hitching on first mount.
 */
export function OnboardingAssetWarmup({ currentStepIndex }: OnboardingAssetWarmupProps) {
  const sources = useMemo(
    () => collectOnboardingWarmupSources(currentStepIndex),
    [currentStepIndex],
  );

  useEffect(() => {
    void preloadOnboardingStepsFrom(currentStepIndex);
  }, [currentStepIndex]);

  if (sources.length === 0) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={styles.hidden}
    >
      {sources.map((source) => {
        const key = getImageSourceKey(source);
        if (key === null) {
          return null;
        }

        return (
          <Image
            key={String(key)}
            source={source}
            resizeMode="contain"
            fadeDuration={0}
            onLoadEnd={() => {
              markOnboardingAssetLoaded(source);
            }}
            style={styles.image}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    opacity: 0,
  },
  image: {
    width: 80,
    height: 80,
  },
});
