import type { VersionNominaDto } from '../../../types/nomina-versiones.types';
import { formatNominaBool, formatNominaDate } from '../utils/nomina-configuracion.utils';

import s from './VersionResultadoPanel.module.css';

type Props = {
  detalle: VersionNominaDto;
};

export default function VersionResultadoPanel({ detalle }: Props) {
  return (
    <section className={s.panel}>
      <dl className={s.grid}>
        <div className={s.item}>
          <dt>ID de versión</dt>
          <dd>{detalle.versionId}</dd>
        </div>

        <div className={s.item}>
          <dt>Periodo de pago</dt>
          <dd>{detalle.payPeriodId}</dd>
        </div>

        <div className={s.item}>
          <dt>Código del periodo</dt>
          <dd>{detalle.periodCode}</dd>
        </div>

        <div className={s.item}>
          <dt>Etapa</dt>
          <dd>{detalle.stage}</dd>
        </div>

        <div className={s.item}>
          <dt>Estatus</dt>
          <dd>{detalle.status}</dd>
        </div>

        <div className={s.item}>
          <dt>Actual</dt>
          <dd>{formatNominaBool(detalle.isCurrent)}</dd>
        </div>

        <div className={s.item}>
          <dt>Liberada</dt>
          <dd>{formatNominaBool(detalle.released)}</dd>
        </div>

        <div className={s.item}>
          <dt>Notas</dt>
          <dd>{detalle.notes || '—'}</dd>
        </div>

        <div className={s.item}>
          <dt>Fecha de carga</dt>
          <dd>{formatNominaDate(detalle.loadedAt)}</dd>
        </div>
      </dl>
    </section>
  );
}