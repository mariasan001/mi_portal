import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.rutas';
import type { EjecucionPayrollStagingDto } from '../types/nomina-staging.types';

export function ejecutarPayrollStaging(
  fileId: number,
  opts?: { signal?: AbortSignal }
) {
  return api.post<EjecucionPayrollStagingDto>(
    API_RUTAS.nomina.ejecutarPayrollStaging(fileId),
    undefined,
    { signal: opts?.signal }
  );
}