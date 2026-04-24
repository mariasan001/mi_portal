'use client';

import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';
import NominaSectionHeader from '@/features/admin/nomina/shared/ui/NominaSectionHeader/NominaSectionHeader';
import { AlertTriangle, Eye, FileSpreadsheet } from 'lucide-react';
import NominaProcesamientoEntityCards from './components/NominaProcesamientoEntityCards';
import NominaProcesamientoErrorsTable from './components/NominaProcesamientoErrorsTable';
import NominaProcesamientoPreviewTable from './components/NominaProcesamientoPreviewTable';
import NominaProcesamientoSummaryPanel from './components/NominaProcesamientoSummaryPanel';
import NominaProcesamientoToolbar from './components/NominaProcesamientoToolbar';
import s from './ProcesamientoPage.module.css';
import { useProcesamientoController } from '../application/useProcesamientoController';

export default function ProcesamientoPage() {
  const vm = useProcesamientoController();

  const renderContent = () => {
    if (vm.activeView === 'summary') {
      return vm.summary ? (
        <NominaProcesamientoSummaryPanel detalle={vm.summary} />
      ) : (
        <NominaEmptyState
          title={vm.emptyState.title}
          description={vm.emptyState.description}
          variant={vm.hasConsultedSummary ? 'search' : 'inbox'}
        />
      );
    }

    if (vm.activeView === 'preview') {
      return vm.previewRows.length ? (
        <NominaProcesamientoPreviewTable rows={vm.previewRows} />
      ) : (
        <NominaEmptyState
          title={vm.emptyState.title}
          description={vm.emptyState.description}
          variant={vm.hasConsultedPreview ? 'search' : 'inbox'}
        />
      );
    }

    if (vm.errorRows.length) {
      return <NominaProcesamientoErrorsTable rows={vm.errorRows} />;
    }

    if (vm.hasConsultedErrors) {
      return (
        <NominaEmptyState
          title="Sin errores detectados"
          description="La consulta se realizó correctamente y no se encontraron filas con incidencias para este archivo."
          variant="success"
        />
      );
    }

    return (
      <NominaEmptyState
        title={vm.emptyState.title}
        description={vm.emptyState.description}
        variant="inbox"
      />
    );
  };

  return (
    <AdminPageShell>
      <NominaHero
        kicker="Nómina"
        title="Revisión del procesamiento"
        subtitle="Consulta el resumen del staging, una muestra de filas procesadas y el detalle de filas con error por archivo."
        badges={[
          { icon: FileSpreadsheet, label: 'Archivo' },
          { icon: Eye, label: 'Preview' },
          { icon: AlertTriangle, label: 'Errores' },
        ]}
      />

      <NominaProcesamientoEntityCards
        activeView={vm.activeView}
        onSelect={vm.setActiveView}
      />

      <NominaProcesamientoToolbar
        activeView={vm.activeView}
        fileId={vm.fileId}
        limit={vm.limit}
        loading={vm.loading}
        canSubmit={vm.canSubmit}
        onFileIdChange={vm.setFileId}
        onLimitChange={vm.setLimit}
        onConsult={vm.handleConsult}
        onReset={vm.handleReset}
      />

      {vm.currentError ? (
        <AdminInlineMessage title="Ocurrió un problema" tone="error">
          {vm.currentError}
        </AdminInlineMessage>
      ) : null}

      <AdminSurface as="div" className={s.resultCard}>
        <NominaSectionHeader
          eyebrow={vm.resultHeader.eyebrow}
          title={vm.resultHeader.title}
          description={vm.resultHeader.description}
        />

        {renderContent()}
      </AdminSurface>
    </AdminPageShell>
  );
}
