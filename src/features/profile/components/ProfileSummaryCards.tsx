import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

type ProfileProgressCardProps = {
  day: number;
  checkIns: number;
  streak: number;
  onSeeAll: () => void;
};

/** Day, check-ins and streak at a glance, linking to the full stats page. */
export function ProfileProgressCard({ day, checkIns, streak, onSeeAll }: ProfileProgressCardProps) {
  return (
    <SummaryCard title="Your progress" action={{ label: 'See all', onPress: onSeeAll }}>
      <View style={styles.stats}>
        <Stat value={day} label="day" />
        <Stat value={checkIns} label={checkIns === 1 ? 'check-in' : 'check-ins'} />
        <Stat value={streak} label="day streak" />
      </View>
    </SummaryCard>
  );
}

type ProfileAnswersCardProps = {
  rows: readonly { label: string; value: string }[];
};

/** What you told us in onboarding: what you're working toward, your daily time, and why. */
export function ProfileAnswersCard({ rows }: ProfileAnswersCardProps) {
  return (
    <SummaryCard title="What you told us">
      {rows.map((row, index) => (
        <View
          key={row.label}
          accessible
          accessibilityLabel={`${row.label}: ${row.value}`}
          style={[styles.fact, index > 0 ? styles.divided : null]}
        >
          <Text style={styles.factLabel} maxFontSizeMultiplier={1.3}>
            {row.label}
          </Text>
          <Text style={styles.factValue} numberOfLines={3} maxFontSizeMultiplier={1.3}>
            {row.value}
          </Text>
        </View>
      ))}
    </SummaryCard>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${value} ${label}`}>
      <Text style={styles.statValue} maxFontSizeMultiplier={1.2}>
        {value}
      </Text>
      <Text style={styles.statLabel} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
    </View>
  );
}

type SummaryCardProps = {
  title: string;
  action?: { label: string; onPress: () => void };
  children: ReactNode;
};

/** A Profile card: heading with an optional action, then its rows. */
export function SummaryCard({ title, action, children }: SummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header" maxFontSizeMultiplier={1.3}>
          {title}
        </Text>
        {action ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${action.label}: ${title}`}
            onPress={action.onPress}
            hitSlop={spacing.xs}
            style={styles.action}
          >
            <Text style={styles.actionLabel} maxFontSizeMultiplier={1.3}>
              {action.label}
            </Text>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    paddingTop: spacing.xs,
    gap: spacing.xs,
    borderRadius: radius.card,
    backgroundColor: colors.stage.chip,
    shadowColor: colors.stage.chipShadow,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  header: {
    minHeight: spacing.hitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
  },
  action: {
    minHeight: spacing.hitTarget,
    justifyContent: 'center',
  },
  actionLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.heavy,
    color: colors.stage.ctaLink,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.stage.floor,
  },
  statValue: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    ...textVariants.stageSubtitle,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    color: colors.stage.copySoft,
  },
  fact: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  divided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.stage.chipBorder,
  },
  factLabel: {
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.stage.copySoft,
  },
  factValue: {
    flex: 1,
    fontFamily: fontFamilies.rounded,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.heavy,
    color: colors.text.primary,
    textAlign: 'right',
  },
});
