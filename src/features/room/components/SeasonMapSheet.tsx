import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors, fontFamilies, fontSizes, fontWeights, radius, spacing } from '@/design-system';
import { SEASON_LENGTH_DAYS, SEASON_ROOMS } from '@/features/room/data/roomStages';
import type { RoomState } from '@/features/room/utils/getRoomState';

type SeasonMapSheetProps = {
  visible: boolean;
  room: RoomState;
  /** The season in progress, 1-based. */
  seasonNumber: number;
  onClose: () => void;
};

const STAR_PATH =
  'M12 1.5C12.9 7.6 16.4 11.1 22.5 12 16.4 12.9 12.9 16.4 12 22.5 11.1 16.4 7.6 12.9 1.5 12 7.6 11.1 11.1 7.6 12 1.5Z';
const C = colors.room;

type TileStatus = 'current' | 'done' | 'next' | 'locked';

function tileStatus(index: number, seasonNumber: number, seasonComplete: boolean): TileStatus {
  const currentIndex = (seasonNumber - 1) % SEASON_ROOMS.length;
  if (index < currentIndex) {
    return 'done';
  }
  if (index === currentIndex) {
    return seasonComplete ? 'done' : 'current';
  }
  if (index === currentIndex + 1 && seasonComplete) {
    return 'next';
  }
  return 'locked';
}

