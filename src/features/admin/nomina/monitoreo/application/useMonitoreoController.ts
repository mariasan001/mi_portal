'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useMonitoreoResource } from './useMonitoreoResource';

export function useMonitoreoController() {
  const {
    estadoPeriodo,
    loadingEstado,
    errorEstado,
    consultarEstadoPeriodo,
    resetEstadoPeriodo,
  } = useMonitoreoResource();

  const [payPeriodId, setPayPeriodId] = useState('');

  const canSubmit = useMemo(
    () => Number(payPeriodId) > 0 && !loadingEstado,
    [payPeriodId, loadingEstado]
  );

  const handleConsult = useCallback(async () => {
    const periodoId = Number(payPeriodId);

    if (!Number.isFinite(periodoId) || periodoId <= 0) {
      toast.warning('Captura un payPeriodId válido.');
      return;
    }

    try {
      await consultarEstadoPeriodo(periodoId);
      toast.success('Estado del período consultado correctamente.');
    } catch {
      toast.error('No se pudo consultar el estado del período.');
    }
  }, [consultarEstadoPeriodo, payPeriodId]);

  const handleReset = useCallback(() => {
    setPayPeriodId('');
    resetEstadoPeriodo();
  }, [resetEstadoPeriodo]);

  return {
    estadoPeriodo,
    loadingEstado,
    errorEstado,
    payPeriodId,
    setPayPeriodId,
    canSubmit,
    handleConsult,
    handleReset,
  };
}
