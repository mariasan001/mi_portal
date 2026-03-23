import {
  CalendarDays,
  CalendarRange,
  CreditCard,
  FileText,
  Hash,
} from 'lucide-react';

import type { PeriodoNominaDto } from '../../../types/nomina-periodos.types';
import { formatNominaDate } from '../utils/nomina-configuracion.utils';
import s from './PeriodoResultadoPanel.module.css';

type Props = {
  detalle: PeriodoNominaDto;
};

export default function PeriodoResultadoPanel({ detalle }: Props) {
  return (
    <section className={s.panel}>
      <div className={s.intro}>
        <div className={s.introBadge}>
          <FileText size={14} />
          Resultado del periodo
        </div>

        <div className={s.introCopy}>
          <h4>Detalle del periodo consultado</h4>
          <p>
            Revisa la información principal del periodo de nómina seleccionado.
          </p>
        </div>
      </div>

      <dl className={s.grid}>
        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Hash size={15} />
            </div>
            <dt>ID del periodo</dt>
          </div>
          <dd>{detalle.periodId}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <Hash size={15} />
            </div>
            <dt>Año</dt>
          </div>
          <dd>{detalle.anio}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <CalendarRange size={15} />
            </div>
            <dt>Quincena</dt>
          </div>
          <dd>{detalle.quincena}</dd>
        </div>

        <div className={`${s.item} ${s.itemWide}`}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <FileText size={15} />
            </div>
            <dt>Código del periodo</dt>
          </div>
          <dd>{detalle.periodoCode}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <CalendarDays size={15} />
            </div>
            <dt>Fecha de inicio</dt>
          </div>
          <dd>{formatNominaDate(detalle.fechaInicio)}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <CalendarDays size={15} />
            </div>
            <dt>Fecha de fin</dt>
          </div>
          <dd>{formatNominaDate(detalle.fechaFin)}</dd>
        </div>

        <div className={s.item}>
          <div className={s.itemHead}>
            <div className={s.iconWrap}>
              <CreditCard size={15} />
            </div>
            <dt>Fecha de pago estimada</dt>
          </div>
          <dd>{formatNominaDate(detalle.fechaPagoEstimada)}</dd>
        </div>
      </dl>
    </section>
  );
}