import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.rutas';
import type { SesionMe } from '../types/me.types';

/** Obtiene sesión actual (me) usando cookie. */
export function obtenerSesion(opts?: { signal?: AbortSignal }) {
  return api.get<SesionMe>(API_RUTAS.auth.me, { signal: opts?.signal });
}