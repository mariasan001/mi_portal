'use client';

import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';

import { useBusquedaRecibosController } from '../application/useBusquedaRecibosController';
import NominaBusquedaRecibosResultsSection from './components/NominaBusquedaRecibosResultsSection';
import NominaBusquedaRecibosToolbar from './components/NominaBusquedaRecibosToolbar';
import s from './BusquedaRecibosPage.module.css';

export default function BusquedaRecibosPage() {
  const vm = useBusquedaRecibosController();

  return (
    <AdminPageShell>
      <NominaHero
        title="Busqueda por servidor"
        subtitle={
          <>
            <strong>Primero captura la clave SP y el periodo que quieres revisar.</strong>{' '}
            Despues podras consultar <em>sus recibos completos</em>.
          </>
        }
      />

      <AdminSurface className={s.contentShell}>
        <div className={s.resultCard}>
          <NominaBusquedaRecibosToolbar
            claveSp={vm.form.claveSp}
            periodCode={vm.form.periodCode}
            periodOptions={vm.periodOptions}
            loading={vm.loading}
            canSearch={vm.canSearch}
            onChangeClaveSp={(value) => vm.updateField('claveSp', value)}
            onChangePeriodCode={(value) => vm.updateField('periodCode', value)}
            onSearch={vm.executeSearch}
          />

          {vm.periodsError ? (
            <AdminInlineMessage title="No se pudieron cargar los periodos" tone="warning">
              {vm.periodsError}
            </AdminInlineMessage>
          ) : null}

          {vm.error ? (
            <AdminInlineMessage title="Ocurrio un problema" tone="error">
              {vm.error}
            </AdminInlineMessage>
          ) : null}

          {vm.hasResults ? (
            <NominaBusquedaRecibosResultsSection receipts={vm.data?.receipts ?? []} />
          ) : (
            <div className={s.emptyArea}>
              <NominaEmptyState
                title="Aun no hay recibos para mostrar"
                description="Captura una clave SP y un periodo valido para consultar recibos."
                variant="inbox"
                tone="compact"
              />
            </div>
          )}
        </div>
      </AdminSurface>
    </AdminPageShell>
  );
}
