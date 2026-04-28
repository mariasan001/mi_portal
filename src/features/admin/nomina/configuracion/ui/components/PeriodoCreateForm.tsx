import { CalendarDays, CalendarRange, Clock3, Hash, Sparkles } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

import type { CrearPeriodoNominaPayload } from '@/features/admin/nomina/shared/model/periodos.types';
import s from './PeriodoCreateForm.module.css';

type Props = {
  loading: boolean;
  ultimoCreado: null;
  onSubmit: (payload: CrearPeriodoNominaPayload) => Promise<void>;
};

function getRangeMessage(form: CrearPeriodoNominaPayload) {
  if (!form.fechaInicio || !form.fechaFin) return null;
  if (form.fechaFin < form.fechaInicio) {
    return 'La fecha de fin no puede ser anterior a la fecha de inicio.';
  }

  if (form.fechaPagoEstimada && form.fechaPagoEstimada < form.fechaFin) {
    return 'La fecha de pago estimada suele ser igual o posterior a la fecha de fin.';
  }

  return null;
}

export default function PeriodoCreateForm({ loading, onSubmit }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, index) => currentYear - 1 + index);
  const quincenaOptions = Array.from({ length: 24 }, (_, index) => index + 1);

  const [form, setForm] = useState<CrearPeriodoNominaPayload>({
    anio: currentYear,
    quincena: 1,
    fechaInicio: '',
    fechaFin: '',
    fechaPagoEstimada: '',
  });

  const validationMessage = useMemo(() => getRangeMessage(form), [form]);

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
      !validationMessage &&
      !loading
    );
  }, [form, loading, validationMessage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;
    await onSubmit(form);
  }

  return (
    <motion.form
      className={s.formCard}
      onSubmit={handleSubmit}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className={s.topbar}>
        <div className={s.guide}>
          <span className={s.guideIcon}>
            <Sparkles size={14} />
          </span>
          <p>
            Captura la identidad del período y luego define sus fechas operativas.
          </p>
        </div>

        <div className={s.metaPills}>
          <span className={s.metaPill}>Año {form.anio || '—'}</span>
          <span className={s.metaPill}>Quincena {form.quincena || '—'}</span>
        </div>
      </div>

      <section className={s.sectionCard}>
        <div className={s.sectionHeader}>
          <div>
            <h4>Identificación</h4>
            <p>Define los datos base con los que se registra o recupera el período.</p>
          </div>
        </div>

        <div className={s.grid2}>
          <label className={s.field}>
            <span className={s.fieldLabel}>
              <span className={s.iconWrap}>
                <Hash size={12} />
              </span>
              Año
            </span>

            <select
              value={form.anio}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  anio: Number(event.target.value),
                }))
              }
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <small className={s.helper}>Usa el año fiscal o administrativo del período.</small>
          </label>

          <label className={s.field}>
            <span className={s.fieldLabel}>
              <span className={s.iconWrap}>
                <CalendarRange size={12} />
              </span>
              Quincena
            </span>

            <select
              value={form.quincena}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  quincena: Number(event.target.value),
                }))
              }
            >
              {quincenaOptions.map((value) => (
                <option key={value} value={value}>
                  Quincena {value}
                </option>
              ))}
            </select>
            <small className={s.helper}>Captura un valor entre 1 y 24.</small>
          </label>
        </div>
      </section>

      <section className={s.sectionCard}>
        <div className={s.sectionHeader}>
          <div>
            <h4>Calendario operativo</h4>
            <p>Estas fechas marcan el inicio, cierre y pago esperado del período.</p>
          </div>
        </div>

        <div className={s.grid3}>
          <label className={s.field}>
            <span className={s.fieldLabel}>
              <span className={s.iconWrap}>
                <CalendarDays size={12} />
              </span>
              Fecha de inicio
            </span>

            <input
              type="date"
              value={form.fechaInicio}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  fechaInicio: event.target.value,
                }))
              }
            />
          </label>

          <label className={s.field}>
            <span className={s.fieldLabel}>
              <span className={s.iconWrap}>
                <CalendarDays size={12} />
              </span>
              Fecha de fin
            </span>

            <input
              type="date"
              value={form.fechaFin}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  fechaFin: event.target.value,
                }))
              }
            />
          </label>

          <label className={s.field}>
            <span className={s.fieldLabel}>
              <span className={s.iconWrap}>
                <Clock3 size={12} />
              </span>
              Fecha de pago estimada
            </span>

            <input
              type="date"
              value={form.fechaPagoEstimada}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  fechaPagoEstimada: event.target.value,
                }))
              }
            />
          </label>
        </div>
      </section>

      {validationMessage ? <p className={s.validation}>{validationMessage}</p> : null}

      <div className={s.actions}>
        <motion.button
          type="submit"
          className={s.submitBtn}
          disabled={!canSubmit}
          whileHover={!shouldReduceMotion && canSubmit ? { y: -1 } : undefined}
          whileTap={!shouldReduceMotion && canSubmit ? { scale: 0.99 } : undefined}
        >
          {loading ? 'Procesando...' : 'Crear o recuperar período'}
        </motion.button>
      </div>
    </motion.form>
  );
}
