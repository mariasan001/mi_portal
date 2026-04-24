import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.routes';
import { buildQueryString } from '@/features/admin/nomina/shared/api/buildQueryString';
import type {
  AuditCancellationsQuery,
  AuditCancellationsResponseDto,
  AuditReleasesQuery,
  AuditReleasesResponseDto,
} from '../model/auditoria.types';

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
