import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.rutas';
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../types/password.types';

export function solicitarRecuperacion(payload: ForgotPasswordRequest, opts?: { signal?: AbortSignal }) {
  return api.post<ForgotPasswordResponse>(API_RUTAS.password.forgot, payload, { signal: opts?.signal });
}

export function verificarOtp(payload: VerifyOtpRequest, opts?: { signal?: AbortSignal }) {
  return api.post<VerifyOtpResponse>(API_RUTAS.otp.verify, payload, { signal: opts?.signal });
}

export function resetearContrasena(payload: ResetPasswordRequest, opts?: { signal?: AbortSignal }) {
  return api.post<ResetPasswordResponse>(API_RUTAS.password.reset, payload, { signal: opts?.signal });
}