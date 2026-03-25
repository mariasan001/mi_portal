import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.rutas';
import type {
  BuscarRecibosSpPeriodQuery,
  BuscarRecibosSpPeriodResponseDto,
} from '../types/nomina-busqueda-recibos.types';

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

export function buscarRecibosPorServidorYPeriodo(
  query: BuscarRecibosSpPeriodQuery,
  opts?: { signal?: AbortSignal }
) {
  const url = `${API_RUTAS.nomina.receiptsBySpPeriod}${buildQueryString(query)}`;

  return api.get<BuscarRecibosSpPeriodResponseDto>(url, {
    signal: opts?.signal,
  });
}