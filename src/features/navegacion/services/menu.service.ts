import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.rutas';
import type { MenuResponse } from '../types/menu.types';

export function obtenerMenu(appCode: string, opts?: { signal?: AbortSignal }) {
  return api.get<MenuResponse>(API_RUTAS.apps.menu(appCode), { signal: opts?.signal });
}
