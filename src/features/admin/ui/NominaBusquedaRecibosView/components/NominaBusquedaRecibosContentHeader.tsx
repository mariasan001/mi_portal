import type { NominaBusquedaRecibosSummaryItem } from '../types/nomina-busqueda-recibos-view.types';
import s from './NominaBusquedaRecibosContentHeader.module.css';

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  summaryItems: NominaBusquedaRecibosSummaryItem[];
  showSummary: boolean;
};

export default function NominaBusquedaRecibosContentHeader({
  eyebrow,
  title,
  description,
  summaryItems,
  showSummary,
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
        <div className={s.summaryGrid}>
          {summaryItems.map((item) => (
            <div className={s.summaryItem} key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}