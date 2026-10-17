import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, fontSizes, fontWeights, radius, spacing } from '@/design-system';
import { HomeRoom } from '@/features/room/components/HomeRoom';
import {
  ROOM_ITEM_COUNT,
  ROOM_STAGES,
  SEASON_LENGTH_DAYS,
  SEASON_ROOM_ICONS,
  SEASON_ROOMS,
} from '@/features/room/data/roomStages';

export type SeasonTileStatus = 'current' | 'done' | 'next' | 'locked';

type SeasonRoomPreviewProps = {
  /** 0-based season. */
  seasonIndex: number;
  status: SeasonTileStatus;
  /** Check-ins in the season in progress. */
  checkIns: number;
};

const C = colors.room;
/** The finished room is drawn no wider than this, so the season grid stays in view. */
const MAX_ROOM_WIDTH = 190;
const FINISHED_STAGE_INDEX = ROOM_STAGES.length - 1;

function statusLine(seasonIndex: number, status: SeasonTileStatus, checkIns: number): string {
  switch (status) {
    case 'done':
      return 'You built this one. ✓';
    case 'current': {
      const left = Math.max(0, SEASON_LENGTH_DAYS - checkIns);
      return `${checkIns} of ${SEASON_LENGTH_DAYS} days in · ${left} to go until it looks like this.`;
    }
    case 'next':
      return 'Unlocked next. Pick your focus on Home to start it.';
    case 'locked':
      return `Unlocks after season ${seasonIndex}.`;
  }
}

/** What a season's room looks like on day 30, with where you are on the way to it. */
export function SeasonRoomPreview({ seasonIndex, status, checkIns }: SeasonRoomPreviewProps) {
  const [width, setWidth] = useState(0);
  const name = SEASON_ROOMS[seasonIndex] ?? '';
  const icon = SEASON_ROOM_ICONS[seasonIndex] ?? '';
  const roomWidth = Math.min(width, MAX_ROOM_WIDTH);

  return (
    <View
      style={styles.card}
      accessible
      accessibilityLabel={`Season ${seasonIndex + 1}, ${name}, as it looks when complete. ${statusLine(seasonIndex, status, checkIns)}`}
    >
      <View style={styles.captionRow}>
        <Text style={styles.kicker} maxFontSizeMultiplier={1.3}>
          {`SEASON ${seasonIndex + 1} · DAY 30 PREVIEW`}
        </Text>
      </View>
      <Text style={styles.name} maxFontSizeMultiplier={1.3}>
        {`${icon} ${name}`}
      </Text>
      <View
        style={styles.frame}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        importantForAccessibility="no-hide-descendants"
      >
        {roomWidth > 0 ? (
          <HomeRoom
            stageIndex={FINISHED_STAGE_INDEX}
            itemCount={ROOM_ITEM_COUNT}
            newestItem={null}
            width={roomWidth}
            seasonIndex={seasonIndex}
          />
        ) : null}
      </View>
      <Text style={styles.status} maxFontSizeMultiplier={1.3}>
        {statusLine(seasonIndex, status, checkIns)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xxs,
    padding: spacing.sm,
    borderRadius: radius.lg + 2,
    borderWidth: 2.5,
    borderColor: C.ink,
    backgroundColor: C.cream,
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kicker: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs - 2,
    fontWeight: fontWeights.heavy,
    letterSpacing: 1.2,
    color: C.kicker,
  },
  name: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.heavy,
    color: C.ink,
  },
  frame: {
    alignItems: 'center',
    marginTop: spacing.xxs,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  status: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs + 5,
    fontWeight: fontWeights.heavy,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
