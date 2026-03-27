'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import s from './NominaMonitoreoView.module.css';
import { useNominaMonitoreo } from '../../hooks/useNominaMonitoreo';
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
  } = useNominaMonitoreo();

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
    <section className={s.page}>
      <div className={s.stack}>
        <NominaMonitoreoHero />

        <NominaMonitoreoToolbar
          payPeriodId={payPeriodId}
          loading={loadingEstado}
          canSubmit={canSubmit}
          onChange={setPayPeriodId}
          onSubmit={handleConsult}
          onReset={handleReset}
        />

        {errorEstado ? <p className={s.error}>{errorEstado}</p> : null}

        <div className={s.resultCard}>
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
        </div>
      </div>
    </section>
  );
}