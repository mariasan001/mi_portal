'use client';

import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import EmptyState from '@/features/admin/ui/NominaProcesamientoView/components/EmptyState';
import NominaProcesamientoContentHeader from '@/features/admin/ui/NominaProcesamientoView/components/NominaProcesamientoContentHeader';
import NominaProcesamientoEntityCards from '@/features/admin/ui/NominaProcesamientoView/components/NominaProcesamientoEntityCards';
import NominaProcesamientoErrorsTable from '@/features/admin/ui/NominaProcesamientoView/components/NominaProcesamientoErrorsTable';
import NominaProcesamientoHero from '@/features/admin/ui/NominaProcesamientoView/components/NominaProcesamientoHero';
import NominaProcesamientoPreviewTable from '@/features/admin/ui/NominaProcesamientoView/components/NominaProcesamientoPreviewTable';
import NominaProcesamientoSummaryPanel from '@/features/admin/ui/NominaProcesamientoView/components/NominaProcesamientoSummaryPanel';
import NominaProcesamientoToolbar from '@/features/admin/ui/NominaProcesamientoView/components/NominaProcesamientoToolbar';
import s from '@/features/admin/ui/NominaProcesamientoView/NominaProcesamientoView.module.css';
import { useProcesamientoController } from '../application/useProcesamientoController';

export default function ProcesamientoPage() {
  const vm = useProcesamientoController();

  const renderContent = () => {
    if (vm.activeView === 'summary') {
      return vm.summary ? (
        <NominaProcesamientoSummaryPanel detalle={vm.summary} />
      ) : (
        <EmptyState
          title={vm.emptyState.title}
          description={vm.emptyState.description}
          variant={vm.hasConsultedSummary ? 'search' : 'default'}
        />
      );
    }

    if (vm.activeView === 'preview') {
      return vm.previewRows.length ? (
        <NominaProcesamientoPreviewTable rows={vm.previewRows} />
      ) : (
        <EmptyState
          title={vm.emptyState.title}
          description={vm.emptyState.description}
          variant={vm.hasConsultedPreview ? 'search' : 'default'}
        />
      );
    }

    if (vm.errorRows.length) {
      return <NominaProcesamientoErrorsTable rows={vm.errorRows} />;
    }

    if (vm.hasConsultedErrors) {
      return (
        <EmptyState
          title="Sin errores detectados"
          description="La consulta se realizo correctamente y no se encontraron filas con incidencias para este archivo."
          variant="success"
        />
      );
    }

    return (
      <EmptyState
        title={vm.emptyState.title}
        description={vm.emptyState.description}
        variant="default"
      />
    );
  };

  return (
    <AdminPageShell>
      <NominaProcesamientoHero />

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
        <AdminInlineMessage title="Ocurrio un problema" tone="error">
          {vm.currentError}
        </AdminInlineMessage>
      ) : null}

      <AdminSurface as="div" className={s.resultCard}>
        <NominaProcesamientoContentHeader
          eyebrow={vm.resultHeader.eyebrow}
          title={vm.resultHeader.title}
          description={vm.resultHeader.description}
        />

        {renderContent()}
      </AdminSurface>
    </AdminPageShell>
  );
}
