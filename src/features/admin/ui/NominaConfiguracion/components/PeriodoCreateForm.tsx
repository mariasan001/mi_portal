'use client';

import { CalendarDays, CalendarRange, Clock3, FileText, Hash } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

import type {
  CrearPeriodoNominaPayload,
  PeriodoNominaDto,
} from '../../../types/nomina-periodos.types';

import { formatNominaDate } from '../utils/nomina-configuracion.utils';
import s from './PeriodoCreateForm.module.css';

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
        <div className={s.formIntro}>
          <div className={s.formBadge}>
            <CalendarRange size={14} />
            Configuración de periodo
          </div>

          <div className={s.formCopy}>
            <h4>Crear o recuperar periodo</h4>
            <p>
              Captura la información base del periodo de nómina para dejarlo listo
              dentro del flujo de procesamiento.
            </p>
          </div>
        </div>

        <div className={s.grid2}>
          <label className={s.field}>
            <span className={s.fieldLabel}>
              <Hash size={14} />
              Año
            </span>

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
            <span className={s.fieldLabel}>
              <CalendarRange size={14} />
              Quincena
            </span>

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
          <span className={s.fieldLabel}>
            <CalendarDays size={14} />
            Fecha de inicio
          </span>

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
          <span className={s.fieldLabel}>
            <CalendarDays size={14} />
            Fecha de fin
          </span>

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
          <span className={s.fieldLabel}>
            <Clock3 size={14} />
            Fecha de pago estimada
          </span>

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
          <div className={s.resultTitleGroup}>
            <div className={s.resultBadge}>
              <FileText size={14} />
              Resultado
            </div>
            <h4>Último registro generado</h4>
          </div>

          <span className={s.typeBadge}>Periodo</span>
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
            <div className={s.emptyIcon}>
              <CalendarRange size={18} />
            </div>
            <p>Todavía no se ha creado ni recuperado ningún periodo.</p>
          </div>
        )}
      </aside>
    </div>
  );
}