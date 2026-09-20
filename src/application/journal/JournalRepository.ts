/**
 * FUTURE DEBT — not constructed or injected in Phase 2C.
 *
 * Reflections live on `ResetSnapshot.reflections` and are written by
 * `saveReflection` through `ResetRepository`. A dedicated
 * JournalRepository would be a second local source of truth.
 *
 * Do not implement this port until journal persistence is split from
 * the daily reset snapshot (not part of Phase 2C).
 */
export type JournalRepository = {
  readonly futureDebt: 'reflections persist on ResetSnapshot via ResetRepository';
};
