'use client';

import { useCallback, useEffect, useState } from 'react';

import { listarPeriodosNomina } from '@/features/admin/nomina/configuracion/api/periodos';
import type { PeriodoNominaDto } from '@/features/admin/nomina/shared/model/periodos.types';
import { toErrorMessage } from '@/lib/api/api.errors';

export function useMonitoreoPeriodosResource() {
  const [lista, setLista] = useState<PeriodoNominaDto[]>([]);
  const [loadingLista, setLoadingLista] = useState(false);
  const [errorLista, setErrorLista] = useState<string | null>(null);

  const cargarLista = useCallback(async () => {
    try {
      setLoadingLista(true);
      setErrorLista(null);
      const response = await listarPeriodosNomina();
      setLista(response);
      return response;
    } catch (error) {
      const message = toErrorMessage(error, 'No se pudo cargar la lista de períodos.');
      setErrorLista(message);
      throw error;
    } finally {
      setLoadingLista(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void cargarLista();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [cargarLista]);

  return {
    lista,
    loadingLista,
    errorLista,
    cargarLista,
  };
}
