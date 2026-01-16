import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.rutas';
import type { LoginRequest, LoginResponse } from '../types/autenticacion.types';

/** Inicia sesión (UI -> Next API -> IAM). */
export function iniciarSesion(payload: LoginRequest, opts?: { signal?: AbortSignal }) {
  return api.post<LoginResponse>(API_RUTAS.auth.login, payload, { signal: opts?.signal });
}
