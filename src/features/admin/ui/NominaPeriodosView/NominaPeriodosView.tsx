'use client';

import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { CrearPeriodoNominaPayload } from '../../types/nomina-periodos.types';

import s from './NominaPeriodosView.module.css';
import { useNominaPeriodos } from '../../hook/useNominaPeriodos';

function formatFecha(value: string) {
  if (!value) return '—';
  return value;
}

export default function NominaPeriodosView() {
  const {
    detalle,
    ultimoCreado,
    loadingDetalle,
    loadingCreate,
    errorDetalle,
    errorCreate,
    consultarPorId,
    crearPeriodo,
  } = useNominaPeriodos();

  const [periodId, setPeriodId] = useState('');

  const [form, setForm] = useState<CrearPeriodoNominaPayload>({
    anio: new Date().getFullYear(),
    quincena: 1,
    fechaInicio: '',
    fechaFin: '',
    fechaPagoEstimada: '',
  });

  const canSearch = useMemo(() => {
    return periodId.trim().length > 0 && !loadingDetalle;
  }, [periodId, loadingDetalle]);

  const canCreate = useMemo(() => {
    return (
      Number.isFinite(form.anio) &&
      Number.isFinite(form.quincena) &&
      form.fechaInicio.trim().length > 0 &&
      form.fechaFin.trim().length > 0 &&
      form.fechaPagoEstimada.trim().length > 0 &&
      !loadingCreate
    );
  }, [form, loadingCreate]);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = Number(periodId);

    if (!Number.isFinite(id) || id <= 0) {
      toast.warning('Captura un periodId válido.');
      return;
    }

    try {
      await consultarPorId(id);
      toast.success('Periodo consultado correctamente.');
    } catch {
      toast.error('No se pudo consultar el periodo.');
    }
  };

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canCreate) {
      toast.warning('Completa todos los campos del periodo.');
      return;
    }

    try {
      await crearPeriodo(form);
      toast.success('Periodo creado o recuperado correctamente.');
    } catch {
      toast.error('No se pudo crear o recuperar el periodo.');
    }
  };

  return (
    <section className={s.page}>
      <header className={s.hero}>
        <div>
          <p className={s.kicker}>Nómina</p>
          <h1 className={s.title}>Periodos de nómina</h1>
          <p className={s.subtitle}>
            Consulta periodos existentes por ID y crea o recupera nuevos periodos.
          </p>
        </div>
      </header>

      <div className={s.grid}>
        <article className={s.card}>
          <div className={s.cardHead}>
            <h2>Consultar por ID</h2>
            <span className={s.badge}>2</span>
          </div>

          <form className={s.form} onSubmit={handleSearch}>
            <label className={s.field}>
              <span>periodId</span>
              <input
                type="number"
                min="1"
                value={periodId}
                onChange={(e) => setPeriodId(e.target.value)}
                placeholder="Ej. 12"
              />
            </label>

            <button className={s.primaryBtn} type="submit" disabled={!canSearch}>
              {loadingDetalle ? 'Consultando...' : 'Consultar periodo'}
            </button>
          </form>

          {errorDetalle ? <p className={s.error}>{errorDetalle}</p> : null}

          <div className={s.resultBlock}>
            <h3>Resultado</h3>

            {detalle ? (
              <dl className={s.detailGrid}>
                <div>
                  <dt>ID</dt>
                  <dd>{detalle.periodId}</dd>
                </div>
                <div>
                  <dt>Año</dt>
                  <dd>{detalle.anio}</dd>
                </div>
                <div>
                  <dt>Quincena</dt>
                  <dd>{detalle.quincena}</dd>
                </div>
                <div>
                  <dt>Código</dt>
                  <dd>{detalle.periodoCode}</dd>
                </div>
                <div>
                  <dt>Fecha inicio</dt>
                  <dd>{formatFecha(detalle.fechaInicio)}</dd>
                </div>
                <div>
                  <dt>Fecha fin</dt>
                  <dd>{formatFecha(detalle.fechaFin)}</dd>
                </div>
                <div>
                  <dt>Pago estimado</dt>
                  <dd>{formatFecha(detalle.fechaPagoEstimada)}</dd>
                </div>
              </dl>
            ) : (
              <p className={s.empty}>Aún no has consultado ningún periodo.</p>
            )}
          </div>
        </article>

        <article className={s.card}>
          <div className={s.cardHead}>
            <h2>Crear o recuperar periodo</h2>
            <span className={s.badgeCreate}>1</span>
          </div>

          <form className={s.form} onSubmit={handleCreate}>
            <div className={s.row2}>
              <label className={s.field}>
                <span>Año</span>
                <input
                  type="number"
                  value={form.anio}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      anio: Number(e.target.value),
                    }))
                  }
                />
              </label>

              <label className={s.field}>
                <span>Quincena</span>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={form.quincena}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      quincena: Number(e.target.value),
                    }))
                  }
                />
              </label>
            </div>

            <label className={s.field}>
              <span>Fecha inicio</span>
              <input
                type="date"
                value={form.fechaInicio}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    fechaInicio: e.target.value,
                  }))
                }
              />
            </label>

            <label className={s.field}>
              <span>Fecha fin</span>
              <input
                type="date"
                value={form.fechaFin}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    fechaFin: e.target.value,
                  }))
                }
              />
            </label>

            <label className={s.field}>
              <span>Fecha pago estimada</span>
              <input
                type="date"
                value={form.fechaPagoEstimada}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    fechaPagoEstimada: e.target.value,
                  }))
                }
              />
            </label>

            <button className={s.successBtn} type="submit" disabled={!canCreate}>
              {loadingCreate ? 'Procesando...' : 'Crear / recuperar periodo'}
            </button>
          </form>

          {errorCreate ? <p className={s.error}>{errorCreate}</p> : null}

          <div className={s.resultBlock}>
            <h3>Último resultado</h3>

            {ultimoCreado ? (
              <dl className={s.detailGrid}>
                <div>
                  <dt>ID</dt>
                  <dd>{ultimoCreado.periodId}</dd>
                </div>
                <div>
                  <dt>Año</dt>
                  <dd>{ultimoCreado.anio}</dd>
                </div>
                <div>
                  <dt>Quincena</dt>
                  <dd>{ultimoCreado.quincena}</dd>
                </div>
                <div>
                  <dt>Código</dt>
                  <dd>{ultimoCreado.periodoCode}</dd>
                </div>
                <div>
                  <dt>Fecha inicio</dt>
                  <dd>{formatFecha(ultimoCreado.fechaInicio)}</dd>
                </div>
                <div>
                  <dt>Fecha fin</dt>
                  <dd>{formatFecha(ultimoCreado.fechaFin)}</dd>
                </div>
                <div>
                  <dt>Pago estimado</dt>
                  <dd>{formatFecha(ultimoCreado.fechaPagoEstimada)}</dd>
                </div>
              </dl>
            ) : (
              <p className={s.empty}>
                Todavía no se ha creado ni recuperado ningún periodo.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}