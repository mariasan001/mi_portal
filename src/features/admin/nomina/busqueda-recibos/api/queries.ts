import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.routes';
import { buildQueryString } from '@/features/admin/nomina/shared/api/buildQueryString';
import type {
  BuscarRecibosSpPeriodQuery,
  BuscarRecibosSpPeriodResponseDto,
} from '../model/busqueda-recibos.types';

export function buscarRecibosPorServidorYPeriodo(
  query: BuscarRecibosSpPeriodQuery,
  opts?: { signal?: AbortSignal }
) {
  const url = `${API_RUTAS.nomina.receiptsBySpPeriod}${buildQueryString(query)}`;

  return api.get<BuscarRecibosSpPeriodResponseDto>(url, {
    signal: opts?.signal,
  });
}
