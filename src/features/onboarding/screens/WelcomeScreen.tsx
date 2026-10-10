import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  motion,
  radius,
  spacing,
  textVariants,
} from '@/design-system';
import {
  getWelcomeStageGeometry,
  WelcomeSackMascot,
  type WelcomeStageGeometry,
} from '@/features/onboarding/components/WelcomeSackMascot';
import { WelcomeWorryChip } from '@/features/onboarding/components/WelcomeWorryChip';
import { useOnboardingNavigation } from '@/features/onboarding/hooks/useOnboardingNavigation';
import { StageBackdrop } from '@/features/onboarding/stage/StageBackdrop';
import { StageButton } from '@/features/onboarding/stage/StageButton';
import { WELCOME_SACK_LAST_FRAME } from '@/features/onboarding/stage/welcomeSackFrames';
import type { WelcomeStep } from '@/features/onboarding/types/onboarding';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';

/** He arrives, then the first worry appears. */
const FIRST_WORRY_AT = motion.duration.welcomeWalk + motion.duration.stageFlightStagger * 2 - 50;
/** A worry lands just before its fall finishes, so he buckles as it drops in. */
const WORRY_LANDS_AFTER = motion.duration.welcomeWorryHold + motion.duration.welcomeWorryFall - 120;
const BUBBLE_GAP = 14;
const WORRY_TOP = 6;
const WORRY_STAGGER = 10;

type SpokenLine = { id: number; text: string };

type WelcomeScreenProps = {
  step: WelcomeStep;
};

/**
 * The opening screen. He walks in with a sack; each worry drops in and weighs
 * him down a frame, the last one makes him set it down, then the promise and
 * the button appear. Tapping the stage, Reduce Motion, or VoiceOver skips to the end.
 */
