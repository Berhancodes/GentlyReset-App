import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';

import { colors, fontFamilies, fontSizes, fontWeights, radius, spacing } from '@/design-system';
import { STAGE_POSE_ART } from '@/features/onboarding/stage/stagePoses';
import { FriendAvatar } from '@/features/friends/components/FriendAvatar';

const HEIGHT = 216;
const AVATAR = 44;
const MASCOT_HEIGHT = 120;
const SHADOW = { width: 104, height: 12 } as const;
/** Seats in a half circle around him, as offsets from his centre (x) and the top (y). */
const SEATS = [
  { x: -116, y: 74 },
  { x: -62, y: 18 },
  { x: 62, y: 18 },
  { x: 116, y: 74 },
] as const;
const MASCOT = STAGE_POSE_ART['react-warm'];

export type WorldCircleFriend = {
  id: string;
  letter: string;
  name: string;
  showedUpToday: boolean;
};

type WorldFriendCircleProps = {
  friends: readonly WorldCircleFriend[];
  onInvite: () => void;
};

/**
 * Him on the stage with up to four friends sitting around him. A gold ring
 * means they showed up today; an empty dashed seat invites someone new.
 */
export function WorldFriendCircle({ friends, onInvite }: WorldFriendCircleProps) {
  const seated = friends.slice(0, SEATS.length);
  const emptySeat = seated.length < SEATS.length ? SEATS[seated.length] : null;
  const mascotWidth = (MASCOT.width / MASCOT.height) * MASCOT_HEIGHT;

  return (
    <View style={styles.root}>
      <Svg
        width={SHADOW.width}
        height={SHADOW.height}
        style={[styles.shadow, { marginLeft: -SHADOW.width / 2 }]}
      >
        <Ellipse
          cx={SHADOW.width / 2}
          cy={SHADOW.height / 2}
          rx={SHADOW.width / 2}
          ry={SHADOW.height / 2}
          fill={colors.stage.mascotShadow}
        />
      </Svg>
      <Image
        source={MASCOT.source}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={[
          styles.mascot,
          {
            width: mascotWidth,
            height: MASCOT_HEIGHT,
            marginLeft: -mascotWidth / 2 - MASCOT.bodyOffset * (MASCOT_HEIGHT / MASCOT.height),
          },
        ]}
      />
      {seated.map((friend, index) => {
        const seat = SEATS[index];
        if (!seat) {
          return null;
        }
        return (
          <View
            key={friend.id}
            accessible
            accessibilityLabel={`${friend.name}, ${friend.showedUpToday ? 'showed up today' : 'taking today gently'}`}
            style={[styles.seat, { marginLeft: seat.x - AVATAR / 2, top: seat.y }]}
          >
            <FriendAvatar
              letter={friend.letter}
              tone={index}
              size={AVATAR}
              ringed={friend.showedUpToday}
            />
            <Text style={styles.name} numberOfLines={1} maxFontSizeMultiplier={1.2}>
              {friend.name}
            </Text>
          </View>
        );
      })}
      {emptySeat ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Invite a friend"
          onPress={onInvite}
          style={[styles.seat, { marginLeft: emptySeat.x - AVATAR / 2, top: emptySeat.y }]}
        >
          <View style={styles.emptySeat}>
            <Text style={styles.plus} maxFontSizeMultiplier={1.2}>
              +
            </Text>
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: HEIGHT,
    width: '100%',
  },
  shadow: {
    position: 'absolute',
    left: '50%',
    bottom: spacing.xxs,
  },
  mascot: {
    position: 'absolute',
    left: '50%',
    bottom: spacing.xs,
  },
  seat: {
    position: 'absolute',
    left: '50%',
    width: AVATAR,
    alignItems: 'center',
    gap: spacing.xxs,
    minHeight: spacing.hitTarget,
  },
  name: {
    width: AVATAR + spacing.lg,
    textAlign: 'center',
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.tab,
    fontWeight: fontWeights.bold,
    color: colors.stage.copySoft,
  },
  emptySeat: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.stage.ctaDisabled,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.heavy,
    color: colors.stage.copySoft,
  },
});
