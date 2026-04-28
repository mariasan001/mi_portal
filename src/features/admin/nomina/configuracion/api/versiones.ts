import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.routes';
import type {
  CrearVersionNominaPayload,
  VersionNominaDto,
} from '@/features/admin/nomina/shared/model/versiones.types';

export function obtenerVersionNomina(
  versionId: number,
  opts?: { signal?: AbortSignal }
) {
  return api.get<VersionNominaDto>(API_RUTAS.nomina.versionDetalle(versionId), {
    signal: opts?.signal,
  });
}

export function listarVersionesNomina(
  opts?: { signal?: AbortSignal; payPeriodId?: number }
) {
  const qs =
    typeof opts?.payPeriodId === 'number' && Number.isFinite(opts.payPeriodId)
      ? `?payPeriodId=${encodeURIComponent(String(opts.payPeriodId))}`
      : '';

  return api.get<VersionNominaDto[]>(`${API_RUTAS.nomina.versiones}${qs}`, {
    signal: opts?.signal,
  });
}

export function crearVersionNomina(
  payload: CrearVersionNominaPayload,
  opts?: { signal?: AbortSignal }
) {
  return api.post<VersionNominaDto>(API_RUTAS.nomina.versiones, payload, {
    signal: opts?.signal,
  });
}
