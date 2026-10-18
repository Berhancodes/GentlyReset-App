import { supabase } from '@/features/auth/supabase/client';

/**
 * Saves or removes this phone's Expo push token on the server, so friend
 * notifications (encouragements, friend requests) can reach it.
 * See supabase/migrations/*_friend_push_notifications.sql.
 */

export async function registerPushToken(
  token: string,
  platform: 'ios' | 'android',
): Promise<boolean> {
  if (!supabase) {
    return false;
  }
  const { data, error } = await supabase.rpc('register_push_token', {
    push_token: token,
    push_platform: platform,
  });
  return !error && (data as { ok?: boolean } | null)?.ok === true;
}

export async function unregisterPushToken(token: string): Promise<boolean> {
  if (!supabase) {
    return false;
  }
  const { data, error } = await supabase.rpc('unregister_push_token', { push_token: token });
  return !error && (data as { ok?: boolean } | null)?.ok === true;
}
