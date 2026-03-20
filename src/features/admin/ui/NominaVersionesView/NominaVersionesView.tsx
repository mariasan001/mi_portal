'use client';

import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type {
  CrearVersionNominaPayload,
  NominaStage,
} from '../../types/nomina-versiones.types';

import s from './NominaVersionesView.module.css';
import { useNominaVersiones } from '../../hook/useNominaVersiones';

function formatFechaHora(value: string) {
  if (!value) return '—';
  return value;
}

function formatBool(value: boolean) {
  return value ? 'Sí' : 'No';
}

export default function NominaVersionesView() {
  const {
    detalle,
    ultimaCreada,
    loadingDetalle,
    loadingCreate,
    errorDetalle,
    errorCreate,
    consultarPorId,
    crearVersion,
  } = useNominaVersiones();

  const [versionId, setVersionId] = useState('');

  const [form, setForm] = useState<CrearVersionNominaPayload>({
    payPeriodId: 0,
    stage: 'PREVIA',
    notes: '',
    createdByUserId: 0,
  });

  const canSearch = useMemo(() => {
    return versionId.trim().length > 0 && !loadingDetalle;
  }, [versionId, loadingDetalle]);

  const canCreate = useMemo(() => {
    return (
      Number.isFinite(form.payPeriodId) &&
      form.payPeriodId > 0 &&
      (form.stage === 'PREVIA' || form.stage === 'INTEGRADA') &&
      Number.isFinite(form.createdByUserId) &&
      form.createdByUserId > 0 &&
      !loadingCreate
    );
  }, [form, loadingCreate]);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = Number(versionId);

    if (!Number.isFinite(id) || id <= 0) {
      toast.warning('Captura un versionId válido.');
      return;
    }

    try {
      await consultarPorId(id);
      toast.success('Versión consultada correctamente.');
    } catch {
      toast.error('No se pudo consultar la versión.');
    }
  };

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canCreate) {
      toast.warning('Completa correctamente los campos de la versión.');
      return;
    }

    try {
      await crearVersion(form);
      toast.success('Versión creada correctamente.');
    } catch {
      toast.error('No se pudo crear la versión.');
    }
  };

  return (
    <section className={s.page}>
      <header className={s.hero}>
        <div>
          <p className={s.kicker}>Nómina</p>
          <h1 className={s.title}>Configuración de versión</h1>
          <p className={s.subtitle}>
            Consulta versiones de nómina por ID y registra nuevas versiones por
            periodo y etapa.
          </p>
        </div>
      </header>

      <div className={s.grid}>
        <article className={s.card}>
          <div className={s.cardHead}>
            <h2>Consultar versión por ID</h2>
            <span className={s.badge}>1</span>
          </div>

          <form className={s.form} onSubmit={handleSearch}>
            <label className={s.field}>
              <span>versionId</span>
              <input
                type="number"
                min="1"
                value={versionId}
                onChange={(e) => setVersionId(e.target.value)}
                placeholder="Ej. 15"
              />
            </label>

            <button className={s.primaryBtn} type="submit" disabled={!canSearch}>
              {loadingDetalle ? 'Consultando...' : 'Consultar versión'}
            </button>
          </form>

          {errorDetalle ? <p className={s.error}>{errorDetalle}</p> : null}

          <div className={s.resultBlock}>
            <h3>Resultado</h3>

            {detalle ? (
              <dl className={s.detailGrid}>
                <div>
                  <dt>ID</dt>
                  <dd>{detalle.versionId}</dd>
                </div>
                <div>
                  <dt>Periodo pago</dt>
                  <dd>{detalle.payPeriodId}</dd>
                </div>
                <div>
                  <dt>Código periodo</dt>
                  <dd>{detalle.periodCode}</dd>
                </div>
                <div>
                  <dt>Etapa</dt>
                  <dd>{detalle.stage}</dd>
                </div>
                <div>
                  <dt>Estatus</dt>
                  <dd>{detalle.status}</dd>
                </div>
                <div>
                  <dt>Actual</dt>
                  <dd>{formatBool(detalle.isCurrent)}</dd>
                </div>
                <div>
                  <dt>Liberada</dt>
                  <dd>{formatBool(detalle.released)}</dd>
                </div>
                <div>
                  <dt>Notas</dt>
                  <dd>{detalle.notes || '—'}</dd>
                </div>
                <div>
                  <dt>Cargada en</dt>
                  <dd>{formatFechaHora(detalle.loadedAt)}</dd>
                </div>
              </dl>
            ) : (
              <p className={s.empty}>Aún no has consultado ninguna versión.</p>
            )}
          </div>
        </article>

        <article className={s.card}>
          <div className={s.cardHead}>
            <h2>Crear versión de nómina</h2>
            <span className={s.badgeCreate}>2</span>
          </div>

          <form className={s.form} onSubmit={handleCreate}>
            <label className={s.field}>
              <span>payPeriodId</span>
              <input
                type="number"
                min="1"
                value={form.payPeriodId || ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    payPeriodId: Number(e.target.value),
                  }))
                }
                placeholder="Ej. 4"
              />
            </label>

            <label className={s.field}>
              <span>Etapa</span>
              <select
                value={form.stage}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    stage: e.target.value as NominaStage,
                  }))
                }
              >
                <option value="PREVIA">PREVIA</option>
                <option value="INTEGRADA">INTEGRADA</option>
              </select>
            </label>

            <label className={s.field}>
              <span>Notas</span>
              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="Observaciones de la versión"
              />
            </label>

            <label className={s.field}>
              <span>createdByUserId</span>
              <input
                type="number"
                min="1"
                value={form.createdByUserId || ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    createdByUserId: Number(e.target.value),
                  }))
                }
                placeholder="Ej. 1"
              />
            </label>

            <button className={s.successBtn} type="submit" disabled={!canCreate}>
              {loadingCreate ? 'Procesando...' : 'Crear versión'}
            </button>
          </form>

          {errorCreate ? <p className={s.error}>{errorCreate}</p> : null}

          <div className={s.resultBlock}>
            <h3>Último resultado</h3>

            {ultimaCreada ? (
              <dl className={s.detailGrid}>
                <div>
                  <dt>ID</dt>
                  <dd>{ultimaCreada.versionId}</dd>
                </div>
                <div>
                  <dt>Periodo pago</dt>
                  <dd>{ultimaCreada.payPeriodId}</dd>
                </div>
                <div>
                  <dt>Código periodo</dt>
                  <dd>{ultimaCreada.periodCode}</dd>
                </div>
                <div>
                  <dt>Etapa</dt>
                  <dd>{ultimaCreada.stage}</dd>
                </div>
                <div>
                  <dt>Estatus</dt>
                  <dd>{ultimaCreada.status}</dd>
                </div>
                <div>
                  <dt>Actual</dt>
                  <dd>{formatBool(ultimaCreada.isCurrent)}</dd>
                </div>
                <div>
                  <dt>Liberada</dt>
                  <dd>{formatBool(ultimaCreada.released)}</dd>
                </div>
                <div>
                  <dt>Notas</dt>
                  <dd>{ultimaCreada.notes || '—'}</dd>
                </div>
                <div>
                  <dt>Cargada en</dt>
                  <dd>{formatFechaHora(ultimaCreada.loadedAt)}</dd>
                </div>
              </dl>
            ) : (
              <p className={s.empty}>Todavía no se ha creado ninguna versión.</p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}