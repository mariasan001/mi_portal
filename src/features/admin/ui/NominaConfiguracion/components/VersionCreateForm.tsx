'use client';

import { FormEvent, useMemo, useState } from 'react';

import type {
  CrearVersionNominaPayload,
  NominaStage,
  VersionNominaDto,
} from '../../../types/nomina-versiones.types';

import s from './VersionCreateForm.module.css';
import { formatNominaBool, formatNominaDate } from '../utils/nomina-configuracion.utils';

type Props = {
  loading: boolean;
  ultimaCreada: VersionNominaDto | null;
  onSubmit: (payload: CrearVersionNominaPayload) => Promise<void>;
};

export default function VersionCreateForm({
  loading,
  ultimaCreada,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CrearVersionNominaPayload>({
    payPeriodId: 0,
    stage: 'PREVIA',
    notes: '',
    createdByUserId: 0,
  });

  const canSubmit = useMemo(() => {
    return (
      Number.isFinite(form.payPeriodId) &&
      form.payPeriodId > 0 &&
      (form.stage === 'PREVIA' || form.stage === 'INTEGRADA') &&
      Number.isFinite(form.createdByUserId) &&
      form.createdByUserId > 0 &&
      !loading
    );
  }, [form, loading]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!canSubmit) return;
    await onSubmit(form);
  }

  return (
    <div className={s.layout}>
      <form className={s.formCard} onSubmit={handleSubmit}>
        <label className={s.field}>
          <span>Periodo de pago (payPeriodId)</span>
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
            rows={5}
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
          <span>Usuario creador (createdByUserId)</span>
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

        <div className={s.actions}>
          <button type="submit" className={s.submitBtn} disabled={!canSubmit}>
            {loading ? 'Procesando...' : 'Crear versión'}
          </button>
        </div>
      </form>

      <aside className={s.resultCard}>
        <div className={s.resultHead}>
          <h4>Último resultado</h4>
          <span className={s.badge}>Versión</span>
        </div>

        {ultimaCreada ? (
          <dl className={s.detailGrid}>
            <div className={s.detailItem}>
              <dt>ID de versión</dt>
              <dd>{ultimaCreada.versionId}</dd>
            </div>

            <div className={s.detailItem}>
              <dt>Periodo de pago</dt>
              <dd>{ultimaCreada.payPeriodId}</dd>
            </div>

            <div className={s.detailItem}>
              <dt>Código del periodo</dt>
              <dd>{ultimaCreada.periodCode}</dd>
            </div>

            <div className={s.detailItem}>
              <dt>Etapa</dt>
              <dd>{ultimaCreada.stage}</dd>
            </div>

            <div className={s.detailItem}>
              <dt>Estatus</dt>
              <dd>{ultimaCreada.status}</dd>
            </div>

            <div className={s.detailItem}>
              <dt>Actual</dt>
              <dd>{formatNominaBool(ultimaCreada.isCurrent)}</dd>
            </div>

            <div className={s.detailItem}>
              <dt>Liberada</dt>
              <dd>{formatNominaBool(ultimaCreada.released)}</dd>
            </div>

            <div className={s.detailItem}>
              <dt>Notas</dt>
              <dd>{ultimaCreada.notes || '—'}</dd>
            </div>

            <div className={s.detailItem}>
              <dt>Fecha de carga</dt>
              <dd>{formatNominaDate(ultimaCreada.loadedAt)}</dd>
            </div>
          </dl>
        ) : (
          <div className={s.empty}>
            <p>Todavía no se ha creado ninguna versión.</p>
          </div>
        )}
      </aside>
    </div>
  );
}