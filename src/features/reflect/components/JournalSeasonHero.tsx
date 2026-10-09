import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { spacing } from '@/design-system';
import {
  JOURNAL_HERO_BY_SEASON,
  JOURNAL_SITTING_MASCOT,
  JOURNAL_SITTING_MASCOT_ASPECT,
} from '@/features/reflect/data/journalSeasonArt';
import type { JourneySeason } from '@/features/journey/utils/getJourneySeason';

/** Mascot width as a fraction of the screen, on scenery strips. */
const MASCOT_WIDTH = 0.34;
/** Lift of the mascot from the strip bottom, so he sits on the painted ground. */
const MASCOT_LIFT = 0.1;

type JournalSeasonHeroProps = {
  season: JourneySeason;
  /** Height of the floating header; illustrated bands start below it. */
  headerHeight: number;
};

/** Seasonal art at the top of the journal. */
export function JournalSeasonHero({ season, headerHeight }: JournalSeasonHeroProps) {
  const { width } = useWindowDimensions();
  const art = JOURNAL_HERO_BY_SEASON[season];
  const height = width * (art.height / art.width);

  if (art.kind === 'illustration') {
    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={{ paddingTop: headerHeight }}
      >
        <Image source={art.source} style={{ width, height }} />
      </View>
    );
  }

  const mascotWidth = width * MASCOT_WIDTH;
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={{ width, height }}
    >
      <Image source={art.source} style={{ width, height }} />
      <Image
        source={JOURNAL_SITTING_MASCOT}
        style={[
          styles.mascot,
          {
            width: mascotWidth,
            height: mascotWidth / JOURNAL_SITTING_MASCOT_ASPECT,
            bottom: height * MASCOT_LIFT,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mascot: {
    position: 'absolute',
    right: spacing.lg,
  },
});
