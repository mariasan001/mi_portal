import { API_RUTAS } from '@/lib/api/api.rutas';
import type { MenuResponse } from '../types/menu.types';
import { normalizarMenu } from '../utils/menu.normalizar';
import { api } from '@/lib/api/api.cliente';

export async function obtenerMenu(appCode: string, opts?: { signal?: AbortSignal }): Promise<MenuResponse> {
  const url = API_RUTAS.apps.menu(appCode);

  console.log('[menu.service] GET', url);

  const raw = await api.get<unknown>(url, { signal: opts?.signal });

  console.log('[menu.service] RAW:', raw);

  const normalized = normalizarMenu(raw);

  console.log('[menu.service] NORMALIZED.appCode:', normalized.appCode);
  console.log('[menu.service] NORMALIZED.items.length:', normalized.items.length);

  console.table(
    normalized.items.map((it) => ({
      code: it.code,
      name: it.name,
      route: it.route,
      icon: it.icon,
      children: it.children?.length ?? 0,
    }))
  );

  return normalized;
}
