import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

import { supabase } from '@/features/auth/supabase/client';
import type { AuthActionResult } from '@/features/auth/types';
import { authFailure, authSuccess, mapAuthError } from '@/features/auth/utils/mapAuthError';

import { syncProfileTimezone } from './syncProfileTimezone';

/** The person closed the Apple or Google sheet: not an error, nothing to show. */
export type SocialSignInResult = AuthActionResult | { ok: false; cancelled: true };

const UNAVAILABLE: AuthActionResult = {
  ok: false,
  message: 'accounts are unavailable right now. try again later.',
};

const CANCELLED: SocialSignInResult = { ok: false, cancelled: true };

function googleClientIds(): { iosClientId: string; webClientId: string } | null {
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  return iosClientId && webClientId ? { iosClientId, webClientId } : null;
}

/** Apple's sheet exists on iOS 13+ devices; Expo Go's bundle ID can't complete it, real builds can. */
export async function isAppleSignInAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return false;
  }
  return AppleAuthentication.isAvailableAsync();
}

/** Google needs its client IDs and the native module, which Expo Go doesn't have. */
export function isGoogleSignInConfigured(): boolean {
  return Platform.OS === 'ios' && googleClientIds() !== null;
}

/** Exchanges a provider's identity token for a Supabase session (new account or returning). */
async function signInWithIdToken(
  provider: 'apple' | 'google',
  token: string,
): Promise<AuthActionResult> {
  const client = supabase;
  if (!client) {
    return UNAVAILABLE;
  }
  const { data, error } = await client.auth.signInWithIdToken({ provider, token });
  if (error) {
    return { ok: false, message: mapAuthError(error) };
  }
  if (data.session?.user.id) {
    await syncProfileTimezone(data.session.user.id);
  }
  return authSuccess('signed_in');
}

export async function signInWithApple(): Promise<SocialSignInResult> {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
    });
    if (!credential.identityToken) {
      return { ok: false, message: 'apple didn’t send a sign-in token. try again.' };
    }
    return await signInWithIdToken('apple', credential.identityToken);
  } catch (error) {
    if ((error as { code?: string } | null)?.code === 'ERR_REQUEST_CANCELED') {
      return CANCELLED;
    }
    return authFailure(error);
  }
}

export async function signInWithGoogle(): Promise<SocialSignInResult> {
  const ids = googleClientIds();
  if (!ids) {
    return { ok: false, message: 'google sign-in isn’t set up yet.' };
  }

  try {
    // Loaded only here: the native module is missing in Expo Go and would crash an eager import.
    const { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } =
      await import('@react-native-google-signin/google-signin');
    try {
      GoogleSignin.configure(ids);
      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response)) {
        return CANCELLED;
      }
      if (!response.data.idToken) {
        return { ok: false, message: 'google didn’t send a sign-in token. try again.' };
      }
      return await signInWithIdToken('google', response.data.idToken);
    } catch (error) {
      if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) {
        return CANCELLED;
      }
      return authFailure(error);
    }
  } catch (error) {
    return authFailure(error);
  }
}
