'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useNominaAuditoria } from '../../../hook/useNominaAuditoria';
import { buildAuditSummary, parseOptionalNumber } from '../utils/nomina-auditoria-view.utils';
import type {
  NominaAuditoriaAction,
  NominaAuditoriaCancellationFormState,
  NominaAuditoriaReleaseFormState,
} from '../types/nomina-auditoria-view.types';

export function useNominaAuditoriaView() {
  const domain = useNominaAuditoria();

  const [activeAction, setActiveAction] =
    useState<NominaAuditoriaAction>('liberaciones');

  const [releaseForm, setReleaseForm] = useState<NominaAuditoriaReleaseFormState>({
    versionId: '',
    payPeriodCode: '',
    stage: '',
    limit: '20',
    offset: '0',
  });

  const [cancellationForm, setCancellationForm] =
    useState<NominaAuditoriaCancellationFormState>({
      receiptId: '',
      claveSp: '',
      payPeriodCode: '',
      receiptPeriodCode: '',
      nominaTipo: '',
      limit: '20',
      offset: '0',
    });

  const releaseQuery = useMemo(
    () => ({
      versionId: parseOptionalNumber(releaseForm.versionId),
      payPeriodCode: releaseForm.payPeriodCode.trim() || undefined,
      stage: releaseForm.stage.trim() || undefined,
      limit: parseOptionalNumber(releaseForm.limit) ?? 20,
      offset: parseOptionalNumber(releaseForm.offset) ?? 0,
    }),
    [releaseForm]
  );

  const cancellationQuery = useMemo(
    () => ({
      receiptId: parseOptionalNumber(cancellationForm.receiptId),
      claveSp: cancellationForm.claveSp.trim() || undefined,
      payPeriodCode: cancellationForm.payPeriodCode.trim() || undefined,
      receiptPeriodCode: cancellationForm.receiptPeriodCode.trim() || undefined,
      nominaTipo: parseOptionalNumber(cancellationForm.nominaTipo),
      limit: parseOptionalNumber(cancellationForm.limit) ?? 20,
      offset: parseOptionalNumber(cancellationForm.offset) ?? 0,
    }),
    [cancellationForm]
  );

  const updateReleaseField = useCallback(
    (key: keyof NominaAuditoriaReleaseFormState, value: string) => {
      setReleaseForm((current) => ({
        ...current,
        [key]: value,
      }));
    },
    []
  );

  const updateCancellationField = useCallback(
    (key: keyof NominaAuditoriaCancellationFormState, value: string) => {
      setCancellationForm((current) => ({
        ...current,
        [key]: value,
      }));
    },
    []
  );

  const consultarLiberaciones = useCallback(async () => {
    try {
      await domain.consultarLiberaciones(releaseQuery);
      toast.success('Auditoría de liberaciones consultada.');
    } catch {
      toast.error('No se pudo consultar la auditoría de liberaciones.');
    }
  }, [domain, releaseQuery]);

  const consultarCancelaciones = useCallback(async () => {
    try {
      await domain.consultarCancelaciones(cancellationQuery);
      toast.success('Auditoría de cancelaciones consultada.');
    } catch {
      toast.error('No se pudo consultar la auditoría de cancelaciones.');
    }
  }, [domain, cancellationQuery]);

  const executeActiveAction = useCallback(async () => {
    if (activeAction === 'liberaciones') {
      await consultarLiberaciones();
      return;
    }

    await consultarCancelaciones();
  }, [activeAction, consultarLiberaciones, consultarCancelaciones]);

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
      ? 'Auditoría de liberaciones'
      : 'Auditoría de cancelaciones';

  const currentDescription =
    activeAction === 'liberaciones'
      ? 'Consulta la bitácora por versión, periodo o etapa.'
      : 'Consulta la bitácora por recibo o llave de negocio.';

  const summaryItems = useMemo(
    () =>
      buildAuditSummary({
        total: currentData?.total,
        limit: currentData?.limit,
        offset: currentData?.offset,
      }),
    [currentData]
  );

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
  };
}