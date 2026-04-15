'use client';

import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Layers3,
  ShieldCheck,
  UserCircle2,
  XCircle,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import s from './NominaMonitoreoResultadoPanel.module.css';
import { NominaPeriodoEstadoDto } from '@/features/admin/types/nomina-monitoreo.types';

type Props = {
  detalle: NominaPeriodoEstadoDto;
};

function boolLabel(value: boolean) {
  return value ? 'Sí' : 'No';
}

function formatDate(value: string | null) {
  if (!value) return 'Sin fecha registrada';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsed);
}

function formatNullable(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return 'Sin registro';
  }

  return String(value);
}

function getStateClass(okValue: boolean, warn = false) {
  if (warn) return s.stateWarn;
  return okValue ? s.stateOk : s.stateOff;
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

type CheckItemProps = {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: boolean;
  warn?: boolean;
};

function CheckItem({
  icon,
  label,
  description,
  value,
  warn = false,
}: CheckItemProps) {
  return (
    <motion.article
      className={`${s.checkItem} ${getStateClass(value, warn)}`}
      variants={itemVariants}
      transition={{ duration: 0.2 }}
    >
      <div className={s.checkItemLeft}>
        <div className={s.checkIcon}>{icon}</div>

        <div className={s.checkCopy}>
          <span>{label}</span>
          <small>{description}</small>
        </div>
      </div>

      <div className={s.checkBadge}>{boolLabel(value)}</div>
    </motion.article>
  );
}

export default function NominaMonitoreoResultadoPanel({ detalle }: Props) {
  const shouldReduceMotion = useReducedMotion();

  const mainStatus = detalle.released
    ? 'Periodo liberado'
    : detalle.validated
      ? 'Periodo validado'
      : 'Periodo en revisión';

  const mainStatusClass = detalle.released
    ? s.statusSuccess
    : detalle.validated
      ? s.statusNeutral
      : s.statusWarn;

  return (
    <motion.section
      className={s.panel}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <div className={s.sectionHeader}>
        <div className={s.headerCopy}>
          <span className={s.kicker}>Resultado</span>
          <h3>Monitoreo del periodo</h3>
          <p>
            Vista consolidada con el contexto del periodo, versiones activas y
            estado operativo general.
          </p>
        </div>
      </div>

      <motion.div
        className={s.hero}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate={shouldReduceMotion ? undefined : 'show'}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        <motion.div
          className={s.heroMain}
          variants={itemVariants}
          transition={{ duration: 0.22 }}
        >
          <div className={s.heroTop}>
            <div className={s.heroBadge}>
              <FileText size={14} />
              <span>Periodo consultado</span>
            </div>

            <div className={`${s.heroStatus} ${mainStatusClass}`}>
              <span className={s.heroStatusDot} />
              {mainStatus}
            </div>
          </div>

          <div className={s.heroBody}>
            <div>
              <p className={s.heroLabel}>Código del periodo</p>
              <h4 className={s.heroCode}>{formatNullable(detalle.periodCode)}</h4>
            </div>

            <div className={s.heroMiniGrid}>
              <div className={s.heroMiniCard}>
                <span>Año</span>
                <strong>{formatNullable(detalle.anio)}</strong>
              </div>

              <div className={s.heroMiniCard}>
                <span>Quincena</span>
                <strong>{formatNullable(detalle.quincena)}</strong>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={s.heroAside}
          variants={itemVariants}
          transition={{ duration: 0.22 }}
        >
          <div className={s.asideCard}>
            <div className={s.asideHead}>
              <Clock3 size={14} />
              <span>Fecha de liberación</span>
            </div>
            <strong>{formatDate(detalle.releasedAt)}</strong>
          </div>

          <div className={s.asideCard}>
            <div className={s.asideHead}>
              <UserCircle2 size={14} />
              <span>Usuario que liberó</span>
            </div>
            <strong>{formatNullable(detalle.releasedByUserId)}</strong>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className={s.metricsGrid}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate={shouldReduceMotion ? undefined : 'show'}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        <motion.div
          className={s.metricCard}
          variants={itemVariants}
          transition={{ duration: 0.2 }}
        >
          <div className={s.metricIcon}>
            <Layers3 size={14} />
          </div>
          <div className={s.metricContent}>
            <span>Versión previa</span>
            <strong>{formatNullable(detalle.currentPreviaVersionId)}</strong>
          </div>
        </motion.div>

        <motion.div
          className={s.metricCard}
          variants={itemVariants}
          transition={{ duration: 0.2 }}
        >
          <div className={s.metricIcon}>
            <Layers3 size={14} />
          </div>
          <div className={s.metricContent}>
            <span>Versión integrada</span>
            <strong>{formatNullable(detalle.currentIntegradaVersionId)}</strong>
          </div>
        </motion.div>

        <motion.div
          className={s.metricCard}
          variants={itemVariants}
          transition={{ duration: 0.2 }}
        >
          <div className={s.metricIcon}>
            <ShieldCheck size={14} />
          </div>
          <div className={s.metricContent}>
            <span>Liberación</span>
            <strong>{boolLabel(detalle.released)}</strong>
          </div>
        </motion.div>
      </motion.div>

      <div className={s.flagsSection}>
        <div className={s.flagsHeader}>
          <div>
            <span className={s.blockEyebrow}>Operación</span>
            <h4>Estado operativo</h4>
            <p>
              Seguimiento rápido sobre carga, validación, incidencias y control
              de salida.
            </p>
          </div>
        </div>

        <motion.div
          className={s.flagsGrid}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'show'}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.04,
              },
            },
          }}
        >
          <CheckItem
            icon={<CheckCircle2 size={14} />}
            label="Previa cargada"
            description="Archivo de previa disponible para operación."
            value={detalle.previaLoaded}
          />

          <CheckItem
            icon={<CheckCircle2 size={14} />}
            label="Integrada cargada"
            description="Versión integrada presente en el periodo."
            value={detalle.integradaLoaded}
          />

          <CheckItem
            icon={<CheckCircle2 size={14} />}
            label="Catálogo cargado"
            description="Catálogo base listo para el flujo de nómina."
            value={detalle.catalogLoaded}
          />

          <CheckItem
            icon={<CheckCircle2 size={14} />}
            label="Validado"
            description="La validación operativa del periodo fue completada."
            value={detalle.validated}
          />

          <CheckItem
            icon={<ShieldCheck size={14} />}
            label="Liberado"
            description="El periodo ya fue liberado para su salida."
            value={detalle.released}
          />

          <CheckItem
            icon={<XCircle size={14} />}
            label="Cancelaciones"
            description="Indica si existen cancelaciones registradas."
            value={detalle.hasCancellations}
            warn={detalle.hasCancellations}
          />

          <CheckItem
            icon={<AlertTriangle size={14} />}
            label="Reexpediciones"
            description="Indica si existen reexpediciones en el periodo."
            value={detalle.hasReexpeditions}
            warn={detalle.hasReexpeditions}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}