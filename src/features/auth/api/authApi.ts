import { supabase } from '@/features/auth/supabase/client';
import type { AuthActionResult } from '@/features/auth/types';
import { normalizeEmail } from '@/features/auth/utils/normalizeEmail';
import {
  authFailure,
  authSuccess,
  getSignUpOutcome,
  mapAuthError,
} from '@/features/auth/utils/mapAuthError';

import { syncProfileTimezone } from './syncProfileTimezone';

const UNAVAILABLE: AuthActionResult = {
  ok: false,
  message: 'accounts are unavailable right now. try again later.',
};

/**
 * Supabase is the auth source of truth.
 * These functions must not import or mutate reset / onboarding stores.
 */
export async function signUp(email: string, password: string): Promise<AuthActionResult> {
  const client = supabase;
  if (!client) {
    return UNAVAILABLE;
  }

  try {
    const { data, error } = await client.auth.signUp({
      email: normalizeEmail(email),
      password,
    });

    if (error) {
      return { ok: false, message: mapAuthError(error) };
    }

    const outcome = getSignUpOutcome(data);
    if (outcome.kind === 'signed_in' && data.session?.user.id) {
      await syncProfileTimezone(data.session.user.id);
    }
    return outcome;
  } catch (error) {
    return authFailure(error);
  }
}

export async function signIn(email: string, password: string): Promise<AuthActionResult> {
  const client = supabase;
  if (!client) {
    return UNAVAILABLE;
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });

    if (error) {
      return { ok: false, message: mapAuthError(error) };
    }

    if (data.session?.user.id) {
      await syncProfileTimezone(data.session.user.id);
    }

    return authSuccess('signed_in');
  } catch (error) {
    return authFailure(error);
  }
}

export async function signOut(): Promise<AuthActionResult> {
  const client = supabase;
  if (!client) {
    return UNAVAILABLE;
  }

  try {
    const { error } = await client.auth.signOut();
    if (error) {
      return { ok: false, message: mapAuthError(error) };
    }
    return authSuccess('signed_out');
  } catch (error) {
    return authFailure(error);
  }
}

/**
 * Permanently deletes the signed-in account and all of its data on the server
 * (`delete_my_account`), then ends the session on this device. It does not cancel
 * an App Store subscription; only the user can do that in Settings.
 */
export async function deleteAccount(): Promise<AuthActionResult> {
  const client = supabase;
  if (!client) {
    return UNAVAILABLE;
  }

  try {
    const { data, error } = await client.rpc('delete_my_account');
    const result = (data ?? null) as { ok?: boolean; code?: string } | null;
    if (error || !result?.ok) {
      return {
        ok: false,
        message: 'your account couldn’t be deleted right now. check your connection and try again.',
      };
    }
    // The account is gone on the server; clear the leftover session on this device.
    await client.auth.signOut({ scope: 'local' });
    return authSuccess('deleted');
  } catch (error) {
    return authFailure(error);
  }
}
