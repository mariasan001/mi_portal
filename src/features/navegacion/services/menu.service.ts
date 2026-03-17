import { API_RUTAS } from '@/lib/api/api.rutas';
import type { MenuResponse } from '../types/menu.types';
import { normalizarMenu } from '../utils/menu.normalizar';
import { api } from '@/lib/api/api.cliente';

/**
 * Cache simple en memoria (por appCode).
 * - Evita 2 requests en DEV por StrictMode.
 * - Evita repeticiones si 2 componentes piden el mismo menú.
 */
const cache = new Map<string, MenuResponse>();
const inflight = new Map<string, Promise<MenuResponse>>();

type GetMenuOptions = {
  force?: boolean; // si quieres reconsultar aunque exista cache
};

export async function obtenerMenu(appCode: string, opts?: GetMenuOptions): Promise<MenuResponse> {
  const code = appCode.trim();
  if (!code) throw new Error('appCode inválido');

  // 1) cache hit
  if (!opts?.force) {
    const cached = cache.get(code);
    if (cached) return cached;
  }

  // 2) request en vuelo (dedupe)
  const existing = inflight.get(code);
  if (existing) return existing;

  const url = API_RUTAS.apps.menu(code);

  const p = (async () => {
    const raw = await api.get<unknown>(url);
    const normalized = normalizarMenu(raw);
    cache.set(code, normalized);
    return normalized;
  })();

  inflight.set(code, p);

  try {
    return await p;
  } finally {
    inflight.delete(code);
  }
}

export function limpiarMenuCache(appCode?: string) {
  if (appCode) {
    const code = appCode.trim();
    cache.delete(code);
    inflight.delete(code);
    return;
  }
  cache.clear();
  inflight.clear();
}