export function WelcomeScreen({ step }: WelcomeScreenProps) {
  const { router, goToNext } = useOnboardingNavigation();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const [geometry, setGeometry] = useState<WelcomeStageGeometry | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [buckleCount, setBuckleCount] = useState(0);
  const [line, setLine] = useState<SpokenLine | null>(null);
  const [falling, setFalling] = useState<readonly number[]>([]);
  const [headerShown, setHeaderShown] = useState(false);
  const [footerShown, setFooterShown] = useState(false);
  const [finished, setFinished] = useState(reduceMotion);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const worries = step.worries;
  const hasLayout = geometry !== null;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const finish = () => {
    clearTimers();
    setFinished(true);
    setFalling([]);
    setLine(null);
    setFrameIndex(WELCOME_SACK_LAST_FRAME);
    setHeaderShown(true);
    setFooterShown(true);
  };

  useEffect(() => {
    // react-native-web always reports a screen reader, so only trust this on device.
    if (Platform.OS === 'web') {
      return;
    }
    let active = true;
    void AccessibilityInfo.isScreenReaderEnabled().then((enabled) => {
      if (active && enabled) {
        finish();
      }
    });
    return () => {
      active = false;
    };
    // Runs once: VoiceOver users get the settled screen straight away.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasLayout || finished) {
      return;
    }
    const later = (delay: number, action: () => void) => {
      timers.current.push(setTimeout(action, delay));
    };
    const speak = (text: string | undefined) =>
      setLine((current) => (text ? { id: (current?.id ?? 0) + 1, text } : null));

    worries.forEach((worry, index) => {
      const appearsAt = FIRST_WORRY_AT + index * motion.duration.welcomeWorryEvery;
      later(appearsAt, () => {
        setFalling((current) => [...current, index]);
        speak(undefined);
      });
      later(appearsAt + WORRY_LANDS_AFTER, () => {
        setFrameIndex(Math.min(index, WELCOME_SACK_LAST_FRAME - 1));
        if (index < worries.length - 1) {
          setBuckleCount((count) => count + 1);
        }
        speak(worry.line);
      });
      later(appearsAt + motion.duration.welcomeWorryHold + motion.duration.welcomeWorryFall, () =>
        setFalling((current) => current.filter((falling) => falling !== index)),
      );
    });

    const lastLands =
      FIRST_WORRY_AT + (worries.length - 1) * motion.duration.welcomeWorryEvery + WORRY_LANDS_AFTER;
    later(lastLands + motion.duration.welcomeSettle, () => setFrameIndex(WELCOME_SACK_LAST_FRAME));
    later(lastLands + motion.duration.welcomeSettle + 400, () => setHeaderShown(true));
    later(lastLands + motion.duration.welcomeSettle + 800, () => setFooterShown(true));

    return clearTimers;
    // The timeline starts once, when the stage is first measured.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLayout, finished]);

  const title = capitalizeHeading(step.title);
  const subtitle = step.subtitle ? capitalizeHeading(step.subtitle) : null;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <StageBackdrop />
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + spacing.xl,
            paddingBottom: Math.max(insets.bottom, spacing.lg),
          },
        ]}
      >
        <FadeUp shown={headerShown} instant={finished}>
          <View
            accessible
            accessibilityRole="header"
            accessibilityLabel={[step.eyebrow, title, subtitle].filter(Boolean).join('. ')}
            style={styles.header}
          >
            {step.eyebrow ? (
              <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
                {step.eyebrow}
              </Text>
            ) : null}
            <Text style={styles.title} maxFontSizeMultiplier={1.25}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} maxFontSizeMultiplier={1.3}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </FadeUp>

        <Pressable
          accessible={false}
          disabled={finished}
          onPress={finish}
          style={styles.stage}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setGeometry(getWelcomeStageGeometry(width, height));
          }}
        >
          {geometry ? (
            <>
              <WelcomeSackMascot
                geometry={geometry}
                frameIndex={frameIndex}
                buckleCount={buckleCount}
                instant={finished}
              />
              {falling.map((index) => {
                const worry = worries[index];
                return worry ? (
                  <WelcomeWorryChip
                    key={index}
                    label={worry.label}
                    top={WORRY_TOP + (index % 2) * WORRY_STAGGER}
                    sway={(index % 2 ? 1 : -1) * motion.offset.welcomeWorrySway}
                    stageWidth={geometry.width}
                    target={geometry.sack}
                  />
                ) : null;
              })}
              {line ? (
                <Animated.View
                  key={line.id}
                  entering={ZoomIn.duration(motion.duration.bubble)}
                  pointerEvents="none"
                  style={[
                    styles.bubble,
                    {
                      bottom: geometry.floor + geometry.mascotHeight + BUBBLE_GAP,
                      marginLeft: (geometry.bodyX - geometry.width / 2) * 2,
                    },
                  ]}
                >
                  <Text style={styles.bubbleText} maxFontSizeMultiplier={1.2}>
                    {line.text}
                  </Text>
                  <View style={styles.bubbleTail} />
                </Animated.View>
              ) : null}
            </>
          ) : null}
        </Pressable>

        <FadeUp shown={footerShown} instant={finished}>
          <View style={styles.footer}>
            <StageButton label={step.ctaLabel} onPress={goToNext} />
            {step.signInPrompt && step.signInLabel ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${step.signInPrompt} ${step.signInLabel}`}
                onPress={() => router.push('/(auth)/sign-in')}
                style={styles.signInRow}
              >
                <Text maxFontSizeMultiplier={1.4} style={styles.signInPrompt}>
                  {step.signInPrompt}
                </Text>
                <Text maxFontSizeMultiplier={1.4} style={styles.signInLabel}>
                  {step.signInLabel}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </FadeUp>
      </View>
    </View>
  );
}

type FadeUpProps = {
  shown: boolean;
  instant: boolean;
  children: ReactNode;
};

/** Holds its space while hidden, then rises in. Hidden content can't be tapped or focused. */
function FadeUp({ shown, instant, children }: FadeUpProps) {
  const progress = useSharedValue(shown ? 1 : 0);

  useEffect(() => {
    const target = shown ? 1 : 0;
    progress.value = instant
      ? target
      : withTiming(target, { duration: motion.duration.welcomeReveal });
  }, [instant, progress, shown]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * motion.offset.question }],
  }));

  return (
    <Animated.View
      pointerEvents={shown ? 'auto' : 'none'}
      accessibilityElementsHidden={!shown}
      importantForAccessibility={shown ? 'auto' : 'no-hide-descendants'}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.stage.floor,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  eyebrow: {
    ...textVariants.stageEyebrow,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  title: {
    ...textVariants.stageTitle,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...textVariants.stageSubtitle,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  stage: {
    flex: 1,
    minHeight: spacing.xxxl * 3,
  },
  bubble: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.stage.bubbleBorder,
    backgroundColor: colors.stage.bubble,
    zIndex: 3,
  },
  bubbleText: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -7,
    width: 14,
    height: 14,
    backgroundColor: colors.stage.bubble,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.stage.bubbleBorder,
    transform: [{ rotate: '45deg' }],
  },
  footer: {
    gap: spacing.xs,
  },
  signInRow: {
    minHeight: spacing.hitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  signInPrompt: {
    ...textVariants.onboardingHelper,
    color: colors.stage.copySoft,
  },
  signInLabel: {
    ...textVariants.onboardingHelper,
    fontWeight: fontWeights.heavy,
    color: colors.stage.ctaLink,
  },
});
