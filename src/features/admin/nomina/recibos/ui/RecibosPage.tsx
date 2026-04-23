'use client';

import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import EmptyState from '@/features/admin/ui/NominaRecibosView/components/EmptyState';
import NominaRecibosActionCards from '@/features/admin/ui/NominaRecibosView/components/NominaRecibosActionCards';
import NominaRecibosContentHeader from '@/features/admin/ui/NominaRecibosView/components/NominaRecibosContentHeader';
import NominaRecibosHero from '@/features/admin/ui/NominaRecibosView/components/NominaRecibosHero';
import NominaRecibosReleasePanel from '@/features/admin/ui/NominaRecibosView/components/NominaRecibosReleasePanel';
import NominaRecibosResultsSection from '@/features/admin/ui/NominaRecibosView/components/NominaRecibosResultsSection';
import NominaRecibosToolbar from '@/features/admin/ui/NominaRecibosView/components/NominaRecibosToolbar';
import s from '@/features/admin/ui/NominaRecibosView/NominaRecibosView.module.css';
import { useRecibosController } from '../application/useRecibosController';

export default function RecibosPage() {
  const vm = useRecibosController();

  return (
    <AdminPageShell>
      <NominaRecibosHero />

      <NominaRecibosActionCards
        activeAction={vm.activeAction}
        onSelect={vm.setActiveAction}
      />

      <NominaRecibosToolbar
        activeAction={vm.activeAction}
        versionId={vm.form.versionId}
        loading={vm.currentLoading}
        canExecute={vm.canExecute}
        onChangeVersionId={(value) => vm.updateField('versionId', value)}
        onExecute={vm.executeActiveAction}
      />

      <AdminSurface as="section" className={s.resultCard}>
        <NominaRecibosContentHeader
          eyebrow="Resultado"
          title={vm.currentTitle}
          description={vm.currentDescription}
          status={vm.generalStatus}
          summaryItems={vm.summaryItems}
          showSummary={vm.hasAnyResult}
        />

        {vm.hasAnyResult ? (
          <NominaRecibosResultsSection
            activeAction={vm.activeAction}
            snapshots={vm.results.snapshots}
            receipts={vm.results.receipts}
            release={vm.results.release}
            coreSync={vm.results.coreSync}
          />
        ) : (
          <EmptyState
            title="Aun no has ejecutado ninguna accion"
            description="Selecciona una opcion del flujo principal o ejecuta la liberacion cuando corresponda."
            variant="default"
          />
        )}
      </AdminSurface>

      <NominaRecibosReleasePanel
        versionId={vm.form.versionId}
        releasedByUserId={vm.form.releasedByUserId}
        comments={vm.form.comments}
        loading={vm.releaseLoading}
        canExecute={vm.canRelease}
        onChangeVersionId={(value) => vm.updateField('versionId', value)}
        onChangeReleasedByUserId={(value) => vm.updateField('releasedByUserId', value)}
        onChangeComments={(value) => vm.updateField('comments', value)}
        onExecute={vm.executeRelease}
      />
    </AdminPageShell>
  );
}
