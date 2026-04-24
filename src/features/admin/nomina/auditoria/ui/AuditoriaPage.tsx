'use client';

import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';
import type {
  AuditCancellationItemDto,
  AuditReleaseItemDto,
} from '@/features/admin/nomina/auditoria/model/auditoria.types';
import { FileSearch, Shield } from 'lucide-react';
import NominaAuditoriaActionCards from './components/NominaAuditoriaActionCards';
import NominaAuditoriaContentHeader from './components/NominaAuditoriaContentHeader';
import NominaAuditoriaResultsSection from './components/NominaAuditoriaResultsSection';
import NominaAuditoriaToolbar from './components/NominaAuditoriaToolbar';
import s from './AuditoriaPage.module.css';
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
      <NominaHero
        kicker="Nomina"
        title="Auditoria de Nomina"
        subtitle="Consulta eventos de liberacion y cancelacion con filtros por version, periodo, etapa, recibo o llave de negocio."
        badges={[
          { icon: FileSearch, label: 'Auditoria' },
          { icon: Shield, label: 'Trazabilidad y consulta' },
        ]}
      />

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
          <NominaEmptyState
            title="Aun no hay resultados para mostrar"
            description="Selecciona una auditoria, captura los filtros necesarios y ejecuta la consulta."
            variant="search"
          />
        )}
      </AdminSurface>
    </AdminPageShell>
  );
}
