import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, Screen } from '@/components/ui';
import { colors, radius, shadows, spacing } from '@/design-system';
import { JOURNEY_SPRITES } from '@/features/journey/data/journeyChapterImages';
import {
  getJourneyCheckInDates,
  getJourneyHeatmap,
  getJourneyMilestoneTrack,
  getJourneyShowUpMessage,
  getJourneyStats,
  type JourneyHeatmapWeek,
  type JourneyMilestoneTrack,
} from '@/features/journey/utils/getJourneyStats';
import { BackChevron } from '@/features/onboarding/components/BackChevron';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { toLocalDateKey } from '@/features/reset/utils/calendar';

const CELL_SIZE = 15;
const CELL_GAP = 4;
const WEEKDAY_LABEL_WIDTH = 28;
/** Monday-first rows. */
const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;
const NODE_SIZE = 20;
const LINE_THICKNESS = 3;
/** Sitting mascot cut from the stats mockup (267 x 221). */
const SITTING_MASCOT = { width: 110, height: 91 } as const;

export function JourneyStatsScreen() {
  const router = useRouter();
  const completedDays = useResetStore((state) => state.completedDays);
  const completionDates = useResetStore((state) => state.completionDates);
  const lastCompletedOn = useResetStore((state) => state.lastCompletedOn);
  const streak = useResetStore((state) => state.streak);
  const resetStartedOn = useResetStore((state) => state.resetStartedOn);
  const [gridWidth, setGridWidth] = useState(0);

  const input = {
    completedDays,
    completionDates,
    lastCompletedOn,
    streak,
    resetStartedOn,
    today: toLocalDateKey(new Date()),
  };
  const stats = getJourneyStats(input);
  const weekCount = Math.max(
    1,
    Math.floor((gridWidth - WEEKDAY_LABEL_WIDTH + CELL_GAP) / (CELL_SIZE + CELL_GAP)),
  );
  const weeks =
    gridWidth > 0 ? getJourneyHeatmap(getJourneyCheckInDates(input), input.today, weekCount) : [];
  const message = getJourneyShowUpMessage(stats.checkIns);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="back"
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
              return;
            }
            router.replace('/(app)/(tabs)/journey');
          }}
          style={styles.back}
        >
          <BackChevron />
        </Pressable>
        <AppText variant="navTitle">your journey</AppText>
        <View style={styles.back} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <Stat value={`${stats.streak}`} label="Streak" />
          <Stat value={`${stats.consistency}`} unit="%" label="Consistency" />
          <Stat value={`${stats.checkIns}`} label="Check-ins" />
        </View>

        <View
          style={styles.card}
          onLayout={(event) => {
            const width = event.nativeEvent.layout.width - spacing.lg * 2;
            if (width !== gridWidth) {
              setGridWidth(width);
            }
          }}
        >
          <View style={styles.cardHeader}>
            <AppText variant="navTitle">Your days of showing up</AppText>
            <AppText variant="caption" color="secondary">
              Each square is a day you showed up.
            </AppText>
          </View>
          <Heatmap weeks={weeks} />
          <AppText variant="body" color="secondary">
            {`${stats.checkIns} ${stats.checkIns === 1 ? 'day' : 'days'} shown up.`}
          </AppText>
        </View>

        <View style={styles.progress}>
          <AppText variant="title">Your Progress</AppText>
          <MilestoneTrack track={getJourneyMilestoneTrack(stats.checkIns)} />
        </View>

        <View style={styles.cheer}>
          <Image
            source={JOURNEY_SPRITES.statsMascotSitting}
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={SITTING_MASCOT}
          />
          <View style={styles.bubble}>
            <AppText variant="optionTitle">{message.title}</AppText>
            <AppText variant="body" color="secondary">
              {message.body}
            </AppText>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

type StatProps = {
  value: string;
  unit?: string;
  label: string;
};

