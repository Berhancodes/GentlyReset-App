import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { signIn, signOut, signUp } from '@/features/auth/api/authApi';
import { syncProfileTimezone } from '@/features/auth/api/syncProfileTimezone';
import { isSupabaseConfigured, supabase } from '@/features/auth/supabase/client';
import type { AuthActionResult, AuthSnapshot } from '@/features/auth/types';

export type AuthContextValue = AuthSnapshot & {
  signUp: (email: string, password: string) => Promise<AuthActionResult>;
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signOut: () => Promise<AuthActionResult>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

/**
 * In-memory session mirror of Supabase Auth.
 * Persistence lives in the Supabase client (AsyncStorage), not here.
 * Must not read or write local reset / onboarding / journal stores.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [initializing, setInitializing] = useState(isSupabaseConfigured);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      return;
    }

    let active = true;

    void client.auth.getSession().then(({ data }) => {
      if (!active) {
        return;
      }
      setSession(data.session);
      setInitializing(false);
      if (data.session?.user.id) {
        void syncProfileTimezone(data.session.user.id);
      }
    });

    const { data } = client.auth.onAuthStateChange((event, nextSession) => {
      if (!active) {
        return;
      }
      setSession(nextSession);
      if (event === 'SIGNED_IN' && nextSession?.user.id) {
        void syncProfileTimezone(nextSession.user.id);
      }
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const user: User | null = session?.user ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      initializing,
      session,
      user,
      isAuthenticated: session !== null,
      signUp,
      signIn,
      signOut,
    }),
    [initializing, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
