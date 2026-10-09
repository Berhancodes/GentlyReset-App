import type { ImageSourcePropType } from 'react-native';

import type { JourneySeason } from '@/features/journey/utils/getJourneySeason';

/**
 * Top-of-journal art per season.
 * - `scenery`: a strip of the Journey season painting that runs behind the
 *   header and fades into the page; the sitting mascot is placed on top.
 * - `illustration`: a finished band (scene and reading mascot) that sits
 *   below the header, cut from the season's journal mockup.
 */
export type JournalHeroArt =
  | { kind: 'scenery'; source: ImageSourcePropType; width: number; height: number }
  | { kind: 'illustration'; source: ImageSourcePropType; width: number; height: number };

export const JOURNAL_HERO_BY_SEASON: Record<JourneySeason, JournalHeroArt> = {
  spring: {
    kind: 'scenery',
    source: require('../../../../assets/journal/journal-hero-spring.png'),
    width: 852,
    height: 540,
  },
  summer: {
    kind: 'scenery',
    source: require('../../../../assets/journal/journal-hero-summer.png'),
    width: 852,
    height: 540,
  },
  autumn: {
    kind: 'illustration',
    source: require('../../../../assets/journal/journal-hero-autumn-reading.png'),
    width: 852,
    height: 278,
  },
  winter: {
    kind: 'scenery',
    source: require('../../../../assets/journal/journal-hero-winter.png'),
    width: 852,
    height: 540,
  },
};

/** Sitting mascot shared with the Journey stats screen (267 x 221). */
export const JOURNAL_SITTING_MASCOT = require('../../../../assets/journey/stats/mascot-sitting.png');
export const JOURNAL_SITTING_MASCOT_ASPECT = 267 / 221;

/** Empty-state art per season; seasons without one use the sitting mascot. */
export const JOURNAL_EMPTY_ART: Partial<
  Record<JourneySeason, { source: ImageSourcePropType; width: number; height: number }>
> = {
  autumn: {
    source: require('../../../../assets/journal/journal-empty-autumn.png'),
    width: 250,
    height: 198,
  },
};
