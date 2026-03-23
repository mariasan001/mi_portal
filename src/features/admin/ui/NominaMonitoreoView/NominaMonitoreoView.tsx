'use client';

import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';

import s from './NominaMonitoreoView.module.css';
import { useNominaMonitoreo } from '../../hook/useNominaMonitoreo';

function boolLabel(value: boolean) {
  return value ? 'Sí' : 'No';
}

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      <header className={s.hero}>
        <div>
          <p className={s.kicker}>Nómina</p>
          <h1 className={s.title}>Monitoreo del periodo</h1>
          <p className={s.subtitle}>
            Consulta el estado resumido del periodo de nómina, incluyendo
            banderas de carga, validación, liberación y versiones actuales.
          </p>
        </div>
      </header>

      <article className={s.card}>
        <div className={s.cardHead}>
          <div>
            <h2>Estado del periodo</h2>
            <p className={s.cardText}>
              Endpoint de monitoreo para revisar si el periodo ya tiene previa,
              integrada, catálogo, validación, liberación y banderas
              complementarias.
            </p>
          </div>

          <span className={s.badge}>1</span>
        </div>

        <form className={s.inlineForm} onSubmit={handleSubmit}>
          <label className={s.field}>
            <span>payPeriodId</span>
            <input
              type="number"
              min="1"
              value={payPeriodId}
              onChange={(e) => setPayPeriodId(e.target.value)}
              placeholder="Ej. 202601"
            />
          </label>

          <div className={s.actions}>
            <button className={s.primaryBtn} type="submit" disabled={!canSubmit}>
              {loadingEstado ? 'Consultando...' : 'Consultar estado'}
            </button>

            <button
              className={s.secondaryBtn}
              type="button"
              onClick={handleReset}
              disabled={loadingEstado}
            >
              Limpiar
            </button>
          </div>
        </form>

        {errorEstado ? <p className={s.error}>{errorEstado}</p> : null}

        <div className={s.resultBlock}>
          <h3>Resultado</h3>

          {estadoPeriodo ? (
            <>
              <dl className={s.detailGrid}>
                <div>
                  <dt>periodStateId</dt>
                  <dd>{estadoPeriodo.periodStateId}</dd>
                </div>
                <div>
                  <dt>payPeriodId</dt>
                  <dd>{estadoPeriodo.payPeriodId}</dd>
                </div>
                <div>
                  <dt>periodCode</dt>
                  <dd>{estadoPeriodo.periodCode}</dd>
                </div>
                <div>
                  <dt>Año</dt>
                  <dd>{estadoPeriodo.anio}</dd>
                </div>
                <div>
                  <dt>Quincena</dt>
                  <dd>{estadoPeriodo.quincena}</dd>
                </div>
                <div>
                  <dt>Versión previa actual</dt>
                  <dd>{estadoPeriodo.currentPreviaVersionId}</dd>
                </div>
                <div>
                  <dt>Versión integrada actual</dt>
                  <dd>{estadoPeriodo.currentIntegradaVersionId}</dd>
                </div>
                <div>
                  <dt>releasedAt</dt>
                  <dd>{estadoPeriodo.releasedAt ?? 'Sin fecha'}</dd>
                </div>
                <div>
                  <dt>releasedByUserId</dt>
                  <dd>{estadoPeriodo.releasedByUserId ?? 'Sin dato'}</dd>
                </div>
              </dl>

              <div className={s.flagsGrid}>
                <div className={estadoPeriodo.previaLoaded ? s.flagOk : s.flagOff}>
                  <span>Previa cargada</span>
                  <strong>{boolLabel(estadoPeriodo.previaLoaded)}</strong>
                </div>

                <div
                  className={estadoPeriodo.integradaLoaded ? s.flagOk : s.flagOff}
                >
                  <span>Integrada cargada</span>
                  <strong>{boolLabel(estadoPeriodo.integradaLoaded)}</strong>
                </div>

                <div className={estadoPeriodo.catalogLoaded ? s.flagOk : s.flagOff}>
                  <span>Catálogo cargado</span>
                  <strong>{boolLabel(estadoPeriodo.catalogLoaded)}</strong>
                </div>

                <div className={estadoPeriodo.validated ? s.flagOk : s.flagOff}>
                  <span>Validado</span>
                  <strong>{boolLabel(estadoPeriodo.validated)}</strong>
                </div>

                <div className={estadoPeriodo.released ? s.flagOk : s.flagOff}>
                  <span>Liberado</span>
                  <strong>{boolLabel(estadoPeriodo.released)}</strong>
                </div>

                <div
                  className={
                    estadoPeriodo.hasCancellations ? s.flagWarn : s.flagOff
                  }
                >
                  <span>Tiene cancelaciones</span>
                  <strong>{boolLabel(estadoPeriodo.hasCancellations)}</strong>
                </div>

                <div
                  className={
                    estadoPeriodo.hasReexpeditions ? s.flagWarn : s.flagOff
                  }
                >
                  <span>Tiene reexpediciones</span>
                  <strong>{boolLabel(estadoPeriodo.hasReexpeditions)}</strong>
                </div>
              </div>
            </>
          ) : (
            <p className={s.empty}>
              Aún no has consultado el estado de ningún periodo.
            </p>
          )}
        </div>
      </article>
    </section>
  );
}