'use client';

import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Hash,
  Layers3,
  ShieldCheck,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import type { VersionNominaDto } from '../../../types/nomina-versiones.types';

import s from './VersionResultadoPanel.module.css';
import { formatNominaBool, formatNominaDateTimeLong, formatNominaTitle } from '../utils/nomina-configuracion_tex.utils';

type Props = {
  detalle: VersionNominaDto;
};

function getBoolTextTone(value: boolean | null | undefined) {
  return value ? s.textSuccess : s.textMuted;
}

function getBoolIconTone(value: boolean | null | undefined) {
  return value ? s.iconSuccess : s.iconMuted;
}

function getStatusTextTone(status?: string | null) {
  const normalized = String(status ?? '')
    .trim()
    .toUpperCase();

  if (normalized === 'RELEASED') return s.textSuccess;
  if (normalized === 'LOADED') return s.textInfo;
  if (normalized === 'FAILED' || normalized === 'ERROR') return s.textDanger;
  if (normalized === 'PENDING' || normalized === 'PROCESSING') {
    return s.textWarning;
  }

  return s.textMuted;
}

export default function VersionResultadoPanel({ detalle }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={s.panel}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className={s.summaryCard}>
        <div className={s.identity}>
          <div className={s.identityIndex}>V</div>

          <div className={s.identityContent}>
            <h5>Versión de nómina</h5>

            <div className={s.identityMeta}>
              <div className={s.metaItem}>
                <span className={s.metaLabel}>Etapa</span>
                <strong>{formatNominaTitle(detalle.stage)}</strong>
              </div>

              <div className={s.metaItem}>
                <span className={s.metaLabel}>Estatus</span>
                <strong className={getStatusTextTone(detalle.status)}>
                  {formatNominaTitle(detalle.status)}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className={s.center}>
          <div className={s.signalGrid}>
            <div className={s.signalCard}>
              <div className={s.signalHead}>
                <div className={`${s.signalIcon} ${s.iconDefault}`}>
                  <Layers3 size={14} />
                </div>
                <span>Periodo de pago</span>
              </div>

              <strong className={s.signalValue}>{detalle.payPeriodId}</strong>
            </div>

            <div className={s.signalCard}>
              <div className={s.signalHead}>
                <div
                  className={`${s.signalIcon} ${getBoolIconTone(detalle.isCurrent)}`}
                >
                  <ShieldCheck size={14} />
                </div>
                <span>Actual</span>
              </div>

              <strong className={getBoolTextTone(detalle.isCurrent)}>
                {formatNominaBool(detalle.isCurrent)}
              </strong>
            </div>

            <div className={s.signalCard}>
              <div className={s.signalHead}>
                <div
                  className={`${s.signalIcon} ${getBoolIconTone(detalle.released)}`}
                >
                  <CheckCircle2 size={14} />
                </div>
                <span>Liberada</span>
              </div>

              <strong className={getBoolTextTone(detalle.released)}>
                {formatNominaBool(detalle.released)}
              </strong>
            </div>
          </div>

          <div className={s.inlineInfoRow}>
            <div className={s.inlineBlock}>
              <div className={s.inlineHead}>
                <div className={s.inlineIcon}>
                  <Hash size={13} />
                </div>
                <span>Código del periodo</span>
              </div>
              <strong>{detalle.periodCode || '—'}</strong>
            </div>

            <div className={s.inlineBlock}>
              <div className={s.inlineHead}>
                <div className={s.inlineIcon}>
                  <CalendarDays size={13} />
                </div>
                <span>Fecha de carga</span>
              </div>
              <strong>{formatNominaDateTimeLong(detalle.loadedAt)}</strong>
            </div>
          </div>

          <div className={s.notesCard}>
            <div className={s.notesHead}>
              <div className={s.notesIcon}>
                <FileText size={13} />
              </div>
              <span>Notas</span>
            </div>

            <p>{detalle.notes || 'Sin observaciones registradas'}</p>
          </div>
        </div>

        <div className={s.kpis}>
          <div className={s.kpiCard}>
            <span className={s.kpiLabel}>Versión ID</span>
            <strong className={s.kpiValue}>{detalle.versionId}</strong>
          </div>

          <div className={s.kpiCard}>
            <span className={s.kpiLabel}>Registro</span>
            <strong className={s.kpiValueText}>Versión</strong>
          </div>
        </div>
      </div>
    </motion.section>
  );
}