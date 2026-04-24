import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.rutas';

import type { MenuResponse } from '../model/menu.types';
import { normalizarMenu } from '../model/menu.normalizers';

const menuCache = new Map<string, MenuResponse>();
const inflightMenuRequests = new Map<string, Promise<MenuResponse>>();

export type GetMenuOptions = {
  force?: boolean;
};

export async function obtenerMenu(
  appCode: string,
  opts?: GetMenuOptions
): Promise<MenuResponse> {
  const code = appCode.trim();

  if (!code) {
    throw new Error('appCode invalido');
  }

  if (!opts?.force) {
    const cached = menuCache.get(code);
    if (cached) return cached;
  }

  if (!opts?.force) {
    const currentInflight = inflightMenuRequests.get(code);
    if (currentInflight) return currentInflight;
  }

  const url = API_RUTAS.apps.menu(code);

  const request = (async () => {
    const raw = await api.get<unknown>(url);
    const normalized = normalizarMenu(raw);
    menuCache.set(code, normalized);
    return normalized;
  })();

  inflightMenuRequests.set(code, request);

  try {
    return await request;
  } finally {
    inflightMenuRequests.delete(code);
  }
}

export function limpiarMenuCache(appCode?: string) {
  if (appCode) {
    const code = appCode.trim();
    menuCache.delete(code);
    inflightMenuRequests.delete(code);
    return;
  }

  menuCache.clear();
  inflightMenuRequests.clear();
}
