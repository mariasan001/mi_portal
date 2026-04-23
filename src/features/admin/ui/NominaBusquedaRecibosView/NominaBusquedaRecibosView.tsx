'use client';

import AdminInlineMessage from '../../shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '../../shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '../../shared/ui/AdminSurface/AdminSurface';
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
    <AdminPageShell>
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

        <AdminSurface className={s.resultContainer}>
          <NominaBusquedaRecibosContentHeader
            eyebrow="Resultado"
            title="Recibos localizados"
            description="Consulta recibos completos por clave SP y periodo"
            summaryItems={vm.summaryItems}
            showSummary={vm.hasResults}
          />

          {vm.error ? (
            <AdminInlineMessage title="Ocurrió un problema" tone="error">
              {vm.error}
            </AdminInlineMessage>
          ) : null}

          {vm.hasResults ? (
            <NominaBusquedaRecibosResultsSection
              receipts={vm.data?.receipts ?? []}
            />
          ) : (
            <EmptyState
              title="Aun no hay recibos para mostrar"
              description="Captura una clave SP y un periodo valido para consultar recibos."
              variant="search"
            />
          )}
        </AdminSurface>
    </AdminPageShell>
  );
}
