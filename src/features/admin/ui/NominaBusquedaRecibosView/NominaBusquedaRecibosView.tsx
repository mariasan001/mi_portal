'use client';

import EmptyState from './components/EmptyState';
import NominaBusquedaRecibosContentHeader from './components/NominaBusquedaRecibosContentHeader';
import NominaBusquedaRecibosHero from './components/NominaBusquedaRecibosHero';
import NominaBusquedaRecibosResultsSection from './components/NominaBusquedaRecibosResultsSection';
import NominaBusquedaRecibosToolbar from './components/NominaBusquedaRecibosToolbar';
import { useNominaBusquedaRecibosView } from './hooks/useNominaBusquedaRecibosView';
import s from './NominaBusquedaRecibosView.module.css';

export default function NominaBusquedaRecibosView() {
  const vm = useNominaBusquedaRecibosView();

  return (
    <section className={s.page}>
      <div className={s.stack}>
        <NominaBusquedaRecibosHero />

        <NominaBusquedaRecibosToolbar
          claveSp={vm.form.claveSp}
          periodCode={vm.form.periodCode}
          loading={vm.loading}
          canSearch={vm.canSearch}
          onChangeClaveSp={(value) => vm.updateField('claveSp', value)}
          onChangePeriodCode={(value) => vm.updateField('periodCode', value)}
          onSearch={vm.executeSearch}
        />

        <section className={s.resultContainer}>
          <NominaBusquedaRecibosContentHeader
            eyebrow="Resultado"
            title="Recibos localizados"
            description="Consulta recibos completos por clave SP y periodo, mostrando encabezado, plazas, detalle fiscal y conceptos asociados."
            summaryItems={vm.summaryItems}
            showSummary={vm.hasResults}
          />

          {vm.error ? <div className={s.errorBox}>{vm.error}</div> : null}

          {vm.hasResults ? (
            <NominaBusquedaRecibosResultsSection
              receipts={vm.data?.receipts ?? []}
            />
          ) : (
            <EmptyState
              title="Aún no hay recibos para mostrar"
              description="Captura una clave SP y un periodo válido para consultar recibos."
            />
          )}
        </section>
      </div>
    </section>
  );
}