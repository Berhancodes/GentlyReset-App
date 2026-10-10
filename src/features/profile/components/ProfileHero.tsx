import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppText, ProgressBar } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import { PLAN_DAY_COUNT } from '@/features/reset/data/thirtyDayPlan';

/** Autumn scene with the mascot, cut from the "you" mockup (572 x 174). */
const YOU_HERO = require('../../../../assets/profile/you-hero-autumn.png');
const HERO_ASPECT_RATIO = 572 / 174;
/** Same cap as the profile column. */
const HERO_MAX_WIDTH = 430;

type ProfileHeroProps = {
  name: string;
  shortSummary: string;
  currentDay: number;
  progress: number;
};

export function ProfileHero({ name, shortSummary, currentDay, progress }: ProfileHeroProps) {
  const safeDay = Math.min(PLAN_DAY_COUNT, Math.max(1, currentDay));
  const { width: windowWidth } = useWindowDimensions();
  // Full screen width so the hills reach both edges, past the column padding.
  const heroWidth = Math.min(windowWidth, HERO_MAX_WIDTH);

  return (
    <View style={styles.root}>
      <Image
        source={YOU_HERO}
        accessibilityLabel={`${name} artwork`}
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        style={[styles.hero, { width: heroWidth, height: heroWidth / HERO_ASPECT_RATIO }]}
      />
      <AppText variant="profileName" align="center">
        {name}
      </AppText>
      <View style={styles.progressBlock}>
        <AppText variant="label" color="helper" align="center">
          {`DAY ${safeDay} · FIRST SEASON`}
        </AppText>
        <ProgressBar
          progress={progress}
          accessibilityLabel="First season progress"
          fillColor={colors.progress.fillGold}
          trackColor={colors.progress.trackStrong}
          thickness={spacing.xs}
        />
      </View>
      <AppText variant="body" color="secondary" align="center">
        {toSentenceCase(shortSummary)}
      </AppText>
    </View>
  );
}

/** Capitalizes the first letter of each sentence; profile copy is stored lowercase. */
function toSentenceCase(text: string): string {
  return text.replace(/(^|[.!?]\s+)([a-z])/g, (_, lead: string, letter: string) => {
    return `${lead}${letter.toUpperCase()}`;
  });
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  hero: {
    marginBottom: spacing.xs,
  },
  progressBlock: {
    width: '62%',
    gap: spacing.xs,
    alignItems: 'stretch',
  },
});
