'use client';

import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';
import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';

import { useMonitoreoController } from '../application/useMonitoreoController';
import NominaMonitoreoResultadoPanel from './components/NominaMonitoreoResultadoPanel';
import NominaMonitoreoToolbar from './components/NominaMonitoreoToolbar';
import s from './MonitoreoPage.module.css';

export default function MonitoreoPage() {
  const vm = useMonitoreoController();

  return (
    <AdminPageShell>
      <NominaHero
        title="Monitoreo del periodo"
        subtitle={
          <>
            <strong>Primero consulta el periodo que quieres revisar.</strong> Despues podras
            validar <em>su estado operativo.</em>.
          </>
        }
      />

      <AdminSurface className={s.resultCard} as="div">
        <NominaMonitoreoToolbar
          selectedPeriodId={vm.selectedPeriodId}
          options={vm.options}
          helperText={vm.helperText}
          loading={vm.loadingEstado || vm.loadingPeriodos}
          onSelectPeriod={vm.handleSelectPeriod}
        />

        {vm.activeError ? (
          <AdminInlineMessage title="Ocurrio un problema" tone="error">
            {vm.activeError}
          </AdminInlineMessage>
        ) : null}

        {vm.estadoPeriodo ? (
          <NominaMonitoreoResultadoPanel detalle={vm.estadoPeriodo} />
        ) : (
          <div className={s.emptyArea}>
            <NominaEmptyState
              title="Aun no has consultado ningun periodo"
              description="Busca y selecciona un periodo existente para revisar el estado general del proceso de nomina."
              variant="inbox"
              tone="compact"
            />
          </div>
        )}
      </AdminSurface>
    </AdminPageShell>
  );
}
