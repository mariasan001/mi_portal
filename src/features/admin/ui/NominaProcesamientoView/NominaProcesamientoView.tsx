'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import s from './NominaProcesamientoView.module.css';
import { useNominaProcesamiento } from '../../hooks/useNominaProcesamiento';

import EmptyState from './components/EmptyState';
import NominaProcesamientoHero from './components/NominaProcesamientoHero';
import NominaProcesamientoEntityCards from './components/NominaProcesamientoEntityCards';
import NominaProcesamientoToolbar from './components/NominaProcesamientoToolbar';
import NominaProcesamientoContentHeader from './components/NominaProcesamientoContentHeader';
import NominaProcesamientoSummaryPanel from './components/NominaProcesamientoSummaryPanel';
import NominaProcesamientoPreviewTable from './components/NominaProcesamientoPreviewTable';
import NominaProcesamientoErrorsTable from './components/NominaProcesamientoErrorsTable';
import { getProcesamientoDefaultLimit, getProcesamientoEmptyState, getProcesamientoResultHeader } from './utils/Nomina-procesamiento-view.utils';


type ProcesamientoView = 'summary' | 'preview' | 'errors';

export default function NominaProcesamientoView() {
  const {
    summary,
    previewRows,
    errorRows,
    loadingSummary,
    loadingPreview,
    loadingErrors,
    errorSummary,
    errorPreview,
    errorErrors,
    consultarSummary,
    consultarPreview,
    consultarErrors,
  } = useNominaProcesamiento();

  const [activeView, setActiveView] = useState<ProcesamientoView>('summary');
  const [fileId, setFileId] = useState('');
  const [limit, setLimit] = useState(getProcesamientoDefaultLimit('summary'));

  const loadingMap = useMemo(
    () => ({
      summary: loadingSummary,
      preview: loadingPreview,
      errors: loadingErrors,
    }),
    [loadingSummary, loadingPreview, loadingErrors]
  );

  const errorMap = useMemo(
    () => ({
      summary: errorSummary,
      preview: errorPreview,
      errors: errorErrors,
    }),
    [errorSummary, errorPreview, errorErrors]
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
        summary,
        previewRows,
        errorRows,
      }),
    [activeView, summary, previewRows, errorRows]
  );

  const emptyState = useMemo(
    () => getProcesamientoEmptyState(activeView),
    [activeView]
  );

  const handleViewChange = (view: ProcesamientoView) => {
    setActiveView(view);
    setLimit(getProcesamientoDefaultLimit(view));
  };

  const handleConsult = async () => {
    const numericFileId = Number(fileId);
    const numericLimit = Number(limit);

    if (!Number.isFinite(numericFileId) || numericFileId <= 0) {
      toast.warning('Captura un fileId válido.');
      return;
    }

    if (
      (activeView === 'preview' || activeView === 'errors') &&
      (!Number.isFinite(numericLimit) || numericLimit <= 0)
    ) {
      toast.warning('Captura un límite válido.');
      return;
    }

    try {
      const actions = {
        summary: async () => {
          await consultarSummary(numericFileId);
          toast.success('Resumen consultado correctamente.');
        },
        preview: async () => {
          await consultarPreview(numericFileId, numericLimit);
          toast.success('Preview consultado correctamente.');
        },
        errors: async () => {
          await consultarErrors(numericFileId, numericLimit);
          toast.success('Errores consultados correctamente.');
        },
      };

      await actions[activeView]();
    } catch {
      const errorMessages = {
        summary: 'No se pudo consultar el resumen.',
        preview: 'No se pudo consultar el preview.',
        errors: 'No se pudo consultar el detalle de errores.',
      };

      toast.error(errorMessages[activeView]);
    }
  };

  const handleReset = () => {
    setFileId('');
    setLimit(getProcesamientoDefaultLimit(activeView));
  };

  const renderContent = () => {
    if (activeView === 'summary') {
      return summary ? (
        <NominaProcesamientoSummaryPanel detalle={summary} />
      ) : (
        <EmptyState
          title={emptyState.title}
          description={emptyState.description}
        />
      );
    }

    if (activeView === 'preview') {
      return previewRows.length ? (
        <NominaProcesamientoPreviewTable rows={previewRows} />
      ) : (
        <EmptyState
          title={emptyState.title}
          description={emptyState.description}
        />
      );
    }

    return errorRows.length ? (
      <NominaProcesamientoErrorsTable rows={errorRows} />
    ) : (
      <EmptyState title={emptyState.title} description={emptyState.description} />
    );
  };

  return (
    <section className={s.page}>
      <div className={s.stack}>
        <NominaProcesamientoHero />

        <NominaProcesamientoEntityCards
          activeView={activeView}
          onSelect={handleViewChange}
        />

        <NominaProcesamientoToolbar
          activeView={activeView}
          fileId={fileId}
          limit={limit}
          loading={loading}
          canSubmit={canSubmit}
          onFileIdChange={setFileId}
          onLimitChange={setLimit}
          onConsult={handleConsult}
          onReset={handleReset}
        />

        {currentError ? <p className={s.error}>{currentError}</p> : null}

        <div className={s.resultCard}>
          <NominaProcesamientoContentHeader
            eyebrow={resultHeader.eyebrow}
            title={resultHeader.title}
            description={resultHeader.description}
          />

          {renderContent()}
        </div>
      </div>
    </section>
  );
}