/** Twelve seasons, each a room; together they make the year's home. */
export function SeasonMapSheet({ visible, room, seasonNumber, onClose }: SeasonMapSheetProps) {
  const insets = useSafeAreaInsets();
  const progress = room.checkIns / SEASON_LENGTH_DAYS;
  const footer = room.seasonComplete
    ? `Season ${seasonNumber} is done! Choose your next focus on Home to start season ${seasonNumber + 1}.`
    : `You’re building season ${seasonNumber}: ${room.checkIns} of ${SEASON_LENGTH_DAYS} days. After season 12: year one complete, and your home keeps growing.`;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close your year"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.grabber} />
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <View style={styles.headerCopy}>
                <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
                  YOUR YEAR · 12 SEASONS
                </Text>
                <Text style={styles.title} accessibilityRole="header" maxFontSizeMultiplier={1.3}>
                  Each season builds a room. A year builds a home.
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={onClose}
                hitSlop={spacing.xs}
                style={styles.close}
              >
                <Svg width={16} height={16} viewBox="0 0 24 24">
                  <Path
                    d="M6 6l12 12M18 6L6 18"
                    stroke={C.ink}
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                </Svg>
              </Pressable>
            </View>

            <View style={styles.house}>
              <Svg width="100%" height={70} viewBox="0 0 354 70" preserveAspectRatio="none">
                <Path
                  d="M8 68 L177 6 L346 68 Z"
                  fill={C.blush}
                  stroke={C.ink}
                  strokeWidth={3}
                  strokeLinejoin="round"
                />
                <Rect
                  x={260}
                  y={20}
                  width={26}
                  height={34}
                  rx={4}
                  fill={C.cream}
                  stroke={C.ink}
                  strokeWidth={3}
                />
                <Circle cx={177} cy={44} r={12} fill={C.butter} stroke={C.ink} strokeWidth={2.5} />
              </Svg>
              <View style={styles.rooms}>
                {SEASON_ROOMS.map((name, index) => {
                  const status = tileStatus(index, seasonNumber, room.seasonComplete);
                  const locked = status === 'locked';
                  return (
                    <View
                      key={name}
                      accessible
                      accessibilityLabel={`Season ${index + 1}, ${name}, ${status === 'current' ? `in progress, ${room.checkIns} of ${SEASON_LENGTH_DAYS} days` : status === 'done' ? 'complete' : status === 'next' ? 'unlocked next' : 'locked'}`}
                      style={[
                        styles.tile,
                        status === 'current' ? styles.tileCurrent : null,
                        status === 'done' ? styles.tileDone : null,
                        status === 'next' ? styles.tileNext : null,
                        locked ? styles.tileLocked : null,
                      ]}
                    >
                      <Text
                        style={[styles.tileKicker, locked ? styles.lockedText : null]}
                        maxFontSizeMultiplier={1.2}
                      >
                        SEASON {index + 1}
                      </Text>
                      <Text
                        style={[styles.tileName, locked ? styles.lockedText : null]}
                        maxFontSizeMultiplier={1.2}
                      >
                        {name}
                      </Text>
                      {status === 'current' ? (
                        <View style={styles.track}>
                          <View
                            style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]}
                          />
                        </View>
                      ) : null}
                      {status === 'done' ? (
                        <Text style={styles.tileStatus} maxFontSizeMultiplier={1.2}>
                          complete ✓
                        </Text>
                      ) : null}
                      {status === 'next' ? (
                        <Text
                          style={[styles.tileStatus, styles.nextText]}
                          maxFontSizeMultiplier={1.2}
                        >
                          unlocked next
                        </Text>
                      ) : null}
                      {locked ? (
                        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                          <Rect
                            x={5}
                            y={11}
                            width={14}
                            height={10}
                            rx={2}
                            stroke={C.locked}
                            strokeWidth={2.4}
                          />
                          <Path
                            d="M8 11V8a4 4 0 0 1 8 0v3"
                            stroke={C.locked}
                            strokeWidth={2.4}
                            strokeLinecap="round"
                          />
                        </Svg>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.footer}>
              <Svg width={24} height={24} viewBox="0 0 24 24">
                <Path d={STAR_PATH} fill={C.gold} stroke={C.ink} strokeWidth={1.2} />
              </Svg>
              <Text style={styles.footerText} maxFontSizeMultiplier={1.3}>
                {footer}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay.scrim,
  },
  sheet: {
    maxHeight: '86%',
    paddingTop: spacing.sm,
    borderTopLeftRadius: radius.xxl + 2,
    borderTopRightRadius: radius.xxl + 2,
    borderTopWidth: 3,
    borderColor: C.ink,
    backgroundColor: colors.background.home,
  },
  grabber: {
    alignSelf: 'center',
    width: spacing.hitTarget,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: C.lockedBorder,
  },
  content: {
    paddingHorizontal: spacing.md + 2,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  eyebrow: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs - 1,
    fontWeight: fontWeights.heavy,
    letterSpacing: 1.4,
    color: C.kicker,
  },
  title: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.lg + 2,
    lineHeight: fontSizes.lg + 7,
    fontWeight: fontWeights.heavy,
    color: C.ink,
  },
  close: {
    width: spacing.hitTarget,
    height: spacing.hitTarget,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: C.ink,
    backgroundColor: C.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  house: {
    alignItems: 'stretch',
  },
  rooms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs - 1,
    padding: spacing.xs,
    borderWidth: 3,
    borderTopWidth: 0,
    borderColor: C.ink,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    backgroundColor: C.wall,
  },
  tile: {
    width: '31.6%',
    minHeight: 82,
    paddingVertical: spacing.xs - 1,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    justifyContent: 'space-between',
    gap: spacing.xxs,
  },
  tileCurrent: {
    borderWidth: 2.5,
    borderColor: C.ink,
    backgroundColor: C.peach,
  },
  tileDone: {
    borderWidth: 2.5,
    borderColor: C.ink,
    backgroundColor: C.butter,
  },
  tileNext: {
    borderWidth: 2.5,
    borderColor: C.ink,
    backgroundColor: C.cream,
  },
  tileLocked: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: C.lockedBorder,
    backgroundColor: C.cream,
  },
  tileKicker: {
    fontFamily: fontFamilies.rounded,
    fontSize: 10,
    fontWeight: fontWeights.heavy,
    letterSpacing: 0.8,
    color: C.cocoa,
  },
  tileName: {
    fontFamily: fontFamilies.rounded,
    fontSize: 12,
    lineHeight: 14,
    fontWeight: fontWeights.heavy,
    color: C.ink,
  },
  lockedText: {
    color: C.locked,
  },
  tileStatus: {
    fontFamily: fontFamilies.rounded,
    fontSize: 11,
    fontWeight: fontWeights.heavy,
    color: C.cocoa,
  },
  nextText: {
    color: C.kicker,
  },
  track: {
    height: 6,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: C.ink,
    backgroundColor: C.cream,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: C.gold,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm - 2,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md - 2,
    borderRadius: radius.lg + 2,
    borderWidth: 2,
    borderColor: colors.border.default,
    backgroundColor: C.cream,
  },
  footerText: {
    flex: 1,
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs + 5,
    fontWeight: fontWeights.heavy,
    color: colors.text.secondary,
  },
});
