import { useEffect } from 'react';
import { Image, Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { JOURNEY_SPRITES } from '@/features/journey/data/journeyChapterImages';
import type { JourneySheetModel } from '@/features/journey/utils/getJourneySheetModel';

const SHEET_SPRING_MS = 280;
const DISMISS_DISTANCE = 120;

type JourneyDaySheetProps = {
  visible: boolean;
  model: JourneySheetModel | null;
  onClose: () => void;
  onPrimary: () => void;
};

export function JourneyDaySheet({ visible, model, onClose, onPrimary }: JourneyDaySheetProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const openOffset = useSharedValue(height);
  const dragOffset = useSharedValue(0);
  const backdrop = useSharedValue(0);

  useEffect(() => {
    const duration = reduceMotion ? 0 : SHEET_SPRING_MS;
    if (visible) {
      openOffset.value = withTiming(0, {
        duration,
        easing: Easing.out(Easing.cubic),
      });
      backdrop.value = withTiming(1, { duration });
      return;
    }
    openOffset.value = withTiming(height, {
      duration,
      easing: Easing.in(Easing.cubic),
    });
    backdrop.value = withTiming(0, { duration });
  }, [backdrop, height, openOffset, reduceMotion, visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: openOffset.value + dragOffset.value }],
  }));
  const dimStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value,
  }));

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      dragOffset.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      const shouldClose = event.translationY > DISMISS_DISTANCE || event.velocityY > 900;
      if (shouldClose) {
        dragOffset.value = 0;
        runOnJS(onClose)();
        return;
      }
      dragOffset.value = withTiming(0, {
        duration: reduceMotion ? 0 : 200,
        easing: Easing.out(Easing.cubic),
      });
    });

  if (!model) {
    return null;
  }

  const mascot =
    model.day === 30
      ? JOURNEY_SPRITES.mascotCelebrate
      : model.kind === 'current'
        ? JOURNEY_SPRITES.mascotWalk
        : JOURNEY_SPRITES.mascotIdle;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <View style={styles.root} pointerEvents="box-none">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss day details"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        >
          <Animated.View style={[styles.dim, dimStyle]} />
        </Pressable>
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.sheet,
              { paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.sm },
              sheetStyle,
            ]}
          >
            <View style={styles.handleWrap} accessibilityElementsHidden>
              <View style={styles.handle} />
            </View>
            <View
              style={styles.mascotWrap}
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              <Image
                source={mascot}
                resizeMode="contain"
                accessibilityElementsHidden
                importantForAccessibility="no"
                style={styles.mascot}
              />
            </View>
            <AppText variant="label" color="helper">
              {`day ${model.day}`}
            </AppText>
            {model.completeLabel ? (
              <AppText variant="optionTitle" color="gold">
                {model.completeLabel}
              </AppText>
            ) : model.kind === 'current' ? (
              <AppText variant="optionTitle">{`Day ${model.day} · you are here`}</AppText>
            ) : null}
            <AppText variant="title">{model.title}</AppText>
            <AppText variant="caption" color="secondary">
              {model.minutesLabel}
            </AppText>
            <AppText variant="body" color="secondary">
              {model.description}
            </AppText>
            {model.rememberLine ? (
              <View style={styles.remember}>
                <AppText variant="label" color="helper">
                  remember
                </AppText>
                <AppText variant="caption" color="secondary">
                  {model.rememberLine}
                </AppText>
              </View>
            ) : null}
            {model.footnote ? (
              <AppText variant="caption" color="helper">
                {model.footnote}
              </AppText>
            ) : null}
            <View style={styles.dots} accessibilityRole="none" accessibilityLabel="Week progress">
              {model.weekDots.map((dot) => (
                <View
                  key={dot.day}
                  accessibilityLabel={`Day ${dot.day} ${dot.kind}`}
                  style={[
                    styles.dot,
                    dot.kind === 'completed' ? styles.dotComplete : null,
                    dot.kind === 'current' ? styles.dotCurrent : null,
                    dot.kind === 'future' ? styles.dotFuture : null,
                    dot.day === model.day ? styles.dotSelected : null,
                  ]}
                />
              ))}
            </View>
            {model.cta !== 'none' && model.ctaLabel ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={model.ctaLabel}
                accessibilityHint={
                  model.cta === 'start'
                    ? 'Starts today’s reset and opens Home'
                    : 'Opens Home to continue today’s reset'
                }
                onPress={onPrimary}
                style={({ pressed }) => [styles.cta, pressed ? styles.ctaPressed : null]}
              >
                <AppText variant="button" color="primary" align="center">
                  {model.ctaLabel}
                </AppText>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={onClose}
                style={({ pressed }) => [styles.close, pressed ? styles.ctaPressed : null]}
              >
                <AppText variant="optionTitle" color="secondary" align="center">
                  close
                </AppText>
              </Pressable>
            )}
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay.scrim,
  },
  sheet: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    ...shadows.medium,
  },
  handleWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.border.default,
  },
  mascotWrap: {
    alignItems: 'center',
  },
  mascot: {
    width: 56,
    height: 56,
  },
  remember: {
    gap: spacing.xxs,
    paddingVertical: spacing.xs,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  dot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 2,
  },
  dotComplete: {
    backgroundColor: colors.accent.gold,
    borderColor: colors.accent.gold,
  },
  dotCurrent: {
    backgroundColor: colors.tint.gold,
    borderColor: colors.accent.gold,
  },
  dotFuture: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.border.subtle,
  },
  dotSelected: {
    transform: [{ scale: 1.15 }],
  },
  cta: {
    minHeight: spacing.hitTarget + spacing.xs,
    borderRadius: radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.action.saveBackground,
    paddingHorizontal: spacing.lg,
  },
  ctaPressed: {
    backgroundColor: colors.action.saveBackgroundPressed,
    transform: [{ scale: 0.98 }],
  },
  close: {
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
