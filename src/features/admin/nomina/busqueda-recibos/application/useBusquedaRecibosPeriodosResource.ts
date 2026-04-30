'use client';

import { useCallback, useEffect, useState } from 'react';

import { listarPeriodosNomina } from '@/features/admin/nomina/configuracion/api/periodos';
import type { PeriodoNominaDto } from '@/features/admin/nomina/shared/model/periodos.types';
import { toErrorMessage } from '@/lib/api/api.errors';

type PeriodosState = {
  data: PeriodoNominaDto[];
  loading: boolean;
  error: string | null;
};

export function useBusquedaRecibosPeriodosResource() {
  const [state, setState] = useState<PeriodosState>({
    data: [],
    loading: false,
    error: null,
  });

  const cargar = useCallback(async () => {
    try {
      setState((current) => ({ ...current, loading: true, error: null }));
      const response = await listarPeriodosNomina();
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const message = toErrorMessage(error, 'No se pudieron cargar los periodos.');
      setState({ data: [], loading: false, error: message });
      throw error;
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void cargar();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [cargar]);

  return {
    ...state,
    cargar,
  };
}
