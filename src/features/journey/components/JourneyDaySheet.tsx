import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
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
import {
  getJourneySheetMascotPose,
  JourneyCurrentMascot,
} from '@/features/journey/components/JourneyCurrentMascot';
import type { JourneySheetModel } from '@/features/journey/utils/getJourneySheetModel';

const SHEET_SPRING_MS = 280;
const DISMISS_DISTANCE = 120;
const WEEK_DOT_SIZE = spacing.lg;

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

  const weekStart = model.weekDots[0]?.day ?? model.day;

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
            <View style={styles.headerRow}>
              <View style={styles.headerCopy}>
                <AppText variant="label" color="helper">
                  {`day ${model.day}`}
                </AppText>
                {model.completeLabel ? (
                  <AppText variant="optionTitle" color="gold">
                    {model.completeLabel}
                  </AppText>
                ) : null}
                <AppText variant="title">{model.title}</AppText>
                <View style={styles.minutesRow}>
                  <Ionicons name="time-outline" size={14} color={colors.text.helper} />
                  <AppText variant="caption" color="secondary">
                    {model.minutesLabel}
                  </AppText>
                </View>
              </View>
              <View
                style={styles.mascotWrap}
                accessibilityElementsHidden
                importantForAccessibility="no"
              >
                <JourneyCurrentMascot
                  pose={getJourneySheetMascotPose(model.day, model.kind)}
                  size="sheet"
                />
              </View>
            </View>
            <AppText variant="body" color="secondary">
              {model.description}
            </AppText>
            {model.rememberLine ? (
              <View style={styles.remember}>
                <View style={styles.rememberEyebrow}>
                  <Ionicons name="sparkles-outline" size={14} color={colors.accent.gold} />
                  <AppText variant="label" color="helper">
                    remember
                  </AppText>
                </View>
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
            {model.cta !== 'none' && model.ctaLabel ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={model.ctaLabel}
                accessibilityHint={
                  model.cta === 'start'
                    ? "Starts today's reset on Journey"
                    : "Marks today's reset complete on Journey"
                }
                onPress={onPrimary}
                style={({ pressed }) => [styles.cta, pressed ? styles.ctaPressed : null]}
              >
                <AppText variant="button" color="primary" align="center">
                  {model.ctaLabel}
                </AppText>
              </Pressable>
            ) : null}
            <View style={styles.progressBlock}>
              <AppText variant="label" color="helper">
                your progress
              </AppText>
              <View style={styles.dots} accessibilityRole="none" accessibilityLabel="Week progress">
                {model.weekDots.map((dot) => {
                  const weekNumber = dot.day - weekStart + 1;
                  return (
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
                    >
                      <AppText
                        variant="moodLabel"
                        color={
                          dot.kind === 'completed' || dot.kind === 'current' ? 'primary' : 'helper'
                        }
                        align="center"
                      >
                        {dot.kind === 'completed' ? '✓' : weekNumber}
                      </AppText>
                    </View>
                  );
                })}
              </View>
              {model.weekLabel ? (
                <AppText variant="caption" color="helper" align="center">
                  {model.weekLabel}
                </AppText>
              ) : null}
            </View>
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
    width: spacing.hitTarget,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.border.default,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  minutesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingTop: spacing.xxs,
  },
  mascotWrap: {
    width: spacing.xxxl + spacing.xs,
    height: spacing.xxxl + spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remember: {
    gap: spacing.xxs,
    paddingVertical: spacing.xs,
  },
  rememberEyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  progressBlock: {
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  dot: {
    width: WEEK_DOT_SIZE,
    height: WEEK_DOT_SIZE,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
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
    transform: [{ scale: 1.08 }],
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
    opacity: 0.86,
  },
  close: {
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
