'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { formatPeriodoOptionLabel } from '../model/monitoreo.selectors';
import { useMonitoreoPeriodosResource } from './useMonitoreoPeriodosResource';
import { useMonitoreoResource } from './useMonitoreoResource';

export function useMonitoreoController() {
  const {
    estadoPeriodo,
    loadingEstado,
    errorEstado,
    consultarEstadoPeriodo,
    resetEstadoPeriodo,
  } = useMonitoreoResource();

  const {
    lista: periodos,
    loadingLista: loadingPeriodos,
    errorLista: errorPeriodos,
  } = useMonitoreoPeriodosResource();

  const [selectedPeriodId, setSelectedPeriodId] = useState('');

  const selectedPeriodo = useMemo(
    () => periodos.find((periodo) => String(periodo.periodId) === selectedPeriodId) ?? null,
    [periodos, selectedPeriodId]
  );

  const options = useMemo(
    () =>
      periodos.map((periodo) => ({
        label: formatPeriodoOptionLabel(periodo),
        value: String(periodo.periodId),
      })),
    [periodos]
  );

  const handleSelectPeriod = useCallback(
    async (value: string) => {
      setSelectedPeriodId(value);

      const periodoId = Number(value);
      if (!Number.isFinite(periodoId) || periodoId <= 0) {
        resetEstadoPeriodo();
        return;
      }

      try {
        await consultarEstadoPeriodo(periodoId);
        toast.success('Estado del periodo consultado correctamente.');
      } catch {
        toast.error('No se pudo consultar el estado del periodo.');
      }
    },
    [consultarEstadoPeriodo, resetEstadoPeriodo]
  );

  const helperText = useMemo(() => {
    if (loadingPeriodos) return 'Cargando periodos disponibles...';
    if (errorPeriodos) return errorPeriodos;
    if (selectedPeriodo) return '';
    if (options.length === 0) return 'No hay periodos disponibles.';
    return 'Selecciona un periodo existente.';
  }, [errorPeriodos, loadingPeriodos, options.length, selectedPeriodo]);

  return {
    estadoPeriodo,
    loadingEstado,
    errorEstado,
    selectedPeriodId,
    selectedPeriodo,
    options,
    helperText,
    loadingPeriodos,
    activeError: errorEstado ?? errorPeriodos,
    handleSelectPeriod,
  };
}
