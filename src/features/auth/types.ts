export type SignInValues = {
  email: string;
  password: string;
};

export type SignInField = keyof SignInValues;

export type SignInErrors = Partial<Record<SignInField | 'form', string>>;
