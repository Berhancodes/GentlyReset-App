import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { PrimaryButton } from '@/components/ui';
import {
  colors,
  MOTION_EASING_STANDARD,
  motion,
  radius,
  shadows,
  spacing,
  textVariants,
} from '@/design-system';
import { MascotSpeechBubble } from '@/features/onboarding/components/MascotSpeechBubble';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { MascotIntroStep, OnboardingAnswer } from '@/features/onboarding/types/onboarding';
import { hapticImpact } from '@/utils/haptics';

const MASCOT_RUN = require('../../../../assets/images/onboarding/mascot-run-intro.gif');
const MASCOT_RUN_FINAL = require('../../../../assets/images/onboarding/mascot-run-intro-final.png');

const LAST_FRAME_MS = 100;
const ASK_LINES = ['hey 👋', 'before we start, what should I call you?'] as const;

const bubbleEasing = Easing.bezier(
  MOTION_EASING_STANDARD[0],
  MOTION_EASING_STANDARD[1],
  MOTION_EASING_STANDARD[2],
  MOTION_EASING_STANDARD[3],
);

type IntroPhase = 'running' | 'asking' | 'responding';

type MascotRunIntroScreenProps = {
  step: MascotIntroStep;
};

function storedIntroName(answer: OnboardingAnswer | undefined): string {
  if (answer?.type !== 'mascotIntro') {
    return '';
  }
  return answer.name;
}

