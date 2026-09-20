import {
  createResetRepositoryFromAccessors,
  pickResetSnapshot,
  type ResetRepository,
} from '../../application/reset/ResetRepository';
import type { ResetSnapshot } from '../../features/reset/types';

/**
 * Test/development adapter. Not a production persistence source.
 * Holds one cloned ResetSnapshot in memory — no AsyncStorage, no Zustand.
 */
export function createInMemoryResetRepository(initialSnapshot: ResetSnapshot): ResetRepository {
  let snapshot = pickResetSnapshot(initialSnapshot);
  return createResetRepositoryFromAccessors(
    () => snapshot,
    (next) => {
      snapshot = pickResetSnapshot(next);
    },
  );
}
