import type { ReactNode } from 'react';
import { CalendarDays, CalendarRange, CreditCard } from 'lucide-react';

import type { PeriodoNominaDto } from '@/features/admin/nomina/shared/model/periodos.types';

import {
  formatNominaCompactPeriod,
  formatNominaDate,
} from '../../model/configuracion.selectors';
import s from './PeriodosTable.module.css';

type Props = {
  emptyState?: ReactNode;
  items: PeriodoNominaDto[];
  metaText?: string;
  onSelect: (item: PeriodoNominaDto) => void;
  selectedId?: number | null;
  toolbar?: ReactNode;
};

export default function PeriodosTable({
  emptyState,
  items,
  metaText,
  onSelect,
  selectedId,
  toolbar,
}: Props) {
  return (
    <section className={s.wrap}>
      <div className={s.header}>
        <h4 className={s.title}>Períodos registrados</h4>
        <span className={s.meta}>{metaText ?? `${items.length} registros`}</span>
      </div>

      {toolbar ? <div className={s.toolbarSlot}>{toolbar}</div> : null}

      {items.length > 0 ? (
        <div className={s.list}>
          {items.map((item) => {
            const isSelected = item.periodId === selectedId;

            return (
              <button
                key={item.periodId}
                type="button"
                className={`${s.row} ${isSelected ? s.selected : ''}`}
                onClick={() => onSelect(item)}
              >
                <div className={s.identity}>
                  <span className={s.idBadge}>#{item.periodId}</span>

                  <div className={s.periodCopy}>
                    <strong>
                      {formatNominaCompactPeriod(item.anio, item.quincena, item.periodoCode)}
                    </strong>
                    <span>Período de nómina</span>
                  </div>
                </div>

                <div className={s.timeline}>
                  <div className={s.timelineBar} />

                  <div className={s.step}>
                    <div className={s.stepIcon}>
                      <CalendarDays size={14} />
                    </div>
                    <div className={s.stepCopy}>
                      <span>Inicio</span>
                      <strong>{formatNominaDate(item.fechaInicio)}</strong>
                    </div>
                  </div>

                  <div className={s.step}>
                    <div className={s.stepIcon}>
                      <CalendarRange size={14} />
                    </div>
                    <div className={s.stepCopy}>
                      <span>Fin</span>
                      <strong>{formatNominaDate(item.fechaFin)}</strong>
                    </div>
                  </div>

                  <div className={s.step}>
                    <div className={s.stepIcon}>
                      <CreditCard size={14} />
                    </div>
                    <div className={s.stepCopy}>
                      <span>Pago</span>
                      <strong>{formatNominaDate(item.fechaPagoEstimada)}</strong>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        emptyState
      )}
    </section>
  );
}
