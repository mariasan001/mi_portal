export type ForgotPasswordRequest = { email: string };
export type ForgotPasswordResponse = { ok: boolean; message?: string };

export type VerifyOtpPurpose = 'PASSWORD_RESET' | 'LOGIN_2FA';

export type VerifyOtpRequest = {
  usernameOrEmail: string;
  purpose: VerifyOtpPurpose;
  otp: string;
};
export type VerifyOtpResponse = { ok: boolean; message?: string };

export type ResetPasswordRequest = { email: string; otp: string; newPassword: string };
export type ResetPasswordResponse = { ok: boolean; message?: string };