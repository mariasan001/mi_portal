'use client';

import { FormEvent, useMemo, useState } from 'react';
import {
  FileText,
  Hash,
  Layers3,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import type {
  CrearVersionNominaPayload,
  NominaStage,
} from '../../../types/nomina-versiones.types';

import s from './VersionCreateForm.module.css';

type Props = {
  loading: boolean;
  ultimaCreada: null;
  onSubmit: (
    payload: Omit<CrearVersionNominaPayload, 'createdByUserId'>
  ) => Promise<void>;
};

export default function VersionCreateForm({
  loading,
  onSubmit,
}: Props) {
  const shouldReduceMotion = useReducedMotion();

  const [form, setForm] = useState<{
    payPeriodId: number;
    stage: NominaStage;
    notes: string;
  }>({
    payPeriodId: 0,
    stage: 'PREVIA',
    notes: '',
  });

  const canSubmit = useMemo(() => {
    return (
      Number.isFinite(form.payPeriodId) &&
      form.payPeriodId > 0 &&
      (form.stage === 'PREVIA' || form.stage === 'INTEGRADA') &&
      !loading
    );
  }, [form, loading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    await onSubmit({
      payPeriodId: form.payPeriodId,
      stage: form.stage,
      notes: form.notes,
    });
  }

  return (
    <motion.form
      className={s.formCard}
      onSubmit={handleSubmit}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className={s.grid2}>
        <label className={s.field}>
          <span className={s.fieldLabel}>
            <span className={s.iconWrap}>
              <Hash size={13} />
            </span>
            Periodo de pago
          </span>

          <input
            type="number"
            min="1"
            value={form.payPeriodId || ''}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                payPeriodId: Number(event.target.value),
              }))
            }
            placeholder="Ej. 4"
          />
        </label>

        <label className={s.field}>
          <span className={s.fieldLabel}>
            <span className={s.iconWrap}>
              <Layers3 size={13} />
            </span>
            Etapa
          </span>

          <select
            value={form.stage}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                stage: event.target.value as NominaStage,
              }))
            }
          >
            <option value="PREVIA">PREVIA</option>
            <option value="INTEGRADA">INTEGRADA</option>
          </select>
        </label>
      </div>

      <div className={s.grid1}>
        <label className={s.field}>
          <span className={s.fieldLabel}>
            <span className={s.iconWrap}>
              <FileText size={13} />
            </span>
            Notas
          </span>

          <textarea
            rows={6}
            value={form.notes}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                notes: event.target.value,
              }))
            }
            placeholder="Escribe aquí observaciones de la versión"
          />
        </label>
      </div>

      <div className={s.actions}>
        <motion.button
          type="submit"
          className={s.submitBtn}
          disabled={!canSubmit}
          whileHover={!shouldReduceMotion && canSubmit ? { y: -1 } : undefined}
          whileTap={!shouldReduceMotion && canSubmit ? { scale: 0.99 } : undefined}
        >
          {loading ? 'Procesando...' : 'Crear versión'}
        </motion.button>
      </div>
    </motion.form>
  );
}