export function MascotRunIntroScreen({ step }: MascotRunIntroScreenProps) {
  const { goToNext } = useOnboardingNavigation();
  const goToNextRef = useRef(goToNext);
  const submittedRef = useRef(false);
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const storedAnswer = useOnboardingStore((state) => state.answers[step.id]);
  const setAnswer = useOnboardingStore((state) => state.setAnswer);
  const [showFinalFrame, setShowFinalFrame] = useState(false);
  const [phase, setPhase] = useState<IntroPhase>('running');
  const [name, setName] = useState(() => storedIntroName(storedAnswer));
  const [committedName, setCommittedName] = useState('');

  const bubbleOpacity = useSharedValue(0);
  const bubbleTranslateY = useSharedValue<number>(motion.offset.bubble);
  const bubbleScale = useSharedValue<number>(motion.scale.bubbleFrom);
  const askOpacity = useSharedValue(1);
  const replyOpacity = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue<number>(motion.offset.formExit);
  const mascotScale = useSharedValue(1);

  useEffect(() => {
    goToNextRef.current = goToNext;
  }, [goToNext]);

  useEffect(() => {
    const freezeAtMs = Math.max(0, step.durationMs - LAST_FRAME_MS);
    let holdTimeoutId: ReturnType<typeof setTimeout> | undefined;

    const freezeTimeoutId = setTimeout(() => {
      setShowFinalFrame(true);
    }, freezeAtMs);

    const hapticTimeoutId = setTimeout(() => {
      void hapticImpact();
      holdTimeoutId = setTimeout(() => {
        setPhase('asking');
      }, step.holdMs);
    }, step.durationMs);

    return () => {
      clearTimeout(freezeTimeoutId);
      clearTimeout(hapticTimeoutId);
      if (holdTimeoutId) {
        clearTimeout(holdTimeoutId);
      }
    };
  }, [step.durationMs, step.holdMs]);

  const trimmedName = name.trim();
  const canContinue = trimmedName.length > 0;
  const reply = committedName.length > 0 ? `nice to meet you, ${committedName} :)` : '';

  const handleContinue = useCallback(() => {
    if (submittedRef.current || trimmedName.length === 0) {
      return;
    }

    submittedRef.current = true;
    Keyboard.dismiss();
    setAnswer(step.id, { type: 'mascotIntro', name: trimmedName });
    setCommittedName(trimmedName);
    setPhase('responding');
  }, [setAnswer, step.id, trimmedName]);

  useEffect(() => {
    if (phase === 'asking') {
      if (reduceMotion) {
        bubbleOpacity.value = 1;
        bubbleTranslateY.value = 0;
        bubbleScale.value = 1;
        formOpacity.value = 1;
        formTranslateY.value = 0;
        return;
      }

      const timing = { duration: motion.duration.bubble, easing: bubbleEasing };
      bubbleOpacity.value = withTiming(1, timing);
      bubbleTranslateY.value = withTiming(0, timing);
      bubbleScale.value = withTiming(1, timing);
      formOpacity.value = withTiming(1, timing);
      formTranslateY.value = withTiming(0, timing);
      return;
    }

    if (phase !== 'responding') {
      return;
    }

    if (reduceMotion) {
      askOpacity.value = 0;
      replyOpacity.value = 1;
      formOpacity.value = 0;
    } else {
      const fade = { duration: motion.duration.bubbleText, easing: bubbleEasing };
      const exit = { duration: motion.duration.formExit, easing: bubbleEasing };
      askOpacity.value = withTiming(0, fade);
      replyOpacity.value = withTiming(1, fade);
      formOpacity.value = withTiming(0, exit);
      formTranslateY.value = withTiming(motion.offset.formExit, exit);
      mascotScale.value = withSequence(
        withTiming(motion.scale.mascotHello, {
          duration: motion.duration.mascotHello,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(1, {
          duration: motion.duration.bubbleText,
          easing: Easing.inOut(Easing.cubic),
        }),
      );
    }

    const advanceId = setTimeout(() => {
      goToNextRef.current();
    }, motion.duration.bubbleText + motion.duration.nameResponseHold);

    return () => {
      clearTimeout(advanceId);
    };
  }, [
    askOpacity,
    bubbleOpacity,
    bubbleScale,
    bubbleTranslateY,
    formOpacity,
    formTranslateY,
    mascotScale,
    phase,
    reduceMotion,
    replyOpacity,
  ]);

  const bubbleEntranceStyle = useAnimatedStyle(() => ({
    opacity: bubbleOpacity.value,
    transform: [{ translateY: bubbleTranslateY.value }, { scale: bubbleScale.value }],
  }));
  const askStyle = useAnimatedStyle(() => ({
    opacity: askOpacity.value,
  }));
  const replyStyle = useAnimatedStyle(() => ({
    opacity: replyOpacity.value,
  }));
  const formStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));
  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mascotScale.value }],
  }));

  const interactionVisible = phase !== 'running';

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.mascotStage, mascotStyle]}>
        <Image
          source={showFinalFrame ? MASCOT_RUN_FINAL : MASCOT_RUN}
          resizeMode="contain"
          fadeDuration={0}
          accessibilityIgnoresInvertColors
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={styles.art}
        />
      </Animated.View>

      <KeyboardAvoidingView
        pointerEvents={interactionVisible ? 'box-none' : 'none'}
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View
          pointerEvents={interactionVisible ? 'auto' : 'none'}
          style={[
            styles.bubbleWrap,
            { paddingTop: Math.max(insets.top, spacing.md) },
            bubbleEntranceStyle,
          ]}
        >
          {interactionVisible ? (
            <MascotSpeechBubble
              askLines={ASK_LINES}
              reply={reply}
              showingReply={phase === 'responding'}
              askStyle={askStyle}
              replyStyle={replyStyle}
            />
          ) : null}
        </Animated.View>

        <View pointerEvents="none" style={styles.flex} />

        <Animated.View
          pointerEvents={phase === 'asking' ? 'auto' : 'none'}
          style={[styles.form, { paddingBottom: Math.max(insets.bottom, spacing.lg) }, formStyle]}
        >
          <View style={styles.inputWrap}>
            <TextInput
              accessibilityLabel="your name"
              placeholder="your name"
              placeholderTextColor={colors.text.helper}
              value={name}
              maxLength={step.nameMaxLength}
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="name"
              textContentType="name"
              returnKeyType="done"
              enablesReturnKeyAutomatically
              underlineColorAndroid="transparent"
              onChangeText={(nextValue) => {
                setName(nextValue);
                setAnswer(step.id, { type: 'mascotIntro', name: nextValue });
              }}
              onSubmitEditing={handleContinue}
              allowFontScaling
              maxFontSizeMultiplier={1.4}
              style={styles.input}
            />
          </View>
          <PrimaryButton label="continue" disabled={!canContinue} onPress={handleContinue} />
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.background.primary,
  },
  mascotStage: {
    ...StyleSheet.absoluteFill,
  },
  art: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  flex: {
    flex: 1,
  },
  bubbleWrap: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  form: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  inputWrap: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.raised,
    ...shadows.whisper,
  },
  input: {
    ...textVariants.body,
    minHeight: 56,
    borderRadius: radius.pill,
    color: colors.text.primary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...(Platform.OS === 'web' ? ({ outlineWidth: 0 } as const) : null),
  },
});
