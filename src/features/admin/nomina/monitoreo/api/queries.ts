import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.routes';
import type { NominaPeriodoEstadoDto } from '../model/monitoreo.types';

export function obtenerEstadoPeriodo(
  payPeriodId: number,
  opts?: { signal?: AbortSignal }
) {
  return api.get<NominaPeriodoEstadoDto>(
    API_RUTAS.nomina.monitoreoPeriodo(payPeriodId),
    {
      signal: opts?.signal,
    }
  );
}
