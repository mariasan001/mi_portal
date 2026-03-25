import type { NominaRecibosSummaryItem } from '../types/nomina-recibos-view.types';
import s from './NominaRecibosContentHeader.module.css';

type Props = {
  title: string;
  description: string;
  status: string;
  summaryItems: NominaRecibosSummaryItem[];
};

export default function NominaRecibosContentHeader({
  title,
  description,
  status,
  summaryItems,
}: Props) {
  return (
    <section className={s.header}>
      <div className={s.copy}>
        <p className={s.kicker}>Resumen operativo</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className={s.statusBox}>{status}</div>
      </div>

      <div className={s.summaryGrid}>
        {summaryItems.map((item) => (
          <div className={s.summaryItem} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}