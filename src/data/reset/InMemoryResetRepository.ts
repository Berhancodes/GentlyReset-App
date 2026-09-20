import {
  createResetRepositoryFromAccessors,
  pickResetSnapshot,
  type ResetRepository,
} from '../../application/reset/ResetRepository';
import type { ResetSnapshot } from '../../features/reset/types';

/**
 * Test-only ResetRepository. Not a production persistence source.
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

/** Class form of the test adapter. Prefer `createInMemoryResetRepository`. */
export class InMemoryResetRepository implements ResetRepository {
  private readonly repository: ResetRepository;

  constructor(initialSnapshot: ResetSnapshot) {
    this.repository = createInMemoryResetRepository(initialSnapshot);
  }

  getSnapshot(): ResetSnapshot {
    return this.repository.getSnapshot();
  }

  saveSnapshot(snapshot: ResetSnapshot): void {
    this.repository.saveSnapshot(snapshot);
  }
}
