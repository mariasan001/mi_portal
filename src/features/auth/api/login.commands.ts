import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.routes';

import type { LoginRequest, LoginResponse } from '../model/login.types';

/** Inicia sesion (UI -> Next API -> IAM). */
export function iniciarSesion(
  payload: LoginRequest,
  opts?: { signal?: AbortSignal }
) {
  return api.post<LoginResponse>(API_RUTAS.auth.login, payload, {
    signal: opts?.signal,
  });
}
