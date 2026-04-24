'use client';

import { Activity, CalendarRange, ShieldCheck } from 'lucide-react';

import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';
import NominaSectionHeader from '@/features/admin/nomina/shared/ui/NominaSectionHeader/NominaSectionHeader';

import { useMonitoreoController } from '../application/useMonitoreoController';
import NominaMonitoreoResultadoPanel from './components/NominaMonitoreoResultadoPanel';
import NominaMonitoreoToolbar from './components/NominaMonitoreoToolbar';
import s from './MonitoreoPage.module.css';

export default function MonitoreoPage() {
  const vm = useMonitoreoController();

  return (
    <AdminPageShell>
      <NominaHero
        kicker="Nómina"
        title="Monitoreo del período"
        subtitle="Consulta el estado resumido del período de nómina, incluyendo banderas de carga, validación y liberación."
        badges={[
          { icon: CalendarRange, label: 'Período' },
          { icon: Activity, label: 'Monitoreo' },
          { icon: ShieldCheck, label: 'Estado' },
        ]}
      />

      <NominaMonitoreoToolbar
        payPeriodId={vm.payPeriodId}
        loading={vm.loadingEstado}
        canSubmit={vm.canSubmit}
        onChange={vm.setPayPeriodId}
        onSubmit={vm.handleConsult}
        onReset={vm.handleReset}
      />

      {vm.errorEstado ? (
        <AdminInlineMessage title="Ocurrió un problema" tone="error">
          {vm.errorEstado}
        </AdminInlineMessage>
      ) : null}

      <AdminSurface className={s.resultCard} as="div">
        <NominaSectionHeader
          eyebrow="Resultado"
          title={
            vm.estadoPeriodo
              ? 'Estado del período consultado'
              : 'Resultado del monitoreo'
          }
          description={
            vm.estadoPeriodo
              ? 'Revisa el estado consolidado, las versiones activas y las banderas operativas del período.'
              : 'Aquí se mostrará el resumen general del período una vez que realices una consulta.'
          }
        />

        {vm.estadoPeriodo ? (
          <NominaMonitoreoResultadoPanel detalle={vm.estadoPeriodo} />
        ) : (
          <NominaEmptyState
            title="Aún no has consultado ningún período"
            description="Captura un payPeriodId válido para revisar el estado general del proceso de nómina."
            variant="inbox"
            tone="compact"
          />
        )}
      </AdminSurface>
    </AdminPageShell>
  );
}
