import type { ComponentProps } from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type WorldStat = {
  id: string;
  icon: IoniconName;
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
    icon: 'people-outline',
    value: '1,200+',
    label: 'people here',
  },
  {
    id: 'countries',
    icon: 'globe-outline',
    value: '50+',
    label: 'countries',
  },
  {
    id: 'kindness',
    icon: 'heart-outline',
    value: 'kinder',
    label: 'together',
  },
];
