'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import { buscarRecibosPorServidorYPeriodo } from '../services/nomina-busqueda-recibos.service';
import type {
  BuscarRecibosSpPeriodQuery,
  BuscarRecibosSpPeriodResponseDto,
} from '../types/nomina-busqueda-recibos.types';

type SearchState = {
  data: BuscarRecibosSpPeriodResponseDto | null;
  loading: boolean;
  error: string | null;
};

export function useNominaBusquedaRecibos() {
  const [state, setState] = useState<SearchState>({
    data: null,
    loading: false,
    error: null,
  });

  const consultar = useCallback(async (query: BuscarRecibosSpPeriodQuery) => {
    try {
      setState({ data: null, loading: true, error: null });
      const response = await buscarRecibosPorServidorYPeriodo(query);
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (e) {
      const message = toErrorMessage(
        e,
        'No se pudo consultar la búsqueda de recibos'
      );
      setState({ data: null, loading: false, error: message });
      throw e;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    consultar,
    reset,
  };
}