'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useNominaBusquedaRecibos } from '../../../hook/useNominaBusquedaRecibos';
import { buildSummary } from '../utils/nomina-busqueda-recibos-view.utils';
import type { NominaBusquedaRecibosFormState } from '../types/nomina-busqueda-recibos-view.types';

export function useNominaBusquedaRecibosView() {
  const domain = useNominaBusquedaRecibos();

  const [form, setForm] = useState<NominaBusquedaRecibosFormState>({
    claveSp: '',
    periodCode: '',
  });

  const updateField = useCallback(
    (key: keyof NominaBusquedaRecibosFormState, value: string) => {
      setForm((current) => ({
        ...current,
        [key]: value,
      }));
    },
    []
  );

  const canSearch = useMemo(() => {
    return Boolean(form.claveSp.trim() && form.periodCode.trim());
  }, [form.claveSp, form.periodCode]);

  const executeSearch = useCallback(async () => {
    const clave = form.claveSp.trim();
    const period = form.periodCode.trim();

    if (!clave || !period) {
      toast.error('Debes capturar clave SP y period code.');
      return;
    }

    try {
      await domain.consultar({
        claveSp: clave,
        periodCode: period,
      });

      toast.success('Recibos consultados correctamente.');
    } catch {
      toast.error('No se pudo consultar la búsqueda de recibos.');
    }
  }, [domain, form.claveSp, form.periodCode]);

  const summaryItems = useMemo(
    () =>
      buildSummary({
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