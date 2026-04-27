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
  return api.get<VersionNominaDto>(API_RUTAS.nomina.versionDetail(versionId), {
    signal: opts?.signal,
  });
}

export function crearVersionNomina(
  payload: CrearVersionNominaPayload,
  opts?: { signal?: AbortSignal }
) {
  return api.post<VersionNominaDto>(API_RUTAS.nomina.versions, payload, {
    signal: opts?.signal,
  });
}
