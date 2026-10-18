import { useJourneyVisualStore } from '@/features/journey/store/useJourneyVisualStore';
import { useOnboardingStore } from '@/features/onboarding/store/useOnboardingStore';
import { useNotificationStore } from '@/features/notifications/store/useNotificationStore';
import { useJournalDraftStore } from '@/features/reflect/store/useJournalDraftStore';
import { useResetSyncStore } from '@/features/reset/sync/useResetSyncStore';
import { INITIAL_SYNC_OWNERSHIP } from '@/features/reset/sync/types';

/**
 * Wipes this device's Gently Reset data: progress, journal (and any unsaved draft),
 * onboarding answers, notification choices (which also clears queued reminders)
 * and the backup's ownership record. Used when signing out and
 * after deleting an account, so the next person on this phone starts fresh.
 */
export function clearDeviceData(): void {
  // Also clears the reset itself (progress and journal) and Journey's visual state.
  useOnboardingStore.getState().resetOnboarding();
  useJournalDraftStore.getState().clearDraft();
  useResetSyncStore.getState().replaceOwnership(INITIAL_SYNC_OWNERSHIP);
  useJourneyVisualStore.getState().clearJourneyVisual();
  useNotificationStore.getState().resetNotificationSettings();
}
