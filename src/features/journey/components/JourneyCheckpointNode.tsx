import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, shadows, spacing } from '@/design-system';
import { JOURNEY_SPRITES } from '@/features/journey/data/journeyChapterImages';
import type { JourneyLabelSide } from '@/features/journey/layout/journeyChapterLayouts';
import type { JourneyDayState } from '@/features/journey/utils/getJourneyDayState';
import { isJourneyDayVisuallyComplete } from '@/features/journey/utils/getJourneyDayState';

const SIGN_WIDTH = 78;
const SIGN_HEIGHT = 70;

type JourneyCheckpointNodeProps = {
  state: JourneyDayState;
  title: string;
  labelSide: JourneyLabelSide;
  onPress: () => void;
};

export function JourneyCheckpointNode({
  state,
  title,
  labelSide,
  onPress,
}: JourneyCheckpointNodeProps) {
  const complete = isJourneyDayVisuallyComplete(state);
  const current = state.kind === 'current';
  const muted = state.kind === 'future';

  return (
    <View style={styles.anchor} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          current
            ? `Checkpoint day ${state.day}, ${title}. You are here.`
            : complete
              ? `Checkpoint day ${state.day} completed. ${title}`
              : `Checkpoint day ${state.day}. ${title}. Preview only.`
        }
        accessibilityState={{ selected: current }}
        onPress={onPress}
        style={({ pressed }) => [styles.hit, pressed ? styles.pressed : null]}
      >
        <View style={[styles.signWrap, muted ? styles.signMuted : null]}>
          <Image
            source={JOURNEY_SPRITES.checkpointSign}
            resizeMode="contain"
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={styles.sign}
          />
          <View style={styles.board} pointerEvents="none">
            <AppText variant="label" color="primary" align="center" numberOfLines={1}>
              {`day ${state.day}`}
            </AppText>
            <AppText variant="caption" color="secondary" align="center" numberOfLines={2}>
              {title}
            </AppText>
          </View>
          {complete ? (
            <View
              style={[styles.badge, labelSide === 'left' ? styles.badgeLeft : styles.badgeRight]}
            >
              <AppText variant="caption" color="inverse" align="center">
                ✓
              </AppText>
            </View>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    width: SIGN_WIDTH,
    height: SIGN_HEIGHT,
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
    opacity: 0.86,
  },
  signWrap: {
    width: SIGN_WIDTH,
    height: SIGN_HEIGHT,
    ...shadows.whisper,
  },
  signMuted: {
    opacity: 0.78,
  },
  sign: {
    width: SIGN_WIDTH,
    height: SIGN_HEIGHT,
  },
  board: {
    position: 'absolute',
    top: 6,
    left: 10,
    right: 10,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    width: spacing.md + spacing.xxs,
    height: spacing.md + spacing.xxs,
    borderRadius: spacing.md,
    backgroundColor: colors.accent.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLeft: {
    left: -2,
  },
  badgeRight: {
    right: -2,
  },
});
