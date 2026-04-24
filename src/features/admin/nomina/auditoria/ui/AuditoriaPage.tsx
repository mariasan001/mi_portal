'use client';

import { useMemo } from 'react';

import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';
import NominaSectionHeader from '@/features/admin/nomina/shared/ui/NominaSectionHeader/NominaSectionHeader';
import type {
  AuditCancellationItemDto,
  AuditReleaseItemDto,
} from '@/features/admin/nomina/auditoria/model/auditoria.types';
import { FileSearch, Shield } from 'lucide-react';
import NominaAuditoriaActionCards from './components/NominaAuditoriaActionCards';
import NominaAuditoriaResultsSection from './components/NominaAuditoriaResultsSection';
import NominaAuditoriaToolbar from './components/NominaAuditoriaToolbar';
import s from './AuditoriaPage.module.css';
import { useAuditoriaController } from '../application/useAuditoriaController';

export default function AuditoriaPage() {
  const vm = useAuditoriaController();

  const releaseItems = useMemo<AuditReleaseItemDto[]>(
    () =>
      vm.activeAction === 'liberaciones'
        ? ((vm.currentData?.items as AuditReleaseItemDto[] | undefined) ?? [])
        : [],
    [vm.activeAction, vm.currentData]
  );

  const cancellationItems = useMemo<AuditCancellationItemDto[]>(
    () =>
      vm.activeAction === 'cancelaciones'
        ? ((vm.currentData?.items as AuditCancellationItemDto[] | undefined) ?? [])
        : [],
    [vm.activeAction, vm.currentData]
  );

  const emptyState = useMemo(
    () =>
      vm.activeAction === 'liberaciones'
        ? {
            title: 'Aún no hay liberaciones para mostrar',
            description:
              'Captura versión, período o etapa y ejecuta la consulta para revisar la trazabilidad administrativa.',
          }
        : {
            title: 'Aún no hay cancelaciones para mostrar',
            description:
              'Captura los identificadores o períodos del recibo y ejecuta la consulta para revisar la trazabilidad administrativa.',
          },
    [vm.activeAction]
  );

  return (
    <AdminPageShell>
      <NominaHero
        kicker="Nómina"
        title="Auditoría de nómina"
        subtitle="Consulta eventos de liberación y cancelación con filtros por versión, período, etapa, recibo o llave de negocio."
        badges={[
          { icon: FileSearch, label: 'Auditoría' },
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
        <NominaSectionHeader
          eyebrow="Resultado"
          title={vm.currentTitle}
          description={vm.currentDescription}
          summaryItems={vm.summaryItems}
          showSummary={vm.hasResults}
          summaryColumns={3}
        />

        {vm.currentError ? (
          <AdminInlineMessage title="Ocurrió un problema" tone="error">
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
            title={emptyState.title}
            description={emptyState.description}
            variant="search"
          />
        )}
      </AdminSurface>
    </AdminPageShell>
  );
}
