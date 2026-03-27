'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import { obtenerEstadoPeriodo } from '../services/nomina-monitoreo.service';
import type { NominaPeriodoEstadoDto } from '../types/nomina-monitoreo.types';

export function useNominaMonitoreo() {
  const [estadoPeriodo, setEstadoPeriodo] =
    useState<NominaPeriodoEstadoDto | null>(null);

  const [loadingEstado, setLoadingEstado] = useState(false);
  const [errorEstado, setErrorEstado] = useState<string | null>(null);

  const consultarEstadoPeriodo = useCallback(async (payPeriodId: number) => {
    try {
      setLoadingEstado(true);
      setErrorEstado(null);

      const response = await obtenerEstadoPeriodo(payPeriodId);
      setEstadoPeriodo(response);

      return response;
    } catch (e) {
      const message = toErrorMessage(
        e,
        'No se pudo consultar el estado del periodo'
      );
      setErrorEstado(message);
      throw e;
    } finally {
      setLoadingEstado(false);
    }
  }, []);

  const resetEstadoPeriodo = useCallback(() => {
    setEstadoPeriodo(null);
    setErrorEstado(null);
  }, []);

  return {
    estadoPeriodo,
    loadingEstado,
    errorEstado,
    consultarEstadoPeriodo,
    resetEstadoPeriodo,
  };
}