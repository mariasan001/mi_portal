'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import AdminInlineMessage from '../../shared/ui/AdminInlineMessage/AdminInlineMessage';
import AdminPageShell from '../../shared/ui/AdminPageShell/AdminPageShell';
import AdminSurface from '../../shared/ui/AdminSurface/AdminSurface';
import { useMonitoreoResource } from '@/features/admin/nomina/monitoreo/application/useMonitoreoResource';
import s from './NominaMonitoreoView.module.css';
import NominaMonitoreoHero from './components/NominaMonitoreoHero';
import NominaMonitoreoToolbar from './components/NominaMonitoreoToolbar';
import NominaMonitoreoResultadoPanel from './components/NominaMonitoreoResultadoPanel';
import NominaMonitoreoContentHeader from './components/NominaMonitoreoContentHeader';
import EmptyState from './components/EmptyState';

export default function NominaMonitoreoView() {
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
      toast.warning('Captura un payPeriodId válido.');
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
        <NominaMonitoreoHero />

        <NominaMonitoreoToolbar
          payPeriodId={payPeriodId}
          loading={loadingEstado}
          canSubmit={canSubmit}
          onChange={setPayPeriodId}
          onSubmit={handleConsult}
          onReset={handleReset}
        />

        {errorEstado ? (
          <AdminInlineMessage title="Ocurrió un problema" tone="error">
            {errorEstado}
          </AdminInlineMessage>
        ) : null}

        <AdminSurface className={s.resultCard} as="div">
          <NominaMonitoreoContentHeader
            eyebrow="Resultado"
            title={
              estadoPeriodo
                ? 'Estado del periodo consultado'
                : 'Resultado del monitoreo'
            }
            description={
              estadoPeriodo
                ? 'Revisa el estado consolidado, versiones activas y banderas operativas del periodo.'
                : 'Aquí se mostrará el resumen general del periodo una vez que realices una consulta.'
            }
          />

          {estadoPeriodo ? (
            <NominaMonitoreoResultadoPanel detalle={estadoPeriodo} />
          ) : (
            <EmptyState
              title="Aún no has consultado ningún periodo"
              description="Captura un payPeriodId válido para revisar el estado general del proceso de nómina."
            />
          )}
        </AdminSurface>
    </AdminPageShell>
  );
}
