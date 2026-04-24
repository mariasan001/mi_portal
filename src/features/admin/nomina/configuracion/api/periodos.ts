import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.rutas';
import type {
  CrearPeriodoNominaPayload,
  PeriodoNominaDto,
} from '@/features/admin/nomina/shared/model/periodos.types';

export function obtenerPeriodoNomina(
  periodId: number,
  opts?: { signal?: AbortSignal }
) {
  return api.get<PeriodoNominaDto>(API_RUTAS.nomina.periodDetalle(periodId), {
    signal: opts?.signal,
  });
}

export function crearORecuperarPeriodoNomina(
  payload: CrearPeriodoNominaPayload,
  opts?: { signal?: AbortSignal }
) {
  return api.post<PeriodoNominaDto>(API_RUTAS.nomina.periods, payload, {
    signal: opts?.signal,
  });
}
