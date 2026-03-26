import type { NominaRecibosSummaryItem } from '../types/nomina-recibos-view.types';
import s from './NominaRecibosContentHeader.module.css';

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  status?: string;
  summaryItems?: NominaRecibosSummaryItem[];
  showSummary?: boolean;
};

export default function NominaRecibosContentHeader({
  eyebrow,
  title,
  description,
  status,
  summaryItems = [],
  showSummary = false,
}: Props) {
  return (
    <section className={s.wrapper}>
      <div className={s.header}>
        <div className={s.copy}>
          <span className={s.eyebrow}>{eyebrow}</span>
          <h3 className={s.title}>{title}</h3>
          <p className={s.description}>{description}</p>
        </div>
      </div>

      {showSummary ? (
        <div className={s.summaryBlock}>
          {status ? <div className={s.statusBox}>{status}</div> : null}

          <div className={s.summaryGrid}>
            {summaryItems.map((item) => (
              <div className={s.summaryItem} key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}