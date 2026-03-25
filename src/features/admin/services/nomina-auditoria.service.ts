import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.rutas';
import type {
  AuditCancellationsQuery,
  AuditCancellationsResponseDto,
  AuditReleasesQuery,
  AuditReleasesResponseDto,
} from '../types/nomina-auditoria.types';

function buildQueryString(
  params?: Record<string, string | number | undefined>
): string {
  const qs = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    qs.set(key, String(value));
  });

  const query = qs.toString();
  return query ? `?${query}` : '';
}

export function obtenerAuditoriaLiberaciones(
  query?: AuditReleasesQuery,
  opts?: { signal?: AbortSignal }
) {
  const url = `${API_RUTAS.nomina.auditReleases}${buildQueryString(query)}`;

  return api.get<AuditReleasesResponseDto>(url, {
    signal: opts?.signal,
  });
}

export function obtenerAuditoriaCancelaciones(
  query?: AuditCancellationsQuery,
  opts?: { signal?: AbortSignal }
) {
  const url = `${API_RUTAS.nomina.auditCancellations}${buildQueryString(query)}`;

  return api.get<AuditCancellationsResponseDto>(url, {
    signal: opts?.signal,
  });
}