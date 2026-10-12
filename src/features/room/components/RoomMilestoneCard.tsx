import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOut, useReducedMotion } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { colors, fontFamilies, fontSizes, fontWeights, radius, spacing } from '@/design-system';
import type { RoomMilestone } from '@/features/room/data/roomStages';

type RoomMilestoneCardProps = {
  milestone: RoomMilestone;
  top: number;
  onDismiss: () => void;
};

const STAR_PATH =
  'M12 1.5C12.9 7.6 16.4 11.1 22.5 12 16.4 12.9 12.9 16.4 12 22.5 11.1 16.4 7.6 12.9 1.5 12 7.6 11.1 11.1 7.6 12 1.5Z';

/** The sticker card that drops in once when the room grows. Tap to put it away. */
export function RoomMilestoneCard({ milestone, top, onDismiss }: RoomMilestoneCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInUp.springify().damping(14)}
      exiting={reduceMotion ? undefined : FadeOut}
      style={[styles.wrap, { top }]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${milestone.kicker}. ${milestone.text}`}
        accessibilityHint="Dismisses this message"
        onPress={onDismiss}
        style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
      >
        <View style={styles.badge}>
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Path
              d={STAR_PATH}
              fill={colors.room.gold}
              stroke={colors.room.ink}
              strokeWidth={1.2}
            />
          </Svg>
        </View>
        <View style={styles.copy}>
          <Text style={styles.kicker} maxFontSizeMultiplier={1.3}>
            {milestone.kicker}
          </Text>
          <Text style={styles.text} maxFontSizeMultiplier={1.3}>
            {milestone.text}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.lg - 2,
    right: spacing.lg - 2,
    zIndex: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 3,
    borderColor: colors.room.ink,
    backgroundColor: colors.room.cream,
    shadowColor: colors.room.milestoneShadow,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  badge: {
    width: spacing.hitTarget,
    height: spacing.hitTarget,
    borderRadius: radius.pill,
    borderWidth: 2.5,
    borderColor: colors.room.ink,
    backgroundColor: colors.room.butter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 1,
  },
  kicker: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs - 1,
    fontWeight: fontWeights.heavy,
    letterSpacing: 1.2,
    color: colors.room.kicker,
  },
  text: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md - 1,
    fontWeight: fontWeights.heavy,
    color: colors.room.ink,
  },
});
