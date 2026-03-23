import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Hash,
  Layers3,
  ShieldCheck,
} from 'lucide-react';

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
  return (
    <section className={s.panel}>
      <div className={s.intro}>
        <div className={s.introBadge}>
          <FileText size={14} />
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
              <Hash size={15} />
            </div>
            <dt>ID de versión</dt>
          </div>
          <dd>{detalle.versionId}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Hash size={15} />
            </div>
            <dt>Periodo de pago</dt>
          </div>
          <dd>{detalle.payPeriodId}</dd>
        </div>

        <div className={`${s.item} ${s.itemWide}`}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <FileText size={15} />
            </div>
            <dt>Código del periodo</dt>
          </div>
          <dd>{detalle.periodCode}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Layers3 size={15} />
            </div>
            <dt>Etapa</dt>
          </div>
          <dd>{detalle.stage}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <CheckCircle2 size={15} />
            </div>
            <dt>Estatus</dt>
          </div>
          <dd>{detalle.status}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <ShieldCheck size={15} />
            </div>
            <dt>Actual</dt>
          </div>
          <dd>{formatNominaBool(detalle.isCurrent)}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <ShieldCheck size={15} />
            </div>
            <dt>Liberada</dt>
          </div>
          <dd>{formatNominaBool(detalle.released)}</dd>
        </div>

        <div className={`${s.item} ${s.itemWide}`}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <FileText size={15} />
            </div>
            <dt>Notas</dt>
          </div>
          <dd>{detalle.notes || 'Sin observaciones registradas'}</dd>
        </div>

        <div className={`${s.item} ${s.itemWide}`}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <CalendarDays size={15} />
            </div>
            <dt>Fecha de carga</dt>
          </div>
          <dd>{formatNominaDate(detalle.loadedAt)}</dd>
        </div>
      </dl>
    </section>
  );
}