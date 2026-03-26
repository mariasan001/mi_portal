'use client';

import type {
  AuditCancellationItemDto,
  AuditReleaseItemDto,
} from '../../types/nomina-auditoria.types';
import EmptyState from './components/EmptyState';
import NominaAuditoriaActionCards from './components/NominaAuditoriaActionCards';
import NominaAuditoriaContentHeader from './components/NominaAuditoriaContentHeader';
import NominaAuditoriaHero from './components/NominaAuditoriaHero';
import NominaAuditoriaResultsSection from './components/NominaAuditoriaResultsSection';
import NominaAuditoriaToolbar from './components/NominaAuditoriaToolbar';
import { useNominaAuditoriaView } from './hooks/useNominaAuditoriaView';
import s from './NominaAuditoriaView.module.css';

export default function NominaAuditoriaView() {
  const vm = useNominaAuditoriaView();

  const releaseItems: AuditReleaseItemDto[] =
    vm.activeAction === 'liberaciones'
      ? ((vm.currentData?.items as AuditReleaseItemDto[] | undefined) ?? [])
      : [];

  const cancellationItems: AuditCancellationItemDto[] =
    vm.activeAction === 'cancelaciones'
      ? ((vm.currentData?.items as AuditCancellationItemDto[] | undefined) ?? [])
      : [];

  return (
    <section className={s.page}>
      <div className={s.stack}>
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

        <section className={s.resultContainer}>
          <NominaAuditoriaContentHeader
            eyebrow="Resultado"
            title={vm.currentTitle}
            description={vm.currentDescription}
            summaryItems={vm.summaryItems}
            showSummary={vm.hasResults}
          />

          {vm.currentError ? (
            <div className={s.errorBox}>{vm.currentError}</div>
          ) : null}

          {vm.hasResults ? (
            <NominaAuditoriaResultsSection
              activeAction={vm.activeAction}
              releases={releaseItems}
              cancellations={cancellationItems}
            />
          ) : (
            <EmptyState
              title="Aún no hay resultados para mostrar"
              description="Selecciona una auditoría, captura los filtros necesarios y ejecuta la consulta."
            />
          )}
        </section>
      </div>
    </section>
  );
}