import type { JournalMood } from '../domain/journal/types';
import type { OnboardingAnswer } from '../features/onboarding/types/onboarding';
import { saveReflection as saveReflectionOnSnapshot } from './journal/saveReflection';
import { completeResetDay as completeResetDayOnSnapshot } from './reset/completeResetDay';
import { processDateRollover as processDateRolloverOnSnapshot } from './reset/processDateRollover';
import type { ResetRepository } from './reset/ResetRepository';
import {
  ensureSeeded as ensureSeededOnSnapshot,
  startReset as startResetOnSnapshot,
} from './reset/startReset';
import { startResetDay as startResetDayOnSnapshot } from './reset/startResetDay';

function runResetCommand(
  repository: ResetRepository,
  command: () => ReturnType<typeof saveReflectionOnSnapshot>,
) {
  const next = command();
  repository.saveSnapshot(next);
  return next;
}

/**
 * Repo-backed application API.
 *
 * Each command: get snapshot → Phase 2B snapshot transition → save.
 * Snapshot-in/out commands stay exported for Phase 2B tests and Journey.
 */
export function createResetApplication(repository: ResetRepository) {
  return {
    startReset(answers: Record<string, OnboardingAnswer>, now: Date = new Date()) {
      return runResetCommand(repository, () =>
        startResetOnSnapshot(repository.getSnapshot(), answers, now),
      );
    },
    ensureSeeded(answers: Record<string, OnboardingAnswer>, now: Date = new Date()) {
      return runResetCommand(repository, () =>
        ensureSeededOnSnapshot(repository.getSnapshot(), answers, now),
      );
    },
    processDateRollover(now: Date) {
      return runResetCommand(repository, () =>
        processDateRolloverOnSnapshot(repository.getSnapshot(), now),
      );
    },
    startResetDay() {
      return runResetCommand(repository, () => startResetDayOnSnapshot(repository.getSnapshot()));
    },
    completeResetDay(now: Date = new Date()) {
      return runResetCommand(repository, () =>
        completeResetDayOnSnapshot(repository.getSnapshot(), now),
      );
    },
    saveReflection(
      input: { mood: JournalMood; text: string; prompt: string },
      now: Date = new Date(),
    ) {
      return runResetCommand(repository, () =>
        saveReflectionOnSnapshot(repository.getSnapshot(), input, now),
      );
    },
  };
}

export function startReset(
  repository: ResetRepository,
  answers: Record<string, OnboardingAnswer>,
  now: Date = new Date(),
) {
  return createResetApplication(repository).startReset(answers, now);
}

export function ensureSeeded(
  repository: ResetRepository,
  answers: Record<string, OnboardingAnswer>,
  now: Date = new Date(),
) {
  return createResetApplication(repository).ensureSeeded(answers, now);
}

export function startResetDay(repository: ResetRepository) {
  return createResetApplication(repository).startResetDay();
}

export function completeResetDay(repository: ResetRepository, now: Date = new Date()) {
  return createResetApplication(repository).completeResetDay(now);
}

export function processDateRollover(repository: ResetRepository, now: Date) {
  return createResetApplication(repository).processDateRollover(now);
}

export function saveReflection(
  repository: ResetRepository,
  input: { mood: JournalMood; text: string; prompt: string },
  now: Date = new Date(),
) {
  return createResetApplication(repository).saveReflection(input, now);
}
