'use client';

import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';
import { CalendarRange, Search } from 'lucide-react';
import NominaBusquedaRecibosContentHeader from './components/NominaBusquedaRecibosContentHeader';
import NominaBusquedaRecibosResultsSection from './components/NominaBusquedaRecibosResultsSection';
import NominaBusquedaRecibosToolbar from './components/NominaBusquedaRecibosToolbar';
import { useNominaBusquedaRecibosView } from './hooks/useNominaBusquedaRecibosView';
import s from './BusquedaRecibosPage.module.css';

export default function BusquedaRecibosPage() {
  const vm = useNominaBusquedaRecibosView();

  return (
    <AdminPageShell>
        <NominaHero
          kicker="Nomina"
          title="Busqueda por servidor"
          subtitle="Consulta recibos completos por clave SP"
          badges={[
            { icon: Search, label: 'Busqueda' },
            { icon: CalendarRange, label: 'Servidor y periodo' },
          ]}
        />

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
            <NominaEmptyState
              title="Aun no hay recibos para mostrar"
              description="Captura una clave SP y un periodo valido para consultar recibos."
              variant="search"
            />
          )}
        </AdminSurface>
    </AdminPageShell>
  );
}
