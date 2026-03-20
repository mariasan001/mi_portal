import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.rutas';
import { CrearPeriodoNominaPayload, PeriodoNominaDto } from '../types/nomina-periodos.types';

export function obtenerPeriodoNomina(
  periodId: number,
  opts?: { signal?: AbortSignal }
) {
  return api.get<PeriodoNominaDto>(API_RUTAS.nomina.periodoDetalle(periodId), {
    signal: opts?.signal,
  });
}

export function crearORecuperarPeriodoNomina(
  payload: CrearPeriodoNominaPayload,
  opts?: { signal?: AbortSignal }
) {
  return api.post<PeriodoNominaDto>(API_RUTAS.nomina.periodos, payload, {
    signal: opts?.signal,
  });
}