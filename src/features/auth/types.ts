import type { Session, User } from '@supabase/supabase-js';

export type SignInValues = {
  email: string;
  password: string;
};

export type SignInField = keyof SignInValues;

export type SignInErrors = Partial<Record<SignInField | 'form', string>>;

export type SignUpValues = SignInValues;
export type SignUpErrors = SignInErrors;

export type AuthSuccessKind =
  | 'signed_in'
  | 'confirmation_required'
  | 'signed_out'
  | 'deleted'
  | 'code_sent'
  | 'password_updated';

export type AuthActionResult = { ok: true; kind: AuthSuccessKind } | { ok: false; message: string };

export type AuthSnapshot = {
  initializing: boolean;
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
};
