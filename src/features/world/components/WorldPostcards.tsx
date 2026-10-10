import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  radius,
  spacing,
  textVariants,
} from '@/design-system';
import { friendDisplayLabel } from '@/features/friends/components/FriendIdentityRow';
import {
  ENCOURAGEMENT_COPY,
  encouragementTimeLabel,
  isEncouragementKind,
} from '@/features/friends/encouragements';
import type { ReceivedEncouragement } from '@/features/friends/types';
import { STAGE_POSE_ART } from '@/features/onboarding/stage/stagePoses';
import { capitalizeHeading } from '@/features/onboarding/utils/capitalizeHeading';

const STAMP = { width: 46, height: 54 } as const;
const STAMP_ART = STAGE_POSE_ART.cheer;
const CARD_MIN_HEIGHT = 124;
/** The card underneath peeks out, tilted. */
const UNDER_TILT = '3deg';

type WorldPostcardsProps = {
  items: readonly ReceivedEncouragement[];
  nowMs: number;
  /** Marks a postcard read once it has been seen. */
  onOpen: (item: ReceivedEncouragement) => void;
};

/**
 * Kind words from friends, as a little stack of postcards with his face on the
 * stamp. Tapping the top card marks it read and brings the next one forward.
 */
export function WorldPostcards({ items, nowMs, onOpen }: WorldPostcardsProps) {
  const [index, setIndex] = useState(0);
  const cards = items.filter((item) => isEncouragementKind(item.kind));
  if (cards.length === 0) {
    return null;
  }
  const top = cards[index % cards.length];
  if (!top) {
    return null;
  }
  const unread = cards.filter((item) => !item.readAt).length;

  return (
    <View style={styles.root} testID="received-encouragements">
      <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
        {unread > 0 ? `postcards for you · ${unread} new` : 'postcards for you'}
      </Text>
      <View style={styles.stack}>
        {cards.length > 1 ? <View style={[styles.card, styles.under]} /> : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Postcard from ${friendDisplayLabel(top.sender)}: ${postcardCopy(top)}. ${encouragementTimeLabel(top.createdAt, nowMs)}`}
          accessibilityHint={cards.length > 1 ? 'Shows the next postcard' : undefined}
          onPress={() => {
            onOpen(top);
            setIndex((current) => current + 1);
          }}
          style={styles.card}
        >
          <View style={styles.rule} pointerEvents="none" />
          <View style={styles.stamp} accessibilityElementsHidden>
            <Image
              source={STAMP_ART.source}
              resizeMode="contain"
              style={{ height: STAMP.height - spacing.xs, width: STAMP.width - spacing.xs }}
            />
          </View>
          <Text style={styles.message} maxFontSizeMultiplier={1.3}>
            {postcardCopy(top)}
          </Text>
          <View style={styles.footer}>
            {top.readAt ? null : <View style={styles.newDot} />}
            <Text style={styles.from} maxFontSizeMultiplier={1.3}>
              {`From ${friendDisplayLabel(top.sender)} · ${encouragementTimeLabel(top.createdAt, nowMs)}`}
            </Text>
          </View>
        </Pressable>
      </View>
      {cards.length > 1 ? (
        <Text style={styles.hint} maxFontSizeMultiplier={1.3}>
          {`Tap for the next one · ${(index % cards.length) + 1} of ${cards.length}`}
        </Text>
      ) : null}
    </View>
  );
}

function postcardCopy(item: ReceivedEncouragement): string {
  return isEncouragementKind(item.kind) ? capitalizeHeading(ENCOURAGEMENT_COPY[item.kind]) : '';
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.xs,
  },
  eyebrow: {
    ...textVariants.stageEyebrow,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  stack: {
    marginHorizontal: spacing.xs,
    marginBottom: spacing.xs,
  },
  card: {
    minHeight: CARD_MIN_HEIGHT,
    justifyContent: 'space-between',
    padding: spacing.md,
    paddingRight: STAMP.width + spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.stage.chip,
    borderWidth: 1.5,
    borderColor: colors.stage.chipBorder,
    shadowColor: colors.stage.chipShadow,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  under: {
    ...StyleSheet.absoluteFill,
    top: spacing.xs,
    left: spacing.xxs,
    right: -spacing.xxs,
    bottom: -spacing.xs,
    transform: [{ rotate: UNDER_TILT }],
    opacity: 0.85,
  },
  rule: {
    ...StyleSheet.absoluteFill,
    margin: spacing.xxs + 2,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.stage.postcardRule,
  },
  stamp: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: STAMP.width,
    height: STAMP.height,
    borderRadius: spacing.xxs + 1,
    backgroundColor: colors.stage.stamp,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs + 2,
  },
  newDot: {
    width: spacing.xs,
    height: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.gold,
  },
  from: {
    ...textVariants.stageSubtitle,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    color: colors.stage.copySoft,
  },
  hint: {
    ...textVariants.stageSubtitle,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
});
