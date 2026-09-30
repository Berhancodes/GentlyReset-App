import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
  type KeyboardEvent,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { PrimaryButton } from '@/components/ui';
import {
  colors,
  MOTION_EASING_STANDARD,
  motion,
  radius,
  spacing,
  textVariants,
} from '@/design-system';
import { MascotSpeechBubble } from '@/features/onboarding/components/MascotSpeechBubble';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import type { MascotIntroStep, OnboardingAnswer } from '@/features/onboarding/types/onboarding';
import {
  getMascotIntroKeyboardLift,
  getMascotIntroLayout,
  MASCOT_INTRO_LAYOUT,
} from '@/features/onboarding/utils/mascotIntroLayout';
import { hapticImpact } from '@/utils/haptics';

const MASCOT_RUN = require('../../../../assets/images/onboarding/mascot-run-intro.gif');
const MASCOT_RUN_FINAL = require('../../../../assets/images/onboarding/mascot-run-intro-final.png');

const LAST_FRAME_MS = 100;
const ASK_GREETING = 'hey 👋';
const ASK_QUESTION = 'before we start, what should I call you?';

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
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const storedAnswer = useOnboardingStore((state) => state.answers[step.id]);
  const setAnswer = useOnboardingStore((state) => state.setAnswer);
  const [showFinalFrame, setShowFinalFrame] = useState(false);
  const [phase, setPhase] = useState<IntroPhase>('running');
  const [name, setName] = useState(() => storedIntroName(storedAnswer));
  const [committedName, setCommittedName] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const layout = getMascotIntroLayout(width, height, insets);
  const layoutRef = useRef(layout);

  const mascotTranslateX = useSharedValue(0);
  const mascotTranslateY = useSharedValue(0);
  const mascotSettleScale = useSharedValue(1);
  const mascotHelloScale = useSharedValue(1);
  const keyboardScale = useSharedValue(1);
  const keyboardLift = useSharedValue(0);
  const bubbleOpacity = useSharedValue(0);
  const bubbleTranslateY = useSharedValue<number>(motion.offset.bubble);
  const bubbleScale = useSharedValue<number>(motion.scale.bubbleFrom);
  const askOpacity = useSharedValue(1);
  const questionOpacity = useSharedValue(0);
  const replyOpacity = useSharedValue(0);
  const inputOpacity = useSharedValue(0);
  const inputTranslateY = useSharedValue<number>(motion.offset.inputReveal);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue<number>(motion.offset.buttonReveal);

  useEffect(() => {
    goToNextRef.current = goToNext;
  }, [goToNext]);

  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

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

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (event: KeyboardEvent) => {
      setKeyboardHeight(event.endCoordinates.height);
    };
    const onHide = () => {
      setKeyboardHeight(0);
    };

    const showSubscription = Keyboard.addListener(showEvent, onShow);
    const hideSubscription = Keyboard.addListener(hideEvent, onHide);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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
    if (phase === 'running') {
      return;
    }

    const currentLayout = layoutRef.current;
    const settleTiming = { duration: motion.duration.mascotSettle, easing: bubbleEasing };
    const bubbleTiming = { duration: motion.duration.bubble, easing: bubbleEasing };
    const inputTiming = { duration: motion.duration.inputReveal, easing: bubbleEasing };
    const buttonTiming = { duration: motion.duration.buttonReveal, easing: bubbleEasing };

    if (phase === 'asking') {
      if (reduceMotion) {
        mascotTranslateX.value = currentLayout.settleX;
        mascotTranslateY.value = currentLayout.settleY;
        mascotSettleScale.value = currentLayout.settleScale;
        bubbleOpacity.value = 1;
        bubbleTranslateY.value = 0;
        bubbleScale.value = 1;
        questionOpacity.value = 1;
        inputOpacity.value = 1;
        inputTranslateY.value = 0;
        buttonOpacity.value = 1;
        buttonTranslateY.value = 0;
        return;
      }

      mascotTranslateX.value = withTiming(currentLayout.settleX, settleTiming);
      mascotTranslateY.value = withTiming(currentLayout.settleY, settleTiming);
      mascotSettleScale.value = withTiming(currentLayout.settleScale, settleTiming);
      bubbleOpacity.value = withDelay(motion.delay.bubbleReveal, withTiming(1, bubbleTiming));
      bubbleTranslateY.value = withDelay(motion.delay.bubbleReveal, withTiming(0, bubbleTiming));
      bubbleScale.value = withDelay(motion.delay.bubbleReveal, withTiming(1, bubbleTiming));
      questionOpacity.value = withDelay(
        motion.delay.bubbleQuestion,
        withTiming(1, { duration: motion.duration.bubbleText, easing: bubbleEasing }),
      );
      inputOpacity.value = withDelay(motion.delay.inputReveal, withTiming(1, inputTiming));
      inputTranslateY.value = withDelay(motion.delay.inputReveal, withTiming(0, inputTiming));
      buttonOpacity.value = withDelay(motion.delay.buttonReveal, withTiming(1, buttonTiming));
      buttonTranslateY.value = withDelay(motion.delay.buttonReveal, withTiming(0, buttonTiming));
      return;
    }

    if (reduceMotion) {
      askOpacity.value = 0;
      questionOpacity.value = 0;
      replyOpacity.value = 1;
      inputOpacity.value = 0;
      buttonOpacity.value = 0;
    } else {
      const fade = { duration: motion.duration.bubbleText, easing: bubbleEasing };
      const exit = { duration: motion.duration.formExit, easing: bubbleEasing };
      askOpacity.value = withTiming(0, fade);
      questionOpacity.value = withTiming(0, fade);
      replyOpacity.value = withTiming(1, fade);
      inputOpacity.value = withTiming(0, exit);
      inputTranslateY.value = withTiming(motion.offset.formExit, exit);
      buttonOpacity.value = withTiming(0, exit);
      buttonTranslateY.value = withTiming(motion.offset.formExit, exit);
      mascotHelloScale.value = withSequence(
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
    buttonOpacity,
    buttonTranslateY,
    inputOpacity,
    inputTranslateY,
    mascotHelloScale,
    mascotSettleScale,
    mascotTranslateX,
    mascotTranslateY,
    phase,
    questionOpacity,
    reduceMotion,
    replyOpacity,
  ]);

  useEffect(() => {
    if (phase === 'running') {
      return;
    }

    const currentLayout = layoutRef.current;
    const lift = getMascotIntroKeyboardLift(currentLayout, height, keyboardHeight);
    const extraShrink = keyboardHeight > 0 && height < 720 ? 0.05 : 0;
    const timing = { duration: motion.duration.screen, easing: bubbleEasing };
    const nextKeyboardScale = 1 - extraShrink;

    if (reduceMotion) {
      keyboardLift.value = lift;
      keyboardScale.value = nextKeyboardScale;
      return;
    }

    keyboardLift.value = withTiming(lift, timing);
    keyboardScale.value = withTiming(nextKeyboardScale, timing);
  }, [height, keyboardHeight, keyboardLift, keyboardScale, phase, reduceMotion]);

  const compositionStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboardLift.value }],
  }));
  const mascotStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: mascotTranslateX.value },
      { translateY: mascotTranslateY.value },
      { scale: mascotSettleScale.value * mascotHelloScale.value * keyboardScale.value },
    ],
  }));
  const bubbleEntranceStyle = useAnimatedStyle(() => ({
    opacity: bubbleOpacity.value,
    transform: [{ translateY: bubbleTranslateY.value }, { scale: bubbleScale.value }],
  }));
  const askStyle = useAnimatedStyle(() => ({
    opacity: askOpacity.value,
  }));
  const questionStyle = useAnimatedStyle(() => ({
    opacity: questionOpacity.value,
  }));
  const replyStyle = useAnimatedStyle(() => ({
    opacity: replyOpacity.value,
  }));
  const inputStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
    transform: [{ translateY: inputTranslateY.value }],
  }));
  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  const interactionVisible = phase !== 'running';

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <Animated.View pointerEvents="box-none" style={[styles.composition, compositionStyle]}>
        <Animated.View pointerEvents="none" style={[styles.mascotStage, mascotStyle]}>
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

        {interactionVisible ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.bubbleAnchor,
              {
                left: layout.bubbleLeft,
                bottom: layout.bubbleBottom,
                maxWidth: layout.bubbleMaxWidth,
              },
              bubbleEntranceStyle,
            ]}
          >
            <MascotSpeechBubble
              askGreeting={ASK_GREETING}
              askQuestion={ASK_QUESTION}
              reply={reply}
              showingReply={phase === 'responding'}
              greetingStyle={askStyle}
              questionStyle={questionStyle}
              replyStyle={replyStyle}
            />
          </Animated.View>
        ) : null}

        {interactionVisible ? (
          <Animated.View
            pointerEvents={phase === 'asking' ? 'auto' : 'none'}
            style={[
              styles.fieldAnchor,
              {
                top: layout.formTop,
                left: layout.formLeft,
                width: layout.formWidth,
                height: layout.fieldHeight,
              },
              inputStyle,
            ]}
          >
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
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onChangeText={(nextValue) => {
                setName(nextValue);
                setAnswer(step.id, { type: 'mascotIntro', name: nextValue });
              }}
              onSubmitEditing={handleContinue}
              allowFontScaling
              maxFontSizeMultiplier={1.4}
              style={[styles.input, inputFocused ? styles.inputFocused : null]}
            />
          </Animated.View>
        ) : null}

        {interactionVisible ? (
          <Animated.View
            pointerEvents={phase === 'asking' ? 'auto' : 'none'}
            style={[
              styles.buttonAnchor,
              {
                top: layout.buttonTop,
                left: layout.formLeft,
                width: layout.formWidth,
              },
              buttonStyle,
            ]}
          >
            <PrimaryButton label="continue" disabled={!canContinue} onPress={handleContinue} />
          </Animated.View>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.background.primary,
  },
  composition: {
    flex: 1,
  },
  mascotStage: {
    ...StyleSheet.absoluteFill,
  },
  art: {
    width: '100%',
    height: '100%',
  },
  bubbleAnchor: {
    position: 'absolute',
  },
  fieldAnchor: {
    position: 'absolute',
  },
  buttonAnchor: {
    position: 'absolute',
  },
  input: {
    ...textVariants.body,
    height: MASCOT_INTRO_LAYOUT.fieldHeight,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.primary,
    color: colors.text.primary,
    textAlign: 'left',
    paddingHorizontal: spacing.md + spacing.xxs,
    paddingVertical: spacing.sm,
    ...(Platform.OS === 'web' ? ({ outlineWidth: 0 } as const) : null),
  },
  inputFocused: {
    borderColor: colors.border.gold,
    backgroundColor: colors.surface.selected,
  },
});
