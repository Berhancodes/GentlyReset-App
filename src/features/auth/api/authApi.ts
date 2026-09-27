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
