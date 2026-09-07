import type { ResetProfile } from '@/features/onboarding/types/onboarding';

/**
 * TODO: Implement native share/export of the Reset Card.
 * Intentionally a no-op until that work is scheduled — do not fake success.
 */
export function shareReset(_profile: ResetProfile): void {
  if (__DEV__) {
    console.info('[Gently Reset] shareReset is not implemented yet.');
  }
}
