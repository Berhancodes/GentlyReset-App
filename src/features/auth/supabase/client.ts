import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, type AppStateStatus } from 'react-native';

/**
 * Official Expo / React Native Supabase client.
 *
 * Session storage is AsyncStorage (native + web). This module is identity
 * only — it must never import reset, onboarding, journal, or journey stores.
 */
function createSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
}

export const supabase = createSupabaseClient();

export const isSupabaseConfigured = supabase !== null;

if (supabase) {
  AppState.addEventListener('change', (status: AppStateStatus) => {
    if (status === 'active') {
      void supabase.auth.startAutoRefresh();
    } else {
      void supabase.auth.stopAutoRefresh();
    }
  });
}
