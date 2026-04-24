import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.routes';
import type {
  CoreSyncResponseDto,
  GenerarRecibosResponseDto,
  GenerarSnapshotsResponseDto,
  LiberarVersionPayload,
  LiberarVersionResponseDto,
} from '../model/recibos.types';

export function generarSnapshots(
  versionId: number,
  opts?: { signal?: AbortSignal }
) {
  return api.post<GenerarSnapshotsResponseDto>(
    API_RUTAS.nomina.snapshotsGenerate(versionId),
    undefined,
    { signal: opts?.signal }
  );
}

export function generarRecibos(
  versionId: number,
  opts?: { signal?: AbortSignal }
) {
  return api.post<GenerarRecibosResponseDto>(
    API_RUTAS.nomina.receiptsGenerate(versionId),
    undefined,
    { signal: opts?.signal }
  );
}

export function liberarVersionRecibos(
  versionId: number,
  payload: LiberarVersionPayload,
  opts?: { signal?: AbortSignal }
) {
  return api.post<LiberarVersionResponseDto>(
    API_RUTAS.nomina.releaseVersion(versionId),
    payload,
    { signal: opts?.signal }
  );
}

export function sincronizarVersionCore(
  versionId: number,
  opts?: { signal?: AbortSignal }
) {
  return api.post<CoreSyncResponseDto>(
    API_RUTAS.nomina.coreSyncVersion(versionId),
    undefined,
    { signal: opts?.signal }
  );
}
