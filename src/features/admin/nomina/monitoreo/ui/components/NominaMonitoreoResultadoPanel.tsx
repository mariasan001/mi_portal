import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  UserCircle2,
  XCircle,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import type { MonitoreoTone } from '@/features/admin/nomina/monitoreo/model/monitoreo.selectors';
import {
  boolLabel,
  formatMonitoreoDate,
  formatNullable,
  getMonitoreoMainStatus,
  getMonitoreoOperationItems,
  getMonitoreoOperationStats,
} from '@/features/admin/nomina/monitoreo/model/monitoreo.selectors';
import type { NominaPeriodoEstadoDto } from '@/features/admin/nomina/monitoreo/model/monitoreo.types';

import s from './NominaMonitoreoResultadoPanel.module.css';

type Props = {
  detalle: NominaPeriodoEstadoDto;
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const statusIconMap: Record<MonitoreoTone, typeof CheckCircle2> = {
  ok: CheckCircle2,
  warn: AlertTriangle,
  danger: XCircle,
  neutral: ShieldCheck,
};

const statusClassMap: Record<MonitoreoTone, string> = {
  ok: s.statusOk,
  warn: s.statusWarn,
  danger: s.statusDanger,
  neutral: s.statusNeutral,
};

const rowClassMap: Record<MonitoreoTone, string> = {
  ok: s.itemOk,
  warn: s.itemWarn,
  danger: s.itemDanger,
  neutral: s.itemNeutral,
};

const badgeClassMap: Record<MonitoreoTone, string> = {
  ok: s.badgeOk,
  warn: s.badgeWarn,
  danger: s.badgeDanger,
  neutral: s.badgeNeutral,
};

export default function NominaMonitoreoResultadoPanel({ detalle }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const mainStatus = getMonitoreoMainStatus(detalle);
  const operationStats = getMonitoreoOperationStats(detalle);
  const operationItems = getMonitoreoOperationItems(detalle);
  const MainStatusIcon = statusIconMap[mainStatus.tone];

  return (
    <motion.section
      className={s.panel}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
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
        <motion.div className={s.header} variants={itemVariants}>
          <div className={s.headerCopy}>
            <h3>{formatNullable(detalle.periodCode)}</h3>
            <p>
              {formatNullable(detalle.anio)} · Quincena {formatNullable(detalle.quincena)}
            </p>
          </div>

          <div className={`${s.statusPill} ${statusClassMap[mainStatus.tone]}`}>
            <MainStatusIcon size={14} />
            {mainStatus.label}
          </div>
        </motion.div>

        <motion.div className={s.metaRow} variants={itemVariants}>
          <article className={s.metaItem}>
            <div className={s.metaHead}>
              <Clock3 size={14} />
              <span>Fecha de liberacion</span>
            </div>
            <div className={s.metaBody}>
              <strong>{formatMonitoreoDate(detalle.releasedAt)}</strong>
            </div>
          </article>

          <article className={s.metaItem}>
            <div className={s.metaHead}>
              <UserCircle2 size={14} />
              <span>Usuario que libero</span>
            </div>
            <div className={s.metaBody}>
              <strong>{formatNullable(detalle.releasedByUserId)}</strong>
            </div>
          </article>
        </motion.div>

        <motion.section className={s.operationBlock} variants={itemVariants}>
          <div className={s.operationHeader}>
            <h4>Estado operativo</h4>
            <span className={s.progressPill}>
              {operationStats.okCount}/{operationStats.total}
            </span>
          </div>

          <div className={s.operationList}>
            {operationItems.map((item) => {
              const Icon = statusIconMap[item.tone];

              return (
                <article
                  key={item.label}
                  className={`${s.operationRow} ${rowClassMap[item.tone]}`}
                >
                  <div className={s.operationMain}>
                    <div className={s.operationIcon}>
                      <Icon size={14} />
                    </div>

                    <div className={s.operationCopy}>
                      <strong>{item.label}</strong>
                      <p>{item.hint}</p>
                    </div>
                  </div>

                  <span className={`${s.operationBadge} ${badgeClassMap[item.tone]}`}>
                    {boolLabel(item.value)}
                  </span>
                </article>
              );
            })}
          </div>
        </motion.section>
      </motion.div>
    </motion.section>
  );
}
