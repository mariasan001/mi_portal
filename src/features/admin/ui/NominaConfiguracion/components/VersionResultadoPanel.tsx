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
import {
  formatNominaBool,
  formatNominaDate,
} from '../utils/nomina-configuracion.utils';

import s from './VersionResultadoPanel.module.css';

type Props = {
  detalle: VersionNominaDto;
};

export default function VersionResultadoPanel({ detalle }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={s.panel}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className={s.intro}>
        <div className={s.introBadge}>
          <FileText size={13} />
          Resultado de la versión
        </div>

        <div className={s.introCopy}>
          <h4>Detalle de la versión consultada</h4>
          <p>
            Revisa la información principal de la versión de nómina
            seleccionada.
          </p>
        </div>
      </div>

      <dl className={s.grid}>
        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Hash size={14} />
            </div>
            <dt>ID de versión</dt>
          </div>
          <dd>{detalle.versionId}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Hash size={14} />
            </div>
            <dt>Periodo de pago</dt>
          </div>
          <dd>{detalle.payPeriodId}</dd>
        </div>

        <div className={`${s.item} ${s.itemWide}`}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <FileText size={14} />
            </div>
            <dt>Código del periodo</dt>
          </div>
          <dd>{detalle.periodCode}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Layers3 size={14} />
            </div>
            <dt>Etapa</dt>
          </div>
          <dd>{detalle.stage}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <CheckCircle2 size={14} />
            </div>
            <dt>Estatus</dt>
          </div>
          <dd>{detalle.status}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <ShieldCheck size={14} />
            </div>
            <dt>Actual</dt>
          </div>
          <dd>{formatNominaBool(detalle.isCurrent)}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <ShieldCheck size={14} />
            </div>
            <dt>Liberada</dt>
          </div>
          <dd>{formatNominaBool(detalle.released)}</dd>
        </div>

        <div className={`${s.item} ${s.itemWide}`}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <FileText size={14} />
            </div>
            <dt>Notas</dt>
          </div>
          <dd>{detalle.notes || 'Sin observaciones registradas'}</dd>
        </div>

        <div className={`${s.item} ${s.itemWide}`}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <CalendarDays size={14} />
            </div>
            <dt>Fecha de carga</dt>
          </div>
          <dd>{formatNominaDate(detalle.loadedAt)}</dd>
        </div>
      </dl>
    </motion.section>
  );
}