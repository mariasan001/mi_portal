'use client';

import EmptyState from './components/EmptyState';
import NominaRecibosActionCards from './components/NominaRecibosActionCards';
import NominaRecibosContentHeader from './components/NominaRecibosContentHeader';
import NominaRecibosHero from './components/NominaRecibosHero';
import NominaRecibosReleasePanel from './components/NominaRecibosReleasePanel';
import NominaRecibosResultsSection from './components/NominaRecibosResultsSection';
import NominaRecibosToolbar from './components/NominaRecibosToolbar';
import { useNominaRecibosView } from './hooks/useNominaRecibosView';
import s from './NominaRecibosView.module.css';

export default function NominaRecibosView() {
  const vm = useNominaRecibosView();

  return (
    <section className={s.page}>
      <div className={s.stack}>
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

        <section className={s.resultCard}>
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
              title="Aún no has ejecutado ninguna acción"
              description="Selecciona una opción del flujo principal o ejecuta la liberación cuando corresponda."
              variant="default"
            />
          )}
        </section>
      </div>

      <NominaRecibosReleasePanel
        versionId={vm.form.versionId}
        releasedByUserId={vm.form.releasedByUserId}
        comments={vm.form.comments}
        loading={vm.releaseLoading}
        canExecute={vm.canRelease}
        onChangeVersionId={(value) => vm.updateField('versionId', value)}
        onChangeReleasedByUserId={(value) =>
          vm.updateField('releasedByUserId', value)
        }
        onChangeComments={(value) => vm.updateField('comments', value)}
        onExecute={vm.executeRelease}
      />
    </section>
  );
}