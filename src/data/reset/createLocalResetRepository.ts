import {
  createResetRepositoryFromAccessors,
  type ResetRepository,
} from '../../application/reset/ResetRepository';
import type { ResetSnapshot } from '../../features/reset/types';

export type LocalResetStoreAccess = {
  getState: () => ResetSnapshot;
  setState: (snapshot: ResetSnapshot) => void;
};

/**
 * Local adapter over one get/set holder.
 *
 * Production passes `useResetStore`. Tests pass an in-memory holder.
 * Either way there is still only one snapshot being read and written.
 */
export function createLocalResetRepository(store: LocalResetStoreAccess): ResetRepository {
  return createResetRepositoryFromAccessors(
    () => store.getState(),
    (snapshot) => {
      store.setState(snapshot);
    },
  );
}
