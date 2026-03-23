import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.rutas';
import type { MenuResponse } from '../types/menu.types';
import { normalizarMenu } from '../utils/menu.normalizar';

/**
 * Cache simple por appCode.
 */
const cache = new Map<string, MenuResponse>();

/**
 * Requests en vuelo para dedupe.
 */
const inflight = new Map<string, Promise<MenuResponse>>();

export type GetMenuOptions = {
  force?: boolean;
};

/**
 * Obtiene el menú dinámico de una app y lo normaliza.
 */
export async function obtenerMenu(
  appCode: string,
  opts?: GetMenuOptions
): Promise<MenuResponse> {
  const code = appCode.trim();

  if (!code) {
    throw new Error('appCode inválido');
  }

  // 1) Cache
  if (!opts?.force) {
    const cached = cache.get(code);
    if (cached) return cached;
  }

  // 2) Dedupe
  if (!opts?.force) {
    const currentInflight = inflight.get(code);
    if (currentInflight) return currentInflight;
  }

  const url = API_RUTAS.apps.menu(code);

  const request = (async () => {
    const raw = await api.get<unknown>(url);
    const normalized = normalizarMenu(raw);
    cache.set(code, normalized);
    return normalized;
  })();

  inflight.set(code, request);

  try {
    return await request;
  } finally {
    inflight.delete(code);
  }
}

/**
 * Limpia cache de menú.
 */
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