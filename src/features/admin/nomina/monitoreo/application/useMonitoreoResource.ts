'use client';

import { useCallback, useState } from 'react';

import { obtenerEstadoPeriodo } from '@/features/admin/nomina/monitoreo/api/queries';
import {
  errorState,
  idleState,
  loadingState,
  successState,
  type AsyncState,
} from '@/features/admin/nomina/shared/lib/request-state';
import { toErrorMessage } from '@/lib/api/api.errors';

import type { NominaPeriodoEstadoDto } from '../model/monitoreo.types';

export function useMonitoreoResource() {
  const [estadoPeriodo, setEstadoPeriodo] =
    useState<AsyncState<NominaPeriodoEstadoDto>>(idleState());

  const consultarEstadoPeriodo = useCallback(async (payPeriodId: number) => {
    try {
      setEstadoPeriodo((current) => loadingState(current.data));
      const response = await obtenerEstadoPeriodo(payPeriodId);
      setEstadoPeriodo(successState(response));
      return response;
    } catch (error) {
      const message = toErrorMessage(error, 'No se pudo consultar el estado del periodo.');
      setEstadoPeriodo((current) => errorState(message, current.data));
      throw error;
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
