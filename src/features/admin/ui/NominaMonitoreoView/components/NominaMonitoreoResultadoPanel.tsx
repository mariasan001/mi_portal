
import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
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

function getToneClass(value: boolean, warn = false) {
  if (warn) return s.warn;
  return value ? s.ok : s.off;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

type StatusItemProps = {
  icon: React.ReactNode;
  label: string;
  hint: string;
  value: boolean;
  warn?: boolean;
};

function StatusItem({
  icon,
  label,
  hint,
  value,
  warn = false,
}: StatusItemProps) {
  return (
    <li className={`${s.taskItem} ${getToneClass(value, warn)}`}>
      <div className={s.taskLeft}>
        <div className={s.taskIcon}>{icon}</div>

        <div className={s.taskCopy}>
          <span>{label}</span>
          <small>{hint}</small>
        </div>
      </div>

      <div className={s.taskRight}>
        <span className={s.taskBadge}>{boolLabel(value)}</span>
      </div>
    </li>
  );
}

export default function NominaMonitoreoResultadoPanel({ detalle }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const [isOperationOpen, setIsOperationOpen] = useState(true);

  const mainStatus = detalle.released
    ? 'Periodo liberado'
    : detalle.validated
      ? 'Periodo validado'
      : 'Periodo en revisión';

  const mainStatusClass = detalle.released
    ? s.statusPillOk
    : detalle.validated
      ? s.statusPillNeutral
      : s.statusPillWarn;

  const operationStats = useMemo(() => {
    const okCount = [
      detalle.previaLoaded,
      detalle.integradaLoaded,
      detalle.catalogLoaded,
      detalle.validated,
      detalle.released,
      !detalle.hasCancellations,
      !detalle.hasReexpeditions,
    ].filter(Boolean).length;

    return {
      okCount,
      total: 7,
    };
  }, [
    detalle.previaLoaded,
    detalle.integradaLoaded,
    detalle.catalogLoaded,
    detalle.validated,
    detalle.released,
    detalle.hasCancellations,
    detalle.hasReexpeditions,
  ]);

  return (
    <motion.section
      className={s.panel}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <motion.div
        className={s.sheet}
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
        <motion.div
          className={s.topBar}
          variants={itemVariants}
          transition={{ duration: 0.2 }}
        >
          <div className={s.topBarLeft}>
            <div className={s.docIcon}>
              <FileText size={14} />
            </div>

            <div className={s.topBarCopy}>
              <span className={s.topBarLabel}>Código del periodo</span>
              <strong>{formatNullable(detalle.periodCode)}</strong>
            </div>
          </div>

          <div className={`${s.statusPill} ${mainStatusClass}`}>
            <span className={s.statusDot} />
            {mainStatus}
          </div>
        </motion.div>

        <motion.div
          className={s.summaryGrid}
          variants={itemVariants}
          transition={{ duration: 0.2 }}
        >
          <article className={s.primaryCard}>
            <div className={s.primaryTop}>
              <div className={s.avatar}>P</div>

              <div className={s.primaryCopy}>
                <span className={s.cardEyebrow}>Periodo de nómina</span>
                <h4>{formatNullable(detalle.periodCode)}</h4>
              </div>
            </div>

            <div className={s.primaryMeta}>
              <div className={s.metaChip}>
                <span>Año</span>
                <strong>{formatNullable(detalle.anio)}</strong>
              </div>

              <div className={s.metaChip}>
                <span>Quincena</span>
                <strong>{formatNullable(detalle.quincena)}</strong>
              </div>
            </div>
          </article>

          <article className={s.sideStack}>
            <div className={s.infoRow}>
              <div className={s.infoHead}>
                <Clock3 size={14} />
                <span>Fecha de liberación</span>
              </div>
              <strong>{formatDate(detalle.releasedAt)}</strong>
            </div>

            <div className={s.infoRow}>
              <div className={s.infoHead}>
                <UserCircle2 size={14} />
                <span>Usuario que liberó</span>
              </div>
              <strong>{formatNullable(detalle.releasedByUserId)}</strong>
            </div>
          </article>
        </motion.div>

        <motion.div
          className={s.versionStrip}
          variants={itemVariants}
          transition={{ duration: 0.2 }}
        >
          <article className={s.versionItem}>
            <div className={s.versionIcon}>
              <Layers3 size={14} />
            </div>
            <div className={s.versionCopy}>
              <span>Versión previa</span>
              <strong>{formatNullable(detalle.currentPreviaVersionId)}</strong>
            </div>
          </article>

          <article className={s.versionItem}>
            <div className={s.versionIcon}>
              <Layers3 size={14} />
            </div>
            <div className={s.versionCopy}>
              <span>Versión integrada</span>
              <strong>{formatNullable(detalle.currentIntegradaVersionId)}</strong>
            </div>
          </article>

          <article className={s.versionItem}>
            <div className={s.versionIcon}>
              <ShieldCheck size={14} />
            </div>
            <div className={s.versionCopy}>
              <span>Liberación</span>
              <strong>{boolLabel(detalle.released)}</strong>
            </div>
          </article>
        </motion.div>

        <motion.section
          className={s.operationBlock}
          variants={itemVariants}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className={s.accordionTrigger}
            onClick={() => setIsOperationOpen((prev) => !prev)}
            aria-expanded={isOperationOpen}
          >
            <div className={s.accordionCopy}>
              <span className={s.blockEyebrow}>Operación</span>
              <h4>Estado operativo</h4>
              <p>Lista rápida del flujo actual del periodo.</p>
            </div>

            <div className={s.accordionSide}>
              <span className={s.progressPill}>
                {operationStats.okCount}/{operationStats.total}
              </span>

              <span
                className={`${s.chevronWrap} ${
                  isOperationOpen ? s.chevronOpen : ''
                }`}
              >
                <ChevronDown size={16} />
              </span>
            </div>
          </button>

          <div
            className={`${s.accordionPanel} ${
              isOperationOpen ? s.accordionPanelOpen : ''
            }`}
          >
            <div className={s.accordionInner}>
              <ul className={s.taskList}>
                <StatusItem
                  icon={<CheckCircle2 size={14} />}
                  label="Previa cargada"
                  hint="Archivo de previa disponible para operación."
                  value={detalle.previaLoaded}
                />

                <StatusItem
                  icon={<CheckCircle2 size={14} />}
                  label="Integrada cargada"
                  hint="Versión integrada registrada en el periodo."
                  value={detalle.integradaLoaded}
                />

                <StatusItem
                  icon={<CheckCircle2 size={14} />}
                  label="Catálogo cargado"
                  hint="Catálogo base listo para el flujo de nómina."
                  value={detalle.catalogLoaded}
                />

                <StatusItem
                  icon={<CheckCircle2 size={14} />}
                  label="Validado"
                  hint="La validación operativa del periodo fue completada."
                  value={detalle.validated}
                />

                <StatusItem
                  icon={<ShieldCheck size={14} />}
                  label="Liberado"
                  hint="El periodo ya fue liberado para su salida."
                  value={detalle.released}
                />

                <StatusItem
                  icon={<XCircle size={14} />}
                  label="Cancelaciones"
                  hint="Muestra si existen cancelaciones registradas."
                  value={detalle.hasCancellations}
                  warn={detalle.hasCancellations}
                />

                <StatusItem
                  icon={<AlertTriangle size={14} />}
                  label="Reexpediciones"
                  hint="Muestra si existen reexpediciones en el periodo."
                  value={detalle.hasReexpeditions}
                  warn={detalle.hasReexpeditions}
                />
              </ul>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </motion.section>
  );
}