function Stat({ value, unit, label }: StatProps) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${label}: ${value}${unit ?? ''}`}>
      <View style={styles.statValue}>
        <AppText variant="journeyDay">{value}</AppText>
        {unit ? <AppText variant="title">{unit}</AppText> : null}
      </View>
      <AppText variant="body" color="secondary">
        {label}
      </AppText>
    </View>
  );
}

function Heatmap({ weeks }: { weeks: readonly JourneyHeatmapWeek[] }) {
  return (
    <View
      accessibilityLabel={`Check-in history for the last ${weeks.length} weeks`}
      style={styles.heatmap}
    >
      <View style={styles.monthRow}>
        <View style={styles.weekdayColumn} />
        {weeks.map((week, index) => (
          <View key={`month-${index}`} style={styles.monthSlot}>
            {week.monthLabel ? (
              <View style={styles.month}>
                <AppText variant="label" color="secondary" numberOfLines={1}>
                  {week.monthLabel}
                </AppText>
              </View>
            ) : null}
          </View>
        ))}
      </View>
      {WEEKDAY_LABELS.map((weekdayLabel, weekday) => (
        <View key={weekdayLabel} style={styles.row}>
          <View style={styles.weekdayColumn}>
            <AppText variant="label" color="secondary">
              {weekdayLabel}
            </AppText>
          </View>
          {weeks.map((week, index) => {
            const cell = week.cells[weekday];
            if (!cell || cell.kind === 'future') {
              return <View key={`cell-${index}`} style={styles.cellSlot} />;
            }
            return (
              <View
                key={cell.dateKey}
                accessibilityLabel={`${cell.dateKey} ${cell.checkedIn ? 'showed up' : 'no check-in'}`}
                style={[
                  styles.cellSlot,
                  styles.cell,
                  cell.checkedIn ? styles.cellCheckedIn : null,
                  cell.checkedIn && cell.isToday ? styles.cellToday : null,
                  !cell.checkedIn && cell.isToday ? styles.cellTodayOpen : null,
                ]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

/**
 * Three equal columns, each with its node centered over its label. The line
 * between two nodes is the right half of one column plus the left half of the
 * next, so a segment's fill is split across those two halves.
 */
function MilestoneTrack({ track }: { track: JourneyMilestoneTrack }) {
  const last = track.milestones.length - 1;

  return (
    <View style={styles.track}>
      {track.milestones.map((milestone, index) => {
        const incoming = index > 0 ? (track.segmentFill[index - 1] ?? 0) : null;
        const outgoing = index < last ? (track.segmentFill[index] ?? 0) : null;
        return (
          <View
            key={`${milestone.days}-${index}`}
            style={styles.trackColumn}
            accessible
            accessibilityLabel={`${milestone.days} ${milestone.days === 1 ? 'day' : 'days'}, ${milestone.label}${milestone.reached ? ', reached' : ''}`}
          >
            <View style={styles.nodeRow}>
              <LineHalf fill={incoming === null ? null : Math.max(0, incoming * 2 - 1)} />
              <View
                style={[styles.node, milestone.reached ? styles.nodeReached : styles.nodeOpen]}
              />
              <LineHalf fill={outgoing === null ? null : Math.min(1, outgoing * 2)} />
            </View>
            <AppText variant="optionTitle" align="center">
              {`${milestone.days} ${milestone.days === 1 ? 'day' : 'days'}`}
            </AppText>
            <AppText variant="label" color="secondary" align="center" numberOfLines={1}>
              {milestone.label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

/** One half of a connecting line; `null` leaves the space empty at the track ends. */
function LineHalf({ fill }: { fill: number | null }) {
  if (fill === null) {
    return <View style={styles.lineHalf} />;
  }
  return (
    <View style={[styles.lineHalf, styles.line]}>
      <View style={[styles.lineFill, { width: `${fill * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  back: {
    width: spacing.hitTarget,
    height: spacing.hitTarget,
    justifyContent: 'center',
  },
  content: {
    gap: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xxs,
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.journeyStats.card,
    ...shadows.soft,
  },
  cardHeader: {
    gap: spacing.xxs,
  },
  heatmap: {
    gap: CELL_GAP,
  },
  monthRow: {
    flexDirection: 'row',
    gap: CELL_GAP,
  },
  monthSlot: {
    width: CELL_SIZE,
    overflow: 'visible',
  },
  /** Month names are wider than one column; let them spill to the right. */
  month: {
    width: CELL_SIZE * 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CELL_GAP,
  },
  weekdayColumn: {
    width: WEEKDAY_LABEL_WIDTH - CELL_GAP,
  },
  cellSlot: {
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
  cell: {
    borderRadius: radius.sm / 2,
    backgroundColor: colors.journeyStats.cellEmpty,
  },
  cellCheckedIn: {
    backgroundColor: colors.journeyStats.cellCheckedIn,
  },
  cellToday: {
    backgroundColor: colors.journeyStats.cellToday,
  },
  cellTodayOpen: {
    borderWidth: 1.5,
    borderColor: colors.journeyStats.cellToday,
  },
  progress: {
    gap: spacing.lg,
  },
  track: {
    flexDirection: 'row',
  },
  trackColumn: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xxs,
  },
  nodeRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  lineHalf: {
    flex: 1,
    height: LINE_THICKNESS,
  },
  line: {
    backgroundColor: colors.journeyStats.trackLine,
    overflow: 'hidden',
  },
  lineFill: {
    height: '100%',
    backgroundColor: colors.journeyStats.trackFill,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: radius.pill,
  },
  nodeReached: {
    backgroundColor: colors.journeyStats.nodeReached,
  },
  nodeOpen: {
    borderWidth: 2,
    borderColor: colors.journeyStats.nodeRing,
    backgroundColor: colors.background.primary,
  },
  cheer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bubble: {
    flex: 1,
    gap: spacing.xxs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.xxl,
    backgroundColor: colors.journeyStats.bubble,
  },
});
