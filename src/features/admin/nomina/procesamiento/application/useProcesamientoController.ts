'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { ProcesamientoView } from '../model/procesamiento.types';
import {
  getProcesamientoDefaultLimit,
  getProcesamientoEmptyState,
  getProcesamientoResultHeader,
} from '../model/procesamiento.selectors';
import { useProcesamientoResource } from './useProcesamientoResource';

export function useProcesamientoController() {
  const domain = useProcesamientoResource();
  const [activeView, setActiveView] = useState<ProcesamientoView>('summary');
  const [fileId, setFileId] = useState('');
  const [limit, setLimit] = useState(getProcesamientoDefaultLimit('summary'));
  const [hasConsultedSummary, setHasConsultedSummary] = useState(false);
  const [hasConsultedPreview, setHasConsultedPreview] = useState(false);
  const [hasConsultedErrors, setHasConsultedErrors] = useState(false);

  const loadingMap = useMemo(
    () => ({
      summary: domain.loadingSummary,
      preview: domain.loadingPreview,
      errors: domain.loadingErrors,
    }),
    [domain.loadingErrors, domain.loadingPreview, domain.loadingSummary]
  );

  const errorMap = useMemo(
    () => ({
      summary: domain.errorSummary,
      preview: domain.errorPreview,
      errors: domain.errorErrors,
    }),
    [domain.errorErrors, domain.errorPreview, domain.errorSummary]
  );

  const loading = loadingMap[activeView];
  const currentError = errorMap[activeView];

  const canSubmit = useMemo(() => {
    const numericFileId = Number(fileId);
    const numericLimit = Number(limit);

    if (activeView === 'summary') {
      return numericFileId > 0 && !loading;
    }

    return numericFileId > 0 && numericLimit > 0 && !loading;
  }, [activeView, fileId, limit, loading]);

  const resultHeader = useMemo(
    () =>
      getProcesamientoResultHeader({
        activeView,
        summary: domain.summary,
        previewRows: domain.previewRows,
        errorRows: domain.errorRows,
      }),
    [activeView, domain.errorRows, domain.previewRows, domain.summary]
  );

  const emptyState = useMemo(
    () => getProcesamientoEmptyState(activeView),
    [activeView]
  );

  const handleViewChange = useCallback((view: ProcesamientoView) => {
    setActiveView(view);
    setLimit(getProcesamientoDefaultLimit(view));
  }, []);

  const handleConsult = useCallback(async () => {
    const numericFileId = Number(fileId);
    const numericLimit = Number(limit);

    if (!Number.isFinite(numericFileId) || numericFileId <= 0) {
      toast.warning('Captura un identificador de archivo valido.');
      return;
    }

    if (
      (activeView === 'preview' || activeView === 'errors') &&
      (!Number.isFinite(numericLimit) || numericLimit <= 0)
    ) {
      toast.warning('Captura un limite valido.');
      return;
    }

    try {
      const actions = {
        summary: async () => {
          await domain.consultarSummary(numericFileId);
          setHasConsultedSummary(true);
          toast.success('Resumen consultado correctamente.');
        },
        preview: async () => {
          await domain.consultarPreview(numericFileId, numericLimit);
          setHasConsultedPreview(true);
          toast.success('Vista previa consultada correctamente.');
        },
        errors: async () => {
          await domain.consultarErrors(numericFileId, numericLimit);
          setHasConsultedErrors(true);
          toast.success('Errores consultados correctamente.');
        },
      };

      await actions[activeView]();
    } catch {
      const errorMessages = {
        summary: 'No se pudo consultar el resumen.',
        preview: 'No se pudo consultar la vista previa.',
        errors: 'No se pudo consultar el detalle de errores.',
      };

      toast.error(errorMessages[activeView]);
    }
  }, [activeView, domain, fileId, limit]);

  const handleReset = useCallback(() => {
    setFileId('');
    setLimit(getProcesamientoDefaultLimit(activeView));

    if (activeView === 'summary') {
      setHasConsultedSummary(false);
    }

    if (activeView === 'preview') {
      setHasConsultedPreview(false);
    }

    if (activeView === 'errors') {
      setHasConsultedErrors(false);
    }
  }, [activeView]);

  return {
    activeView,
    setActiveView: handleViewChange,
    fileId,
    setFileId,
    limit,
    setLimit,
    loading,
    currentError,
    canSubmit,
    resultHeader,
    emptyState,
    handleConsult,
    handleReset,
    hasConsultedSummary,
    hasConsultedPreview,
    hasConsultedErrors,
    summary: domain.summary,
    previewRows: domain.previewRows,
    errorRows: domain.errorRows,
  };
}
