'use client';

import { useMemo, useState } from 'react';
import { Activity, CalendarRange, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import AdminInlineMessage from '@/features/admin/shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '@/features/admin/shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '@/features/admin/shared/ui/AdminSurface/AdminSurface';
import { useMonitoreoResource } from '@/features/admin/nomina/monitoreo/application/useMonitoreoResource';
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';
import NominaHero from '@/features/admin/nomina/shared/ui/NominaHero/NominaHero';
import NominaSectionHeader from '@/features/admin/nomina/shared/ui/NominaSectionHeader/NominaSectionHeader';
import s from './MonitoreoPage.module.css';
import NominaMonitoreoToolbar from './components/NominaMonitoreoToolbar';
import NominaMonitoreoResultadoPanel from './components/NominaMonitoreoResultadoPanel';

export default function MonitoreoPage() {
  const {
    estadoPeriodo,
    loadingEstado,
    errorEstado,
    consultarEstadoPeriodo,
    resetEstadoPeriodo,
  } = useMonitoreoResource();

  const [payPeriodId, setPayPeriodId] = useState('');

  const canSubmit = useMemo(
    () => Number(payPeriodId) > 0 && !loadingEstado,
    [payPeriodId, loadingEstado]
  );

  const handleConsult = async () => {
    const periodoId = Number(payPeriodId);

    if (!Number.isFinite(periodoId) || periodoId <= 0) {
      toast.warning('Captura un payPeriodId valido.');
      return;
    }

    try {
      await consultarEstadoPeriodo(periodoId);
      toast.success('Estado del periodo consultado correctamente.');
    } catch {
      toast.error('No se pudo consultar el estado del periodo.');
    }
  };

  const handleReset = () => {
    setPayPeriodId('');
    resetEstadoPeriodo();
  };

  return (
    <AdminPageShell>
      <NominaHero
        kicker="Nomina"
        title="Monitoreo del periodo"
        subtitle="Consulta el estado resumido del periodo de nomina, incluyendo banderas de carga, validacion y liberacion."
        badges={[
          { icon: CalendarRange, label: 'Periodo' },
          { icon: Activity, label: 'Monitoreo' },
          { icon: ShieldCheck, label: 'Estado' },
        ]}
      />

      <NominaMonitoreoToolbar
        payPeriodId={payPeriodId}
        loading={loadingEstado}
        canSubmit={canSubmit}
        onChange={setPayPeriodId}
        onSubmit={handleConsult}
        onReset={handleReset}
      />

      {errorEstado ? (
        <AdminInlineMessage title="Ocurrio un problema" tone="error">
          {errorEstado}
        </AdminInlineMessage>
      ) : null}

      <AdminSurface className={s.resultCard} as="div">
        <NominaSectionHeader
          eyebrow="Resultado"
          title={
            estadoPeriodo
              ? 'Estado del periodo consultado'
              : 'Resultado del monitoreo'
          }
          description={
            estadoPeriodo
              ? 'Revisa el estado consolidado, versiones activas y banderas operativas del periodo.'
              : 'Aqui se mostrara el resumen general del periodo una vez que realices una consulta.'
          }
        />

        {estadoPeriodo ? (
          <NominaMonitoreoResultadoPanel detalle={estadoPeriodo} />
        ) : (
          <NominaEmptyState
            title="Aun no has consultado ningun periodo"
            description="Captura un payPeriodId valido para revisar el estado general del proceso de nomina."
            variant="inbox"
            tone="compact"
          />
        )}
      </AdminSurface>
    </AdminPageShell>
  );
}
