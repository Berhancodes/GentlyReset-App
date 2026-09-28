import type { ResetTypeId } from '../../types';
import { ALL_IN_HEART_PLAYLIST } from './allInHeart';
import { ALMOST_STARTER_PLAYLIST } from './almostStarter';
import { DRIFTING_COMPASS_PLAYLIST } from './driftingCompass';
import { FADING_FLAME_PLAYLIST } from './fadingFlame';
import { OVERLOADED_DREAMER_PLAYLIST } from './overloadedDreamer';
import { QUIET_DRAIN_PLAYLIST } from './quietDrain';
import { QUIET_STRANGER_PLAYLIST } from './quietStranger';
import { SOFT_RESTARTER_PLAYLIST } from './softRestarter';
import { SOFT_SCATTER_PLAYLIST } from './softScatter';
import type { PlaylistSlot } from '../types';

export const TYPE_PLAYLISTS: Record<ResetTypeId, readonly PlaylistSlot[]> = {
  'overloaded-dreamer': OVERLOADED_DREAMER_PLAYLIST,
  'almost-starter': ALMOST_STARTER_PLAYLIST,
  'fading-flame': FADING_FLAME_PLAYLIST,
  'soft-restarter': SOFT_RESTARTER_PLAYLIST,
  'all-in-heart': ALL_IN_HEART_PLAYLIST,
  'quiet-drain': QUIET_DRAIN_PLAYLIST,
  'drifting-compass': DRIFTING_COMPASS_PLAYLIST,
  'quiet-stranger': QUIET_STRANGER_PLAYLIST,
  'soft-scatter': SOFT_SCATTER_PLAYLIST,
};
