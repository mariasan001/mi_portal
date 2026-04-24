'use client';

import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';
import NominaSectionHeader from '@/features/admin/nomina/shared/ui/NominaSectionHeader/NominaSectionHeader';
import { FileText, RefreshCw } from 'lucide-react';
import NominaRecibosActionCards from './components/NominaRecibosActionCards';
import NominaRecibosReleasePanel from './components/NominaRecibosReleasePanel';
import NominaRecibosResultsSection from './components/NominaRecibosResultsSection';
import NominaRecibosToolbar from './components/NominaRecibosToolbar';
import s from './RecibosPage.module.css';
import { useRecibosController } from '../application/useRecibosController';

export default function RecibosPage() {
  const vm = useRecibosController();

  return (
    <AdminPageShell>
      <NominaHero
        kicker="Nómina"
        title="Liberación de nómina"
        subtitle="Gestiona la generación, liberación y sincronización de recibos de nómina."
        badges={[
          { icon: FileText, label: 'Recibos' },
          { icon: RefreshCw, label: 'Liberación y sincronización' },
        ]}
      />

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
        <NominaSectionHeader
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
          <NominaEmptyState
            title="Aún no has ejecutado ninguna acción"
            description="Selecciona una opción del flujo principal o ejecuta la liberación cuando corresponda."
            variant="inbox"
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
