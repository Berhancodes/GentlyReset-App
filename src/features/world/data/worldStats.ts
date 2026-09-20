export type WorldStatGlyph = 'people' | 'globe' | 'heart';

export type WorldStat = {
  id: string;
  glyph: WorldStatGlyph;
  value: string;
  label: string;
};

/**
 * Isolated display copy — not live backend counts.
 * Keep these constants local to World; do not wire a network source here.
 */
export const WORLD_COMMUNITY_STATS: readonly WorldStat[] = [
  {
    id: 'people',
    glyph: 'people',
    value: '1,200+',
    label: 'people here',
  },
  {
    id: 'countries',
    glyph: 'globe',
    value: '50+',
    label: 'countries',
  },
  {
    id: 'kindness',
    glyph: 'heart',
    value: 'kinder',
    label: 'together',
  },
];
