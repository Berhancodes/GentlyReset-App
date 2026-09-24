import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AppText, PrimaryButton } from '@/components/ui';
import { motion, spacing } from '@/design-system';
import { BreathingMascot } from '@/features/onboarding/components/BreathingMascot';
import { CompanionMascot } from '@/features/onboarding/components/CompanionMascot';
import { NoticingMascot } from '@/features/onboarding/components/NoticingMascot';
import { OnboardingScreenLayout } from '@/features/onboarding/components/OnboardingScreenLayout';
import { PlanPreviewList } from '@/features/onboarding/components/PlanPreviewList';
import { StoryCopy, type StoryCopyLine } from '@/features/onboarding/components/StoryCopy';
import {
  getOnboardingStepIndex,
  PLAN_READY_COPY,
  PLAN_READY_PREVIEW,
} from '@/features/onboarding/data/onboardingSteps';
import { useBoundAutoAdvance } from '@/features/onboarding/hooks/useBoundAutoAdvance';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { StoryStep } from '@/features/onboarding/types/onboarding';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';
import {
  deriveCarryingSubtitle,
  deriveConsistencyInsight,
} from '@/features/onboarding/utils/deriveIntermissionInsight';

type StoryScreenProps = {
  step: StoryStep;
};

type CompanionCopyPhase = 'writing' | 'erasing' | 'ready';

export function StoryScreen({ step }: StoryScreenProps) {
  const { goToNext, goToIndex, goBack, canGoBack } = useOnboardingNavigation();
  const answers = useOnboardingStore((state) => state.answers);
  const reduceMotion = useReducedMotion();
  const [copyPhase, setCopyPhase] = useState<CompanionCopyPhase>('writing');
  const [readyCopyDone, setReadyCopyDone] = useState(false);
  const [storyCopyDone, setStoryCopyDone] = useState(false);
  const companionFinished = useRef(false);

  const subtitle =
    step.dynamicCopy === 'outOfBalance'
      ? deriveCarryingSubtitle(answers)
      : step.dynamicCopy === 'consistencyStage'
        ? deriveConsistencyInsight(answers)
        : step.subtitle;

  const lines = useMemo(() => {
    const nextLines: StoryCopyLine[] = [];

    if (step.eyebrow) {
      nextLines.push({
        id: 'eyebrow',
        text: step.eyebrow,
        variant: 'storyEyebrow',
        color: 'helper',
      });
    }

    nextLines.push({
      id: 'title',
      text: capitalizeHeading(step.title),
      variant: 'storyTitle',
      color: 'primary',
    });

    if (subtitle) {
      nextLines.push({
        id: 'subtitle',
        text: subtitle,
        variant: 'storySupporting',
        color: 'primary',
      });
    }

    if (step.body) {
      nextLines.push({
        id: 'body',
        text: step.body,
        variant: 'storySupporting',
        color: 'helper',
      });
    }

    return nextLines;
  }, [step.body, step.eyebrow, step.title, subtitle]);

  const readyLines = useMemo<StoryCopyLine[]>(
    () => [
      {
        id: 'ready-eyebrow',
        text: PLAN_READY_COPY.eyebrow,
        variant: 'onboardingHelper',
        color: 'helper',
      },
      {
        id: 'ready-title',
        text: PLAN_READY_COPY.title,
        variant: 'storyTitle',
        color: 'primary',
      },
      {
        id: 'ready-supporting',
        text: PLAN_READY_COPY.supporting,
        variant: 'storyTitle',
        color: 'primary',
      },
      {
        id: 'ready-subtitle',
        text: PLAN_READY_COPY.subtitle,
        variant: 'storySupporting',
        color: 'helper',
      },
    ],
    [],
  );

  const showBreathingScene = step.scene === 'breathing';
  const showNoticingScene = step.scene === 'noticing';
  const showCompanionScene = step.scene === 'companion';
  const hideStillIllustration = showBreathingScene || showNoticingScene || showCompanionScene;
  const companionOpacity = useSharedValue(1);

  const handleCompanionFinished = useCallback(() => {
    if (companionFinished.current) {
      return;
    }
    companionFinished.current = true;
    if (reduceMotion) {
      setCopyPhase('ready');
      return;
    }
    setCopyPhase('erasing');
  }, [reduceMotion]);
  const handleReadyFinished = useCallback(() => {
    setReadyCopyDone(true);
  }, []);
  const handleStoryFinished = useCallback(() => {
    setStoryCopyDone(true);
  }, []);
  const handleAutoAdvance = useCallback(() => {
    goToIndex(getOnboardingStepIndex('resetReveal'));
  }, [goToIndex]);

  useBoundAutoAdvance(step.id, Boolean(step.autoAdvance && storyCopyDone), handleAutoAdvance);

  useEffect(() => {
    if (copyPhase !== 'erasing') {
      return;
    }

    companionOpacity.value = withTiming(0, {
      duration: motion.typewriter.eraseMs,
      easing: Easing.out(Easing.cubic),
    });
    const timeoutId = setTimeout(() => {
      setCopyPhase('ready');
    }, motion.typewriter.eraseMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [companionOpacity, copyPhase]);

  const companionFadeStyle = useAnimatedStyle(() => ({
    opacity: companionOpacity.value,
  }));

  return (
    <OnboardingScreenLayout
      tone="story"
      title={step.title}
      showTitle={false}
      illustrationKey={hideStillIllustration ? undefined : step.illustrationKey}
      illustrationSize={step.illustrationSize ?? 'large'}
      illustrationPlacement="end"
      skipStorySpacer={showCompanionScene}
      hideProgress
      onBack={canGoBack ? goBack : undefined}
      footer={
        step.autoAdvance || !step.ctaLabel ? undefined : (
          <PrimaryButton label={step.ctaLabel} onPress={goToNext} />
        )
      }
    >
      {showCompanionScene ? (
        <View style={styles.copySlot}>
          <View accessibilityElementsHidden importantForAccessibility="no" style={styles.copySizer}>
            {readyLines.map((line) => (
              <AppText key={line.id} variant={line.variant} color={line.color}>
                {line.text}
              </AppText>
            ))}
          </View>
          <Animated.View
            pointerEvents={copyPhase === 'ready' ? 'none' : 'auto'}
            style={[styles.copyLayer, companionFadeStyle]}
          >
            <StoryCopy lines={lines} onFinished={handleCompanionFinished} />
          </Animated.View>
          {copyPhase === 'ready' ? (
            <View style={styles.copyLayer}>
              <StoryCopy lines={readyLines} onFinished={handleReadyFinished} />
            </View>
          ) : null}
        </View>
      ) : (
        <StoryCopy lines={lines} onFinished={step.autoAdvance ? handleStoryFinished : undefined} />
      )}
      {showBreathingScene ? <BreathingMascot /> : null}
      {showNoticingScene ? <NoticingMascot /> : null}
      {showCompanionScene ? (
        <View style={styles.companionStage}>
          <CompanionMascot />
          <PlanPreviewList items={PLAN_READY_PREVIEW} revealed={readyCopyDone} />
        </View>
      ) : null}
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  copySlot: {
    position: 'relative',
    width: '100%',
  },
  copySizer: {
    gap: spacing.md,
    opacity: 0,
  },
  copyLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
  companionStage: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: spacing.lg,
    width: '100%',
    paddingTop: spacing.sm,
  },
});
