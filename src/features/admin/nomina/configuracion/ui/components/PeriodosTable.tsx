import type { PeriodoNominaDto } from '@/features/admin/nomina/shared/model/periodos.types';
import {
  formatNominaCompactPeriod,
  formatNominaDate,
} from '../../model/configuracion.selectors';
import s from './ConfiguracionDataTable.module.css';

type Props = {
  items: PeriodoNominaDto[];
  selectedId?: number | null;
  onSelect: (item: PeriodoNominaDto) => void;
};

export default function PeriodosTable({ items, selectedId, onSelect }: Props) {
  return (
    <section className={s.wrap}>
      <div className={s.header}>
        <h4 className={s.title}>Períodos registrados</h4>
        <span className={s.meta}>{items.length} registros</span>
      </div>

      <div className={s.surface}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Período</th>
              <th>Código</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Pago</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.periodId}
                className={item.periodId === selectedId ? s.selected : undefined}
              >
                <td>
                  <button
                    type="button"
                    className={`${s.rowButton} ${s.strong}`}
                    onClick={() => onSelect(item)}
                  >
                    {item.periodId}
                  </button>
                </td>
                <td>{formatNominaCompactPeriod(item.anio, item.quincena, item.periodoCode)}</td>
                <td className={s.strong}>{item.periodoCode || '-'}</td>
                <td>{formatNominaDate(item.fechaInicio)}</td>
                <td>{formatNominaDate(item.fechaFin)}</td>
                <td>{formatNominaDate(item.fechaPagoEstimada)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
