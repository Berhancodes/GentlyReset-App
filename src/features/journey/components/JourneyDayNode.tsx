import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import type { JourneyLabelSide } from '@/features/journey/layout/journeyChapterLayouts';
import type { JourneyDayState } from '@/features/journey/utils/getJourneyDayState';
import { isJourneyDayVisuallyComplete } from '@/features/journey/utils/getJourneyDayState';

const NODE_SIZE = 22;
const CURRENT_NODE_SIZE = 28;

type JourneyDayNodeProps = {
  state: JourneyDayState;
  labelSide: JourneyLabelSide;
  currentTitle?: string;
  currentMinutesLabel?: string;
  onPress: () => void;
};

export function JourneyDayNode({
  state,
  labelSide,
  currentTitle,
  currentMinutesLabel,
  onPress,
}: JourneyDayNodeProps) {
  const complete = isJourneyDayVisuallyComplete(state);
  const current = state.kind === 'current';
  const future = state.kind === 'future';
  const size = current ? CURRENT_NODE_SIZE : NODE_SIZE;

  const accessibilityLabel = current
    ? `Day ${state.day}, ${currentTitle ?? ''}. You are here.`
    : complete
      ? `Day ${state.day} completed. ${currentTitle ?? ''}`
      : `Day ${state.day}. ${currentTitle ?? ''}. Preview only.`;

  return (
    <View style={styles.anchor} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ selected: current }}
        onPress={onPress}
        hitSlop={spacing.xs}
        style={({ pressed }) => [styles.hit, pressed ? styles.pressed : null]}
      >
        <View
          style={[
            styles.node,
            { width: size, height: size, borderRadius: size / 2 },
            complete ? styles.nodeComplete : null,
            current && !complete ? styles.nodeCurrent : null,
            future ? styles.nodeFuture : null,
          ]}
        >
          {complete ? (
            <AppText variant="caption" color="inverse" align="center">
              ✓
            </AppText>
          ) : current ? (
            <View style={styles.currentDot} />
          ) : null}
        </View>
      </Pressable>
      {current ? (
        <View
          style={[styles.currentCopy, labelSide === 'left' ? styles.copyLeft : styles.copyRight]}
          pointerEvents="none"
        >
          <AppText variant="optionTitle" color="primary">
            {`Day ${state.day} · you are here`}
          </AppText>
          {currentTitle ? (
            <AppText variant="caption" color="secondary">
              {currentTitle}
            </AppText>
          ) : null}
          {currentMinutesLabel ? (
            <AppText variant="label" color="helper">
              {currentMinutesLabel}
            </AppText>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    width: spacing.hitTarget,
    height: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hit: {
    minWidth: spacing.hitTarget,
    minHeight: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.82,
  },
  node: {
    borderWidth: 2,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.raised,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.whisper,
  },
  nodeComplete: {
    borderColor: colors.accent.gold,
    backgroundColor: colors.accent.gold,
  },
  nodeCurrent: {
    borderColor: colors.accent.gold,
    backgroundColor: colors.tint.gold,
    ...shadows.soft,
  },
  nodeFuture: {
    borderColor: colors.border.default,
    backgroundColor: colors.background.secondary,
    opacity: 1,
  },
  currentDot: {
    width: spacing.xs,
    height: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.gold,
  },
  currentCopy: {
    position: 'absolute',
    bottom: spacing.hitTarget,
    width: 148,
    gap: 2,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: radius.md,
    backgroundColor: colors.background.secondary,
    ...shadows.whisper,
  },
  copyLeft: {
    right: spacing.hitTarget - spacing.xs,
    alignItems: 'flex-end',
  },
  copyRight: {
    left: spacing.hitTarget - spacing.xs,
    alignItems: 'flex-start',
  },
});
