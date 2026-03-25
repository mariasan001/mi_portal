'use client';

import EmptyState from './components/EmptyState';
import NominaRecibosContentHeader from './components/NominaRecibosContentHeader';
import NominaRecibosFlowSection from './components/NominaRecibosFlowSection';
import NominaRecibosHero from './components/NominaRecibosHero';
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

        <NominaRecibosToolbar
          versionId={vm.form.versionId}
          releasedByUserId={vm.form.releasedByUserId}
          comments={vm.form.comments}
          onChangeVersionId={(value) => vm.updateField('versionId', value)}
          onChangeReleasedByUserId={(value) =>
            vm.updateField('releasedByUserId', value)
          }
          onChangeComments={(value) => vm.updateField('comments', value)}
        />

        <div className={s.contentShell}>
          <NominaRecibosContentHeader
            title="Publicación de recibos por versión"
            description="Esta sesión concentra el flujo principal de generación, liberación y sincronización complementaria de recibos sobre una misma versión operativa."
            status={vm.generalStatus}
            summaryItems={vm.summaryItems}
          />

          <div className={s.contentGrid}>
            <div className={s.leftColumn}>
              <NominaRecibosFlowSection items={vm.flowItems} />
            </div>

            <div className={s.rightColumn}>
              {vm.hasAnyResult ? (
                <NominaRecibosResultsSection
                  snapshots={vm.results.snapshots}
                  receipts={vm.results.receipts}
                  release={vm.results.release}
                  coreSync={vm.results.coreSync}
                />
              ) : (
                <EmptyState
                  title="Aún no hay resultados para mostrar"
                  description="Captura una versión válida y ejecuta el flujo paso a paso para visualizar aquí los resultados de snapshots, recibos, liberación y sincronización."
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}