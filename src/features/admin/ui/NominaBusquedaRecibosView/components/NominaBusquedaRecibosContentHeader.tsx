import type { NominaBusquedaRecibosSummaryItem } from '../types/nomina-busqueda-recibos-view.types';
import s from './NominaBusquedaRecibosContentHeader.module.css';

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  summaryItems?: NominaBusquedaRecibosSummaryItem[];
  showSummary?: boolean;
};

export default function NominaBusquedaRecibosContentHeader({
  eyebrow,
  title,
  description,
  summaryItems = [],
  showSummary = false,
}: Props) {
  return (
    <section className={s.wrapper}>
      <div className={`${s.header} ${s.enter}`}>
        <div className={s.copy}>
          <span className={`${s.eyebrow} ${s.enterLeft}`}>{eyebrow}</span>
          <h3 className={`${s.title} ${s.enterSoft}`}>{title}</h3>
          {description ? (
            <p className={`${s.description} ${s.enterSoftDelay}`}>{description}</p>
          ) : null}
        </div>
      </div>

      {showSummary && summaryItems.length ? (
        <div className={`${s.summaryBlock} ${s.enterSoft}`}>
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
