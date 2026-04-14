'use client';

import {
  CalendarDays,
  CalendarRange,
  CreditCard,
  Hash,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import type { PeriodoNominaDto } from '../../../types/nomina-periodos.types';
import { formatNominaDate } from '../utils/nomina-configuracion.utils';
import s from './PeriodoResultadoPanel.module.css';

type Props = {
  detalle: PeriodoNominaDto;
};

export default function PeriodoResultadoPanel({ detalle }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={s.panel}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <div className={s.summaryCard}>
        <div className={s.identity}>
          <div className={s.identityIndex}>P</div>

          <div className={s.identityContent}>
            <div className={s.identityHeader}>
              <h5>Periodo de nómina</h5>
            </div>

            <div className={s.identityMeta}>
              <div className={s.metaItem}>
                <span className={s.metaLabel}>Año</span>
                <strong>{detalle.anio}</strong>
              </div>

              <div className={s.metaItem}>
                <span className={s.metaLabel}>Quincena</span>
                <strong>{detalle.quincena}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className={s.timeline}>
          <div className={s.timelineBar} />

          <div className={s.timelineSteps}>
            <div className={s.step}>
              <div className={s.stepIcon}>
                <CalendarDays size={14} />
              </div>
              <div className={s.stepCopy}>
                <span>Inicio</span>
                <strong>{formatNominaDate(detalle.fechaInicio)}</strong>
              </div>
            </div>

            <div className={s.step}>
              <div className={s.stepIcon}>
                <CalendarRange size={14} />
              </div>
              <div className={s.stepCopy}>
                <span>Fin</span>
                <strong>{formatNominaDate(detalle.fechaFin)}</strong>
              </div>
            </div>

            <div className={s.step}>
              <div className={s.stepIcon}>
                <CreditCard size={14} />
              </div>
              <div className={s.stepCopy}>
                <span>Pago estimado</span>
                <strong>{formatNominaDate(detalle.fechaPagoEstimada)}</strong>
              </div>
            </div>
          </div>

          <div className={s.codeInline}>
            <div className={s.codeInlineHead}>
              <div className={s.codeInlineIcon}>
                <Hash size={13} />
              </div>
              <span>Código del periodo</span>
            </div>

            <strong>{detalle.periodoCode || '—'}</strong>
          </div>
        </div>

        <div className={s.kpis}>
          <div className={s.kpiCard}>
            <span className={s.kpiLabel}>ID</span>
            <strong className={s.kpiValue}>{detalle.periodId}</strong>
          </div>

          <div className={s.kpiCard}>
            <span className={s.kpiLabel}>Registro</span>
            <strong className={s.kpiValueText}>Periodo</strong>
          </div>
        </div>
      </div>
    </motion.section>
  );
}