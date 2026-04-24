'use client';

import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';
import { FileText, RefreshCw } from 'lucide-react';
import NominaRecibosActionCards from './components/NominaRecibosActionCards';
import NominaRecibosContentHeader from './components/NominaRecibosContentHeader';
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
        kicker="Nomina"
        title="Liberacion de Nomina"
        subtitle="Gestiona la generacion, liberacion y sincronizacion de recibos de nomina."
        badges={[
          { icon: FileText, label: 'Recibos' },
          { icon: RefreshCw, label: 'Liberacion y sincronizacion' },
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
          <NominaEmptyState
            title="Aun no has ejecutado ninguna accion"
            description="Selecciona una opcion del flujo principal o ejecuta la liberacion cuando corresponda."
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
