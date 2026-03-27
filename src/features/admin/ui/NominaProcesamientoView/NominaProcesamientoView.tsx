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
  const [limit, setLimit] = useState('20');

  const loading = useMemo(() => {
    if (activeView === 'summary') return loadingSummary;
    if (activeView === 'preview') return loadingPreview;
    return loadingErrors;
  }, [activeView, loadingSummary, loadingPreview, loadingErrors]);

  const currentError = useMemo(() => {
    if (activeView === 'summary') return errorSummary;
    if (activeView === 'preview') return errorPreview;
    return errorErrors;
  }, [activeView, errorSummary, errorPreview, errorErrors]);

  const canSubmit = useMemo(() => {
    const numericFileId = Number(fileId);
    const numericLimit = Number(limit);

    if (activeView === 'summary') {
      return numericFileId > 0 && !loading;
    }

    return numericFileId > 0 && numericLimit > 0 && !loading;
  }, [activeView, fileId, limit, loading]);

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
      if (activeView === 'summary') {
        await consultarSummary(numericFileId);
        toast.success('Resumen consultado correctamente.');
        return;
      }

      if (activeView === 'preview') {
        await consultarPreview(numericFileId, numericLimit);
        toast.success('Preview consultado correctamente.');
        return;
      }

      await consultarErrors(numericFileId, numericLimit);
      toast.success('Errores consultados correctamente.');
    } catch {
      if (activeView === 'summary') {
        toast.error('No se pudo consultar el resumen.');
        return;
      }

      if (activeView === 'preview') {
        toast.error('No se pudo consultar el preview.');
        return;
      }

      toast.error('No se pudo consultar el detalle de errores.');
    }
  };

  const handleReset = () => {
    setFileId('');
    setLimit(activeView === 'errors' ? '50' : '20');
  };

  const resultHeader = useMemo(() => {
    if (activeView === 'summary') {
      return {
        eyebrow: 'Resultado',
        title: summary
          ? 'Resumen del procesamiento consultado'
          : 'Resumen del procesamiento',
        description: summary
          ? 'Aquí se muestran los indicadores principales y el estado general del archivo procesado.'
          : 'Consulta un fileId para visualizar métricas generales, estatus y conteos clave del procesamiento.',
      };
    }

    if (activeView === 'preview') {
      return {
        eyebrow: 'Resultado',
        title: previewRows.length
          ? 'Vista previa del archivo consultado'
          : 'Preview del archivo',
        description:
          'Revisa una muestra de filas procesadas para validar la información operativa del archivo.',
      };
    }

    return {
      eyebrow: 'Resultado',
      title: errorRows.length
        ? 'Detalle de errores consultados'
        : 'Filas con error',
      description:
        'Consulta filas con incidencias detectadas durante el procesamiento para revisar el motivo del error.',
    };
  }, [activeView, summary, previewRows.length, errorRows.length]);

  return (
    <section className={s.page}>
      <div className={s.stack}>
        <NominaProcesamientoHero />

        <NominaProcesamientoEntityCards
          activeView={activeView}
          onSelect={setActiveView}
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

          {activeView === 'summary' ? (
            summary ? (
              <NominaProcesamientoSummaryPanel detalle={summary} />
            ) : (
              <EmptyState
                title="Aún no has consultado ningún resumen"
                description="Captura un fileId válido para revisar las métricas generales del archivo procesado."
              />
            )
          ) : null}

          {activeView === 'preview' ? (
            previewRows.length ? (
              <NominaProcesamientoPreviewTable rows={previewRows} />
            ) : (
              <EmptyState
                title="Aún no has cargado una vista previa"
                description="Consulta un fileId y un límite para visualizar una muestra de filas procesadas."
              />
            )
          ) : null}

          {activeView === 'errors' ? (
            errorRows.length ? (
              <NominaProcesamientoErrorsTable rows={errorRows} />
            ) : (
              <EmptyState
                title="Aún no has consultado filas con error"
                description="Consulta un fileId y un límite para revisar las incidencias detectadas en el procesamiento."
              />
            )
          ) : null}
        </div>
      </div>
    </section>
  );
}