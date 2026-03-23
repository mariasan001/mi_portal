import type { PeriodoNominaDto } from '../../../types/nomina-periodos.types';
import { formatNominaDate } from '../utils/nomina-configuracion.utils';
import s from './PeriodoResultadoPanel.module.css';

type Props = {
  detalle: PeriodoNominaDto;
};

export default function PeriodoResultadoPanel({ detalle }: Props) {
  return (
    <section className={s.panel}>
      <dl className={s.grid}>
        <div className={s.item}>
          <dt>ID del periodo</dt>
          <dd>{detalle.periodId}</dd>
        </div>

        <div className={s.item}>
          <dt>Año</dt>
          <dd>{detalle.anio}</dd>
        </div>

        <div className={s.item}>
          <dt>Quincena</dt>
          <dd>{detalle.quincena}</dd>
        </div>

        <div className={s.item}>
          <dt>Código del periodo</dt>
          <dd>{detalle.periodoCode}</dd>
        </div>

        <div className={s.item}>
          <dt>Fecha de inicio</dt>
          <dd>{formatNominaDate(detalle.fechaInicio)}</dd>
        </div>

        <div className={s.item}>
          <dt>Fecha de fin</dt>
          <dd>{formatNominaDate(detalle.fechaFin)}</dd>
        </div>

        <div className={s.item}>
          <dt>Fecha de pago estimada</dt>
          <dd>{formatNominaDate(detalle.fechaPagoEstimada)}</dd>
        </div>
      </dl>
    </section>
  );
}