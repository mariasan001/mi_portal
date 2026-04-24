import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.routes';

import type { SesionMe } from '../model/session.types';

/** Obtiene sesion actual (me) usando cookie. */
export function obtenerSesion(opts?: { signal?: AbortSignal }) {
  return api.get<SesionMe>(API_RUTAS.auth.me, { signal: opts?.signal });
}
