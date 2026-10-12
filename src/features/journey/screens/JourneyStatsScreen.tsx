import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Screen } from '@/components/ui';
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
import {
  getJourneyCalendarMonth,
  getJourneyCheckInDates,
  getJourneyLongestStreak,
  getJourneySeasonWeeks,
  getJourneyStats,
  getJourneyStreakLine,
  type JourneyCalendarCell,
  type JourneySeasonWeek,
} from '@/features/journey/utils/getJourneyStats';
import { BackChevron } from '@/features/onboarding/components/BackChevron';
import { StageBackdrop } from '@/features/onboarding/stage/StageBackdrop';
import { STAGE_POSE_ART } from '@/features/onboarding/stage/stagePoses';
import { useResetStore } from '@/features/reset/store/useResetStore';
import { toLocalDateKey } from '@/features/reset/utils/calendar';

/** Seven dates to a row. */
const CALENDAR_COLUMNS = 7;
const BAR_MAX_HEIGHT = 80;
const BAR_MIN_HEIGHT = 6;
const MASCOT_HEIGHT = 76;
const MASCOT_POSE = STAGE_POSE_ART['react-hopeful'];

/** Your journey at a glance: a real calendar of check-ins, the season by week, and a nudge. */
export function JourneyStatsScreen() {
  const router = useRouter();
  const completedDays = useResetStore((state) => state.completedDays);
  const completionDates = useResetStore((state) => state.completionDates);
  const lastCompletedOn = useResetStore((state) => state.lastCompletedOn);
  const streak = useResetStore((state) => state.streak);
  const resetStartedOn = useResetStore((state) => state.resetStartedOn);
  const currentDay = useResetStore((state) => state.currentDay);
  const todayCompleted = useResetStore((state) => state.todayCompleted);
  const [monthOffset, setMonthOffset] = useState(0);
  // Whole-pixel columns: seven 1/7 percentages can round past the row and push Sunday off.
  const [calendarWidth, setCalendarWidth] = useState(0);
  const cellSize = Math.floor(calendarWidth / CALENDAR_COLUMNS);
  const gridStyle = cellSize > 0 ? { width: cellSize * CALENDAR_COLUMNS } : null;

  const input = {
    completedDays,
    completionDates,
    lastCompletedOn,
    streak,
    resetStartedOn,
    today: toLocalDateKey(new Date()),
  };
  const stats = getJourneyStats(input);
  const checkInDates = getJourneyCheckInDates(input);
  const month = getJourneyCalendarMonth(checkInDates, input.today, resetStartedOn, monthOffset);
  const monthDays = month.cells.filter(
    (cell): cell is Extract<JourneyCalendarCell, { kind: 'day' }> => cell.kind === 'day',
  );
  const weeks = getJourneySeasonWeeks(completedDays, currentDay);
  const streakLine = getJourneyStreakLine(stats.streak, getJourneyLongestStreak(checkInDates));

  return (
    <Screen backgroundColor={colors.stage.floor}>
      <StageBackdrop />
      <View style={styles.nav}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
              return;
            }
            router.replace('/(app)/(tabs)/journey');
          }}
          style={styles.navButton}
        >
          <View style={styles.backCircle}>
            <BackChevron />
          </View>
        </Pressable>
        <Text style={styles.eyebrow} accessibilityRole="header" maxFontSizeMultiplier={1.3}>
          your journey
        </Text>
        <View style={styles.navButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.title} maxFontSizeMultiplier={1.25}>
            Showing up, gently
          </Text>
          <Text style={styles.subtitle} maxFontSizeMultiplier={1.3}>
            The filled days are days you checked in.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <Stat value={`${stats.streak}`} label="day streak" />
          <Stat value={`${stats.checkIns}`} label="check-ins" />
          <Stat value={`${stats.consistency}`} unit="%" label="of days" />
        </View>

        <View style={styles.card}>
          <View style={styles.monthBar}>
            <MonthButton
              direction="back"
              disabled={!month.canGoBack}
              onPress={() => setMonthOffset((offset) => offset - 1)}
            />
            <Text style={styles.cardTitle} maxFontSizeMultiplier={1.3}>
              {month.title}
            </Text>
            <MonthButton
              direction="forward"
              disabled={!month.canGoForward}
              onPress={() => setMonthOffset((offset) => offset + 1)}
            />
          </View>
          <View
            style={styles.calendar}
            onLayout={(event) => setCalendarWidth(event.nativeEvent.layout.width)}
          >
            <View style={[styles.grid, gridStyle]}>
              {/* Just the month's dates, 1 to the last day; no empty boxes before the 1st. */}
              {monthDays.map((cell) => (
                <CalendarSquare
                  key={cell.dateKey}
                  cell={cell}
                  month={month.title}
                  size={cellSize}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle} maxFontSizeMultiplier={1.3}>
            This season, week by week
          </Text>
          <SeasonBars weeks={weeks} />
          <Text style={styles.cardNote} maxFontSizeMultiplier={1.3}>
            {getCurrentWeekNote(weeks, currentDay, todayCompleted)}
          </Text>
        </View>

        <View style={styles.cheer}>
          <Image
            source={MASCOT_POSE.source}
            resizeMode="contain"
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={{
              height: MASCOT_HEIGHT,
              width: (MASCOT_POSE.width / MASCOT_POSE.height) * MASCOT_HEIGHT,
            }}
          />
          <View style={styles.bubble}>
            <View style={styles.bubbleTail} />
            <Text style={styles.bubbleText} maxFontSizeMultiplier={1.3}>
              {streakLine}
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Stat({ value, unit, label }: { value: string; unit?: string; label: string }) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${value}${unit ?? ''} ${label}`}>
      <Text style={styles.statValue} maxFontSizeMultiplier={1.2}>
        {value}
        {unit ? <Text style={styles.statUnit}>{unit}</Text> : null}
      </Text>
      <Text style={styles.statLabel} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
    </View>
  );
}

type MonthButtonProps = {
  direction: 'back' | 'forward';
  disabled: boolean;
  onPress: () => void;
};

function MonthButton({ direction, disabled, onPress }: MonthButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={direction === 'back' ? 'Previous month' : 'Next month'}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={styles.navButton}
    >
      <View style={[styles.monthCircle, disabled ? styles.monthCircleDisabled : null]}>
        <View style={direction === 'forward' ? styles.flipped : null}>
          <BackChevron />
        </View>
      </View>
    </Pressable>
  );
}

const STATE_WORDS = {
  checkedIn: 'checked in',
  today: 'today',
  missed: 'no check-in',
  upcoming: 'coming up',
  beforeStart: 'before you started',
} as const;

function CalendarSquare({
  cell,
  month,
  size,
}: {
  cell: Extract<JourneyCalendarCell, { kind: 'day' }>;
  month: string;
  /** Exact column width in points; 0 until the calendar is measured. */
  size: number;
}) {
  const sizeStyle = size > 0 ? { width: size } : null;
  return (
    <View
      accessible
      accessibilityLabel={`${month} ${cell.date}, ${STATE_WORDS[cell.state]}`}
      style={[styles.square, sizeStyle]}
    >
      <View
        style={[
          styles.squareFill,
          cell.state === 'checkedIn' ? styles.squareCheckedIn : null,
          cell.state === 'today' ? styles.squareToday : null,
        ]}
      >
        <Text
          maxFontSizeMultiplier={1.2}
          style={[
            styles.squareDate,
            cell.state === 'checkedIn' ? styles.squareDateCheckedIn : null,
            cell.state === 'today' ? styles.squareDateToday : null,
            cell.state === 'missed' || cell.state === 'beforeStart' ? styles.squareDateFaint : null,
          ]}
        >
          {cell.date}
        </Text>
      </View>
    </View>
  );
}

function SeasonBars({ weeks }: { weeks: readonly JourneySeasonWeek[] }) {
  return (
    <View style={styles.bars}>
      {weeks.map((week) => (
        <View
          key={week.label}
          style={styles.barColumn}
          accessible
          accessibilityLabel={`${week.label}: ${week.checkIns} of ${week.days} days`}
        >
          <View
            style={[
              styles.bar,
              week.current ? styles.barCurrent : null,
              { height: Math.max(BAR_MIN_HEIGHT, (week.checkIns / 7) * BAR_MAX_HEIGHT) },
            ]}
          />
          <Text style={styles.barLabel} maxFontSizeMultiplier={1.2}>
            {week.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** "Week 2: 3 of the 4 days so far." for the week you're in. Today counts once it's done. */
function getCurrentWeekNote(
  weeks: readonly JourneySeasonWeek[],
  currentDay: number,
  todayCompleted: boolean,
): string {
  const index = weeks.findIndex((week) => week.current);
  const week = weeks[index];
  if (!week) {
    return 'Your first season, one week at a time.';
  }
  const daysSoFar = currentDay - index * 7 - (todayCompleted ? 0 : 1);
  return daysSoFar <= 0
    ? `${week.label} starts today.`
    : `${week.label}: ${week.checkIns} of the ${daysSoFar} ${daysSoFar === 1 ? 'day' : 'days'} so far.`;
}

const cardShadow = {
  shadowColor: colors.stage.chipShadow,
  shadowOpacity: 0.1,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
} as const;

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: spacing.hitTarget,
    height: spacing.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backCircle: {
    width: spacing.xl + 2,
    height: spacing.xl + 2,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.stage.chip,
    ...cardShadow,
  },
  eyebrow: {
    ...textVariants.stageEyebrow,
    color: colors.stage.copySoft,
  },
  content: {
    gap: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },
  intro: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  title: {
    ...textVariants.stageTitle,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...textVariants.stageSubtitle,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.stage.chip,
    ...cardShadow,
  },
  statValue: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  statUnit: {
    fontSize: fontSizes.md,
  },
  statLabel: {
    ...textVariants.stageSubtitle,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    color: colors.stage.copySoft,
  },
  card: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.stage.chip,
    ...cardShadow,
  },
  cardTitle: {
    ...textVariants.stageSubtitle,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
  },
  cardNote: {
    ...textVariants.stageSubtitle,
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: -spacing.xs,
    marginVertical: -spacing.xs,
  },
  monthCircle: {
    width: spacing.xl - 2,
    height: spacing.xl - 2,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.stage.sky,
  },
  monthCircleDisabled: {
    opacity: 0.35,
  },
  flipped: {
    transform: [{ scaleX: -1 }],
  },
  calendar: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  /** Full width until measured, then exactly seven whole columns, centred. */
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  square: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 2,
  },
  squareFill: {
    flex: 1,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareCheckedIn: {
    backgroundColor: colors.stage.cta,
  },
  squareToday: {
    backgroundColor: colors.stage.chipSelected,
    borderWidth: 2,
    borderColor: colors.accent.gold,
  },
  squareDate: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.stage.copySoft,
  },
  squareDateCheckedIn: {
    color: colors.text.inverse,
    fontWeight: fontWeights.heavy,
  },
  squareDateToday: {
    color: colors.text.primary,
    fontWeight: fontWeights.heavy,
  },
  squareDateFaint: {
    color: colors.stage.ctaDisabled,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    height: BAR_MAX_HEIGHT + spacing.lg,
  },
  barColumn: {
    flex: 1,
    alignItems: 'stretch',
    gap: spacing.xxs,
  },
  bar: {
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    borderBottomLeftRadius: spacing.xxs,
    borderBottomRightRadius: spacing.xxs,
    backgroundColor: colors.stage.barMuted,
  },
  barCurrent: {
    backgroundColor: colors.accent.gold,
  },
  barLabel: {
    ...textVariants.stageEyebrow,
    letterSpacing: 0,
    textTransform: 'none',
    color: colors.stage.copySoft,
    textAlign: 'center',
  },
  cheer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bubble: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.stage.bubbleBorder,
    backgroundColor: colors.stage.bubble,
  },
  bubbleTail: {
    position: 'absolute',
    left: -8,
    top: '50%',
    marginTop: -6,
    width: 12,
    height: 12,
    backgroundColor: colors.stage.bubble,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.stage.bubbleBorder,
    transform: [{ rotate: '45deg' }],
  },
  bubbleText: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
});
