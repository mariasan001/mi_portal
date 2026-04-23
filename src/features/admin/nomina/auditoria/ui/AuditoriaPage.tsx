'use client';

import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import type {
  AuditCancellationItemDto,
  AuditReleaseItemDto,
} from '@/features/admin/nomina/auditoria/model/auditoria.types';
import EmptyState from '@/features/admin/ui/NominaAuditoriaView/components/EmptyState';
import NominaAuditoriaActionCards from '@/features/admin/ui/NominaAuditoriaView/components/NominaAuditoriaActionCards';
import NominaAuditoriaContentHeader from '@/features/admin/ui/NominaAuditoriaView/components/NominaAuditoriaContentHeader';
import NominaAuditoriaHero from '@/features/admin/ui/NominaAuditoriaView/components/NominaAuditoriaHero';
import NominaAuditoriaResultsSection from '@/features/admin/ui/NominaAuditoriaView/components/NominaAuditoriaResultsSection';
import NominaAuditoriaToolbar from '@/features/admin/ui/NominaAuditoriaView/components/NominaAuditoriaToolbar';
import s from '@/features/admin/ui/NominaAuditoriaView/NominaAuditoriaView.module.css';
import { useAuditoriaController } from '../application/useAuditoriaController';

export default function AuditoriaPage() {
  const vm = useAuditoriaController();

  const releaseItems: AuditReleaseItemDto[] =
    vm.activeAction === 'liberaciones'
      ? ((vm.currentData?.items as AuditReleaseItemDto[] | undefined) ?? [])
      : [];

  const cancellationItems: AuditCancellationItemDto[] =
    vm.activeAction === 'cancelaciones'
      ? ((vm.currentData?.items as AuditCancellationItemDto[] | undefined) ?? [])
      : [];

  return (
    <AdminPageShell>
      <NominaAuditoriaHero />

      <NominaAuditoriaActionCards
        activeAction={vm.activeAction}
        onSelect={vm.setActiveAction}
      />

      <NominaAuditoriaToolbar
        activeAction={vm.activeAction}
        releaseForm={vm.releaseForm}
        cancellationForm={vm.cancellationForm}
        loading={vm.currentLoading}
        onUpdateReleaseField={vm.updateReleaseField}
        onUpdateCancellationField={vm.updateCancellationField}
        onExecute={vm.executeActiveAction}
      />

      <AdminSurface as="section" className={s.resultContainer}>
        <NominaAuditoriaContentHeader
          eyebrow="Resultado"
          title={vm.currentTitle}
          description={vm.currentDescription}
          summaryItems={vm.summaryItems}
          showSummary={vm.hasResults}
        />

        {vm.currentError ? (
          <AdminInlineMessage title="Ocurrio un problema" tone="error">
            {vm.currentError}
          </AdminInlineMessage>
        ) : null}

        {vm.hasResults ? (
          <NominaAuditoriaResultsSection
            activeAction={vm.activeAction}
            releases={releaseItems}
            cancellations={cancellationItems}
            currentPage={vm.currentPage}
            totalPages={vm.totalPages}
            onPageChange={vm.goToPage}
          />
        ) : (
          <EmptyState
            title="Aun no hay resultados para mostrar"
            description="Selecciona una auditoria, captura los filtros necesarios y ejecuta la consulta."
            variant="search"
          />
        )}
      </AdminSurface>
    </AdminPageShell>
  );
}
