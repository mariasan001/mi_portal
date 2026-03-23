'use client';

import { FormEvent, useMemo, useState } from 'react';
import type {
  CrearPeriodoNominaPayload,
  PeriodoNominaDto,
} from '../../../types/nomina-periodos.types';
import s from './PeriodoCreateForm.module.css';
import { formatNominaDate } from '../utils/nomina-configuracion.utils';

type Props = {
  loading: boolean;
  ultimoCreado: PeriodoNominaDto | null;
  onSubmit: (payload: CrearPeriodoNominaPayload) => Promise<void>;
};

export default function PeriodoCreateForm({
  loading,
  ultimoCreado,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CrearPeriodoNominaPayload>({
    anio: new Date().getFullYear(),
    quincena: 1,
    fechaInicio: '',
    fechaFin: '',
    fechaPagoEstimada: '',
  });

  const canSubmit = useMemo(() => {
    return (
      Number.isFinite(form.anio) &&
      form.anio > 0 &&
      Number.isFinite(form.quincena) &&
      form.quincena >= 1 &&
      form.quincena <= 24 &&
      form.fechaInicio.trim().length > 0 &&
      form.fechaFin.trim().length > 0 &&
      form.fechaPagoEstimada.trim().length > 0 &&
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
        <div className={s.grid2}>
          <label className={s.field}>
            <span>Año</span>
            <input
              type="number"
              min="2000"
              value={form.anio}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  anio: Number(e.target.value),
                }))
              }
              placeholder="Ej. 2026"
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
              placeholder="Ej. 1"
            />
          </label>
        </div>

        <label className={s.field}>
          <span>Fecha de inicio</span>
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
          <span>Fecha de fin</span>
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
          <span>Fecha de pago estimada</span>
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

        <div className={s.actions}>
          <button type="submit" className={s.submitBtn} disabled={!canSubmit}>
            {loading ? 'Procesando...' : 'Crear / recuperar periodo'}
          </button>
        </div>
      </form>

      <aside className={s.resultCard}>
        <div className={s.resultHead}>
          <h4>Último resultado</h4>
          <span className={s.badge}>Periodo</span>
        </div>

        {ultimoCreado ? (
          <dl className={s.detailGrid}>
            <div className={s.detailItem}>
              <dt>ID</dt>
              <dd>{ultimoCreado.periodId}</dd>
            </div>

            <div className={s.detailItem}>
              <dt>Año</dt>
              <dd>{ultimoCreado.anio}</dd>
            </div>

            <div className={s.detailItem}>
              <dt>Quincena</dt>
              <dd>{ultimoCreado.quincena}</dd>
            </div>

            <div className={s.detailItem}>
              <dt>Código</dt>
              <dd>{ultimoCreado.periodoCode}</dd>
            </div>

            <div className={s.detailItem}>
              <dt>Fecha inicio</dt>
              <dd>{formatNominaDate(ultimoCreado.fechaInicio)}</dd>
            </div>

            <div className={s.detailItem}>
              <dt>Fecha fin</dt>
              <dd>{formatNominaDate(ultimoCreado.fechaFin)}</dd>
            </div>

            <div className={s.detailItem}>
              <dt>Pago estimado</dt>
              <dd>{formatNominaDate(ultimoCreado.fechaPagoEstimada)}</dd>
            </div>
          </dl>
        ) : (
          <div className={s.empty}>
            <p>Todavía no se ha creado ni recuperado ningún periodo.</p>
          </div>
        )}
      </aside>
    </div>
  );
}