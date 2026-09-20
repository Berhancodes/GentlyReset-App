import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, shadows, spacing } from '@/design-system';
import type { JourneyDayState } from '@/features/journey/utils/getJourneyDayState';
import { isJourneyDayVisuallyComplete } from '@/features/journey/utils/getJourneyDayState';

type JourneyDayNodeProps = {
  state: JourneyDayState;
  size: number;
  onPress: () => void;
};

export function JourneyDayNode({ state, size, onPress }: JourneyDayNodeProps) {
  const complete = isJourneyDayVisuallyComplete(state);
  const current = state.kind === 'current';
  const future = state.kind === 'future';

  const accessibilityLabel = current
    ? `Day ${state.day}. You are here.`
    : complete
      ? `Day ${state.day} completed.`
      : `Day ${state.day}. Preview only.`;

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
          ) : null}
        </View>
      </Pressable>
      <AppText
        variant={current ? 'moodLabelSelected' : 'moodLabel'}
        color={current ? 'primary' : 'helper'}
        align="center"
        numberOfLines={1}
      >
        {`day ${state.day}`}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing.xxs,
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
    borderColor: colors.text.primary,
    backgroundColor: colors.accent.gold,
  },
  nodeCurrent: {
    borderColor: colors.text.primary,
    backgroundColor: colors.accent.gold,
    ...shadows.soft,
  },
  nodeFuture: {
    borderColor: colors.border.default,
    backgroundColor: colors.surface.raised,
  },
});
