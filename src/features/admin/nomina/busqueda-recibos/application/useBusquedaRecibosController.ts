'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { buildBusquedaRecibosSummary } from '../model/busqueda-recibos.selectors';
import type { BusquedaRecibosFormState } from '../model/busqueda-recibos.types';
import { useBusquedaRecibosResource } from './useBusquedaRecibosResource';

export function useBusquedaRecibosController() {
  const domain = useBusquedaRecibosResource();
  const [form, setForm] = useState<BusquedaRecibosFormState>({
    claveSp: '',
    periodCode: '',
  });

  const updateField = useCallback(
    (key: keyof BusquedaRecibosFormState, value: string) => {
      setForm((current) => ({
        ...current,
        [key]: value,
      }));
    },
    []
  );

  const canSearch = useMemo(
    () => Boolean(form.claveSp.trim() && form.periodCode.trim()),
    [form.claveSp, form.periodCode]
  );

  const executeSearch = useCallback(async () => {
    const claveSp = form.claveSp.trim();
    const periodCode = form.periodCode.trim();

    if (!claveSp || !periodCode) {
      toast.error('Debes capturar la clave SP y el período a consultar.');
      return;
    }

    try {
      await domain.consultar({
        claveSp,
        periodCode,
      });

      toast.success('Recibos consultados correctamente.');
    } catch {
      toast.error('No se pudo consultar la búsqueda de recibos.');
    }
  }, [domain, form.claveSp, form.periodCode]);

  const summaryItems = useMemo(
    () =>
      buildBusquedaRecibosSummary({
        claveSp: domain.data?.claveSp,
        searchedPeriodCode: domain.data?.searchedPeriodCode,
        totalReceipts: domain.data?.totalReceipts,
      }),
    [domain.data]
  );

  const hasResults = Boolean((domain.data?.receipts ?? []).length);

  return {
    form,
    updateField,
    canSearch,
    executeSearch,
    loading: domain.loading,
    error: domain.error,
    data: domain.data,
    summaryItems,
    hasResults,
  };
}
