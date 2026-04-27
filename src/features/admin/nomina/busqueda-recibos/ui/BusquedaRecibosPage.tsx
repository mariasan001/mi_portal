'use client';

import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';
import NominaSectionHeader from '@/features/admin/nomina/shared/ui/NominaSectionHeader/NominaSectionHeader';
import { CalendarRange, Search } from 'lucide-react';

import { useBusquedaRecibosController } from '../application/useBusquedaRecibosController';
import NominaBusquedaRecibosResultsSection from './components/NominaBusquedaRecibosResultsSection';
import NominaBusquedaRecibosToolbar from './components/NominaBusquedaRecibosToolbar';
import s from './BusquedaRecibosPage.module.css';

export default function BusquedaRecibosPage() {
  const vm = useBusquedaRecibosController();

  return (
    <AdminPageShell>
      <NominaHero
        kicker="Nómina"
        title="Búsqueda por servidor"
        subtitle="Consulta recibos completos por clave SP y período."
        badges={[
          { icon: Search, label: 'Búsqueda' },
          { icon: CalendarRange, label: 'Servidor y período' },
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
        <NominaSectionHeader
          eyebrow="Resultado"
          title="Recibos localizados"
          description="Consulta recibos completos por clave SP y período."
          summaryItems={vm.summaryItems}
          showSummary={vm.hasResults}
          summaryColumns={3}
        />

        {vm.error ? (
          <AdminInlineMessage title="Ocurrió un problema" tone="error">
            {vm.error}
          </AdminInlineMessage>
        ) : null}

        {vm.hasResults ? (
          <NominaBusquedaRecibosResultsSection receipts={vm.data?.receipts ?? []} />
        ) : (
          <NominaEmptyState
            title="Aún no hay recibos para mostrar"
            description="Captura una clave SP y un período válido para consultar recibos."
            variant="search"
          />
        )}
      </AdminSurface>
    </AdminPageShell>
  );
}
