export interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  root?: string;
}
