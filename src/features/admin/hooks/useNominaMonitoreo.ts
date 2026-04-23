'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import { obtenerEstadoPeriodo } from '../services/nomina-monitoreo.service';
import {
  errorState,
  idleState,
  loadingState,
  successState,
  type AsyncState,
} from './request-state';
import type { NominaPeriodoEstadoDto } from '../types/nomina-monitoreo.types';

export function useNominaMonitoreo() {
  const [estadoPeriodo, setEstadoPeriodo] =
    useState<AsyncState<NominaPeriodoEstadoDto>>(idleState());

  const consultarEstadoPeriodo = useCallback(async (payPeriodId: number) => {
    try {
      setEstadoPeriodo((current) => loadingState(current.data));
      const response = await obtenerEstadoPeriodo(payPeriodId);
      setEstadoPeriodo(successState(response));
      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo consultar el estado del periodo');
      setEstadoPeriodo((current) => errorState(message, current.data));
      throw e;
    }
  }, []);

  const resetEstadoPeriodo = useCallback(() => {
    setEstadoPeriodo(idleState());
  }, []);

  return {
    estadoPeriodo: estadoPeriodo.data,
    loadingEstado: estadoPeriodo.loading,
    errorEstado: estadoPeriodo.error,
    consultarEstadoPeriodo,
    resetEstadoPeriodo,
  };
}
