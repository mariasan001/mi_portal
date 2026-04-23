'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useNominaAuditoria } from '@/features/admin/hooks/useNominaAuditoria';
import {
  buildAuditSummary,
  buildCancellationFilters,
  buildReleaseFilters,
  PAGE_SIZE,
} from '../model/auditoria.selectors';
import type {
  AuditCancellationsQuery,
  AuditReleasesQuery,
  AuditoriaAction,
  AuditoriaCancellationFormState,
  AuditoriaReleaseFormState,
} from '../model/auditoria.types';

export function useAuditoriaController() {
  const domain = useNominaAuditoria();
  const [activeAction, setActiveAction] = useState<AuditoriaAction>('liberaciones');
  const [releaseForm, setReleaseForm] = useState<AuditoriaReleaseFormState>({
    versionId: '',
    payPeriodCode: '',
    stage: '',
  });
  const [cancellationForm, setCancellationForm] =
    useState<AuditoriaCancellationFormState>({
      receiptId: '',
      claveSp: '',
      payPeriodCode: '',
      receiptPeriodCode: '',
      nominaTipo: '',
    });
  const [releasePage, setReleasePage] = useState(1);
  const [cancellationPage, setCancellationPage] = useState(1);
  const [submittedReleaseFilters, setSubmittedReleaseFilters] = useState<
    Omit<AuditReleasesQuery, 'limit' | 'offset'> | null
  >(null);
  const [submittedCancellationFilters, setSubmittedCancellationFilters] = useState<
    Omit<AuditCancellationsQuery, 'limit' | 'offset'> | null
  >(null);

  const updateReleaseField = useCallback(
    (key: keyof AuditoriaReleaseFormState, value: string) => {
      setReleaseForm((current) => ({ ...current, [key]: value }));
    },
    []
  );

  const updateCancellationField = useCallback(
    (key: keyof AuditoriaCancellationFormState, value: string) => {
      setCancellationForm((current) => ({ ...current, [key]: value }));
    },
    []
  );

  const consultarLiberaciones = useCallback(
    async (
      page: number,
      filters: Omit<AuditReleasesQuery, 'limit' | 'offset'>,
      shouldToast = true
    ) => {
      try {
        await domain.consultarLiberaciones({
          ...filters,
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
        });
        setSubmittedReleaseFilters(filters);
        setReleasePage(page);
        if (shouldToast) {
          toast.success('Auditoria de liberaciones consultada.');
        }
      } catch {
        if (shouldToast) {
          toast.error('No se pudo consultar la auditoria de liberaciones.');
        }
      }
    },
    [domain]
  );

  const consultarCancelaciones = useCallback(
    async (
      page: number,
      filters: Omit<AuditCancellationsQuery, 'limit' | 'offset'>,
      shouldToast = true
    ) => {
      try {
        await domain.consultarCancelaciones({
          ...filters,
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
        });
        setSubmittedCancellationFilters(filters);
        setCancellationPage(page);
        if (shouldToast) {
          toast.success('Auditoria de cancelaciones consultada.');
        }
      } catch {
        if (shouldToast) {
          toast.error('No se pudo consultar la auditoria de cancelaciones.');
        }
      }
    },
    [domain]
  );

  const executeActiveAction = useCallback(async () => {
    if (activeAction === 'liberaciones') {
      await consultarLiberaciones(1, buildReleaseFilters(releaseForm));
      return;
    }

    await consultarCancelaciones(1, buildCancellationFilters(cancellationForm));
  }, [
    activeAction,
    cancellationForm,
    consultarCancelaciones,
    consultarLiberaciones,
    releaseForm,
  ]);

  const goToPage = useCallback(
    async (page: number) => {
      if (page < 1) return;

      if (activeAction === 'liberaciones') {
        const filters = submittedReleaseFilters ?? buildReleaseFilters(releaseForm);
        await consultarLiberaciones(page, filters, false);
        return;
      }

      const filters =
        submittedCancellationFilters ?? buildCancellationFilters(cancellationForm);
      await consultarCancelaciones(page, filters, false);
    },
    [
      activeAction,
      cancellationForm,
      consultarCancelaciones,
      consultarLiberaciones,
      releaseForm,
      submittedCancellationFilters,
      submittedReleaseFilters,
    ]
  );

  const currentLoading =
    activeAction === 'liberaciones'
      ? domain.releases.loading
      : domain.cancellations.loading;

  const currentError =
    activeAction === 'liberaciones'
      ? domain.releases.error
      : domain.cancellations.error;

  const currentData =
    activeAction === 'liberaciones'
      ? domain.releases.data
      : domain.cancellations.data;

  const currentTitle =
    activeAction === 'liberaciones'
      ? 'Auditoria de liberaciones'
      : 'Auditoria de cancelaciones';

  const currentDescription =
    activeAction === 'liberaciones'
      ? 'Consulta la bitacora por version, periodo o etapa.'
      : 'Consulta la bitacora por recibo o llave de negocio.';

  const summaryItems = useMemo(
    () =>
      buildAuditSummary({
        total: currentData?.total,
        limit: currentData?.limit,
        offset: currentData?.offset,
      }),
    [currentData]
  );

  const currentPage =
    activeAction === 'liberaciones' ? releasePage : cancellationPage;

  const totalPages = useMemo(() => {
    const total = currentData?.total ?? 0;
    const limit = currentData?.limit ?? PAGE_SIZE;
    if (total <= 0 || limit <= 0) return 1;
    return Math.max(1, Math.ceil(total / limit));
  }, [currentData]);

  const hasResults = Boolean((currentData?.items ?? []).length);

  return {
    activeAction,
    setActiveAction,
    releaseForm,
    cancellationForm,
    updateReleaseField,
    updateCancellationField,
    executeActiveAction,
    currentLoading,
    currentError,
    currentData,
    currentTitle,
    currentDescription,
    summaryItems,
    hasResults,
    currentPage,
    totalPages,
    goToPage,
  };
}
