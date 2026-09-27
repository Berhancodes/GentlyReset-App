import { supabase } from '@/features/auth/supabase/client';
import { getDeviceIanaTimezone } from '@/features/auth/utils/getDeviceTimezone';

/**
 * Writes the device IANA timezone onto the caller's profile.
 * Never writes reset, onboarding, or journal fields.
 */
export async function syncProfileTimezone(userId: string): Promise<void> {
  const client = supabase;
  if (!client) {
    return;
  }

  const timezone = getDeviceIanaTimezone();
  if (!timezone) {
    return;
  }

  await client.from('profiles').update({ timezone }).eq('id', userId